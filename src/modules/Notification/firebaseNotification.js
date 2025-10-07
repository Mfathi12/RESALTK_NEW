/* import admin from "firebase-admin";
import express from "express";

const router = express.Router();

// ✅ Firebase Admin Initialization
// لو عندك ملف serviceAccountKey.json نزّليه من Firebase Console
import serviceAccount from "../config/serviceAccountKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 📩 Endpoint لإرسال إشعار
router.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ message: "token, title, and body are required" });
    }

    const message = {
      notification: { title, body },
      token,
    };

    // ✉️ إرسال الإشعار عبر Firebase
    await admin.messaging().send(message);

    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ message: "Failed to send notification", error });
  }
});

export default router;
 */