const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 📩 Cloud Function لإرسال إشعار
exports.sendNotification = functions.https.onRequest(async (req, res) => {
  try {
    const {token, title, body} = req.body;

    if (!token || !title || !body) {
      return res.status(400).send("token, title, and body are required");
    }

    const message = {
      notification: {title, body},
      token,
    };

    // إرسال الإشعار
    await admin.messaging().send(message);
    return res.status(200).send("Notification sent successfully ");
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).send("Failed to send notification ");
  }
});
