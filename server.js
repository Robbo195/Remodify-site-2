
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
const https = require('https');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Configure nodemailer transporter
let transporter = null;
if (!process.env.USE_GRAPH || process.env.USE_GRAPH !== 'true') {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'Outlook',
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your email password or app-specific password
    }
  });
}

// Helper: get Microsoft Graph access token using client credentials
const getGraphToken = () => {
  return new Promise((resolve, reject) => {
    const tenant = process.env.AZURE_TENANT_ID;
    const postData = querystring.stringify({
      client_id: process.env.AZURE_CLIENT_ID || '',
      client_secret: process.env.AZURE_CLIENT_SECRET || '',
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    });

    const options = {
      hostname: 'login.microsoftonline.com',
      path: `/${tenant}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) return resolve(parsed.access_token);
          console.error('getGraphToken: unexpected token response', { statusCode: res.statusCode, body: data });
          return reject(new Error('No access_token in response: ' + data));
        } catch (err) {
          console.error('getGraphToken: failed to parse token response', { err: err.message, body: data });
          return reject(err);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

// Helper: send mail via Microsoft Graph using app-only token
const sendMailGraph = async ({ from, to, subject, html, replyTo }) => {
  const token = await getGraphToken();
  const messageObj = {
    subject,
    body: {
      contentType: 'HTML',
      content: html
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ]
  };

  // include explicit From header and optional Reply-To
  messageObj.from = { emailAddress: { address: from } };
  if (replyTo) {
    messageObj.replyTo = [{ emailAddress: { address: replyTo } }];
  }

  const postBody = JSON.stringify({ message: messageObj, saveToSentItems: true });

  // log payload (no secrets) for debugging headers
  console.log('sendMailGraph payload:', messageObj);

  const options = {
    hostname: 'graph.microsoft.com',
    path: `/v1.0/users/${encodeURIComponent(from)}/sendMail`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(data);
        console.error('sendMailGraph failed', { statusCode: res.statusCode, body: data });
        return reject(new Error(`Graph sendMail failed ${res.statusCode}: ${data}`));
      });
    });

    req.on('error', (e) => {
      console.error('sendMailGraph request error', e && e.message ? e.message : e);
      reject(e);
    });
    req.write(postBody);
    req.end();
  });
};

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  
  try {
    // Email options
    const toAddress = process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER;
    const subject = `New Contact Form Submission from ${name}`;
    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    if (process.env.USE_GRAPH && process.env.USE_GRAPH === 'true') {
      // Using Microsoft Graph API (app-only) to send mail as a user
      const fromUser = process.env.GRAPH_SENDER || process.env.EMAIL_USER;
      console.log('send: using Graph, replyTo set to', email);
      await sendMailGraph({ from: fromUser, to: toAddress, subject, html: htmlBody, replyTo: email });
      console.log(`Message sent via Graph from ${fromUser} on behalf of ${name} (${email})`);
      return res.json({ success: true });
    }

    if (!transporter) throw new Error('No mail transporter configured');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toAddress,
      subject,
      html: htmlBody,
      replyTo: email // Allow replying directly to the sender
    };

    // Send email via SMTP transporter
    await transporter.sendMail(mailOptions);
    console.log(`Message sent from ${name} (${email})`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
