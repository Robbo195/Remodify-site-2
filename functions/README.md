Deploying Cloud Functions

1. Install Firebase CLI and log in:
   npm install -g firebase-tools
   firebase login

2. From the repository root (where functions/ lives) initialize if not done:
   firebase init functions

3. Install deps inside functions:
   cd functions
   npm install

4. Deploy only functions:
   firebase deploy --only functions

Notes:
- The callable function `createListing` expects authenticated callers.
- The function currently makes uploaded files public; adjust storage ACLs if necessary.
