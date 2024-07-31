const admin = require('firebase-admin');
const serviceAccount = require('../../clientsellingmedicine-firebase-adminsdk-eitg1-697a6dcb9b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;