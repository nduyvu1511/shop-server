const admin = require("firebase-admin")

const serviceAccount = require("./food-project-c7d12-firebase-adminsdk-w4muv-35f262fcf0.json")

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})
