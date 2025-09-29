import express from "express";
import axios from "axios";
import { Services } from "../../../DB/models/Services.js";

const router = express.Router();

// ✅ Unified Intention API (Paymob New Version)
/* router.post("/pay", async (req, res) => {
  try {
    const { name, email, phoneNumber, country, realprice } = req.body;

    // تحويل السعر إلى قروش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      process.env.PAYMOB_API_URL, // https://accept.paymob.com/v1/intention
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)], // Integration ID من .env
        items: [
          {
            name: "Service/Donation",
            amount: finalPrice,
            description: "Payment through Resaltk",
            quantity: 1,
          },
        ],
        billing_data: {
          first_name: name || "Guest",
          last_name: name || "User",
          email: email || "guest@test.com",
          phone_number: phoneNumber || "01000000000",
          country: country || "EG",
          city: "Cairo",
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA",
          state: "NA",
          postal_code: "00000",
        },
        customer: {
          first_name: name || "Guest",
          last_name: name || "User",
          email: email || "guest@test.com",
          country: country || "EG",
          phone_number: phoneNumber || "01000000000",
        },
        extras: {
          project: "RESALTK",
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = intentionRes.data;
    const clientSecret = data.client_secret;

    if (!clientSecret) {
      throw new Error("Missing client_secret from Paymob response");
    }

    // ✅ Unified Checkout URL
    const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

    res.json({
      success: true,
      checkoutUrl,
      paymentDetails: data,
    });
  } catch (err) {
    console.error("Payment error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: err?.response?.data || err.message,
    });
  }
}); */

router.post("/pay/:serviceId", async (req, res) => {
  try {
    const { name, email, phoneNumber, country } = req.body;
    const { serviceId } = req.params;

    // 1️⃣ نجيب الخدمة من DB
    const service = await Services.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2️⃣ نجيب السعر ونحوله لقروش (Paymob بيشتغل بـ cents)
    let finalPrice = Number(service.amount) * 100;

    // 3️⃣ نعمل Intention عند Paymob
    const intentionRes = await axios.post(
      process.env.PAYMOB_API_URL, // لازم يبقى كدة
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)], // Integration ID
        items: [
          {
            name: service.serviceType || "Service",
            amount: finalPrice,
            description: service.description || "Payment through Resaltk",
            quantity: 1,
          },
        ],
        billing_data: {
          first_name: name || "Guest",
          last_name: "User",
          email: email || "guest@test.com",
          phone_number: phoneNumber || "01000000000",
          country: country || "EG",
          city: "Cairo",
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA",
          state: "NA",
          postal_code: "00000",
        },
        customer: {
          first_name: name || "Guest",
          last_name: "User",
          email: email || "guest@test.com",
          country: country || "EG",
          phone_number: phoneNumber || "01000000000",
        },
        extras: {
          project: "RESALTK",
          serviceId, // نحتفظ بالـ serviceId جوة Paymob للمرجعة
        },
      },
      {
        headers: {
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = intentionRes.data;
    const clientSecret = data.client_secret;

    if (!clientSecret) {
      throw new Error("Missing client_secret from Paymob response");
    }

    // 4️⃣ نرجع لينك الـ checkout
    const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${clientSecret}`;

    res.json({
      success: true,
      checkoutUrl,
      paymentDetails: data,
    });
  } catch (err) {
    console.error("Payment error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: err?.response?.data || err.message,
    });
  }
});
router.post("/paymob/webhook", async (req, res) => {
  try {
    const { obj } = req.body;

    if (obj && obj.success && obj.order && obj.order.merchant_order_id) {
      const serviceId = obj.order.merchant_order_id; 

      await Services.findByIdAndUpdate(serviceId, { status: "completed" });

      return res.json({ success: true, message: "Service marked as completed" });
    }

    res.status(400).json({ success: false, message: "Invalid webhook data" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
