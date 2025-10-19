const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();

// Helper to upload base64 image to Storage
async function uploadBase64Image(base64String, destPath) {
  // base64String expected like: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
  const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 image string');
  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  const file = storage.file(destPath);
  await file.save(buffer, { metadata: { contentType: mimeType } });
  await file.makePublic(); // or set appropriate ACL
  return `https://storage.googleapis.com/${storage.name}/${destPath}`;
}

exports.createListing = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {
    title, description, price, manufacturer, model, year,
    category, series, trimSpec, condition, negotiable, imagesBase64
  } = data;

  if (!title || !description || !price) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  const userId = context.auth.uid;

  // Upload images
  const uploadedUrls = [];
  if (Array.isArray(imagesBase64)) {
    for (let i = 0; i < imagesBase64.length; i++) {
      const destPath = `listings/${Date.now()}_${userId}_${i}.jpg`;
      const url = await uploadBase64Image(imagesBase64[i], destPath);
      uploadedUrls.push(url);
    }
  }

  // Create listing doc
  const listingRef = await db.collection('listings').add({
    title,
    description,
    price: Number(price),
    manufacturer: manufacturer || null,
    model: model || null,
    year: year || null,
    category: category || null,
    series: series || null,
    trimSpec: trimSpec || null,
    condition: condition || null,
    negotiable: !!negotiable,
    imageUrl: uploadedUrls[0] || null,
    files: uploadedUrls,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    userId
  });

  const listingDoc = await listingRef.get();
  const listingData = { id: listingRef.id, ...listingDoc.data() };

  // Buyer matching (same logic as client)
  const wantsSnapshot = await db.collection('wants').get();
  const wants = wantsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  const scoreWant = (want) => {
    let score = 0;
    if (want.desiredManufacturer && manufacturer && want.desiredManufacturer.toLowerCase() === manufacturer.toLowerCase()) score += 3;
    if (want.desiredModel && model && want.desiredModel.toLowerCase() === model.toLowerCase()) score += 3;
    if (want.desiredYear && year && want.desiredYear.toString() === year.toString()) score += 2;
    if (want.maxPrice && !isNaN(want.maxPrice) && price && Number(price) <= Number(want.maxPrice)) score += 2;
    if (want.desiredSeries && series && want.desiredSeries.toLowerCase() === series.toLowerCase()) score += 1;
    if (want.desiredTrim && trimSpec && want.desiredTrim.toLowerCase() === trimSpec.toLowerCase()) score += 1;
    return score;
  };

  const scored = wants.map(w => ({ ...w, score: scoreWant(w) }));
  scored.sort((a,b) => b.score - a.score);
  const top4 = scored.slice(0,4).filter(s => s.score > 0);

  for (const match of top4) {
    await db.collection('buyer_notifications').add({
      buyerId: match.userId || match.buyerId || null,
      wantId: match.id,
      listingId: listingRef.id,
      score: match.score,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      notified: false
    });
  }

  return { listing: listingData, matchedBuyers: top4.map(t => ({ id: t.id, score: t.score })) };
});
