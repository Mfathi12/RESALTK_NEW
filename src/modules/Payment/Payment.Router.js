<<<<<<< HEAD
/* import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Unified Intention API (Paymob New Version)
router.post("/pay", async (req, res, next) => {
  try {
    const { name, email, phoneNumber, country, realprice } = req.body;

    // تحويل السعر إلى قرش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: [5306638], // Integration ID
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
});

export default router;
 */
/* import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Unified Intention API (Paymob New Version)
router.post("/pay", async (req, res, next) => {
  try {
    const { name, email, phoneNumber, country, realprice } = req.body;

    // تحويل السعر إلى قرش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      `${process.env.PAYMOB_API_URL}/intention/`,
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: [process.env.PAYMOB_INTEGRATION_ID], // Integration ID
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
});

export default router;
 */
=======
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Unified Intention API (Paymob New Version)
router.post("/pay", async (req, res, next) => {
  try {
    const { name, email, phoneNumber, country, realprice } = req.body;

<<<<<<< HEAD
    // تحويل السعر إلى قروش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      process.env.PAYMOB_API_URL, // https://accept.paymob.com/v1/intention
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_INTEGRATION_ID)], // Integration ID من .env
=======
    // تحويل السعر إلى قرش (Paymob لازم بالـ cents)
    let finalPrice = Number(realprice) * 100;

    // 👇 لو عاوزة conversion (مثلاً من USD لـ EGP) تقدري تحطي هنا
    // finalPrice = convertedValue * 100;

    // ✅ طلب إنشاء Intention
    const intentionRes = await axios.post(
      process.env.PAYMOB_API_URL,
      {
        amount: finalPrice,
        currency: "EGP",
        payment_methods: ["card"], // أو Integration ID مباشر
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
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
<<<<<<< HEAD
          email: email || "guest@test.com",
          phone_number: phoneNumber || "01000000000",
          country: country || "EG",
          city: "Cairo",
=======
          email: email,
          phone_number: phoneNumber,
          country: country || "EG",
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
          street: "NA",
          building: "NA",
          floor: "NA",
          apartment: "NA",
          state: "NA",
<<<<<<< HEAD
          postal_code: "00000",
=======
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
        },
        customer: {
          first_name: name || "Guest",
          last_name: name || "User",
<<<<<<< HEAD
          email: email || "guest@test.com",
          country: country || "EG",
          phone_number: phoneNumber || "01000000000",
=======
          email: email,
          country: country || "EG",
          phone_number: phoneNumber,
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
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

<<<<<<< HEAD
    if (!clientSecret) {
      throw new Error("Missing client_secret from Paymob response");
    }

=======
>>>>>>> b157b2f7ec703569c584954c0325f127802af9fe
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
});

export default router;
