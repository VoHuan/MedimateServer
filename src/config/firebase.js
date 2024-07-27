const admin = require('firebase-admin');
const serviceAccount = require('../../clientsellingmedicine-firebase-adminsdk-eitg1-8d197674f6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;