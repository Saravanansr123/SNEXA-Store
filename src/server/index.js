const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const subscribers = new Set(); // replace with DB later

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email required" });

  if (subscribers.has(email))
    return res.status(409).json({ message: "Already subscribed" });

  subscribers.add(email);

  try {
    // 📩 Email to user
    await transporter.sendMail({
      from: "SNEXA <YOUR_EMAIL@gmail.com>",
      to: email,
      subject: "Welcome to SNEXA 🎉",
      html: `
        <h2>Welcome to SNEXA!</h2>
        <p>You’re now subscribed to exclusive updates.</p>
      `,
    });

    // 📧 Email to admin
    await transporter.sendMail({
      from: "SNEXA <YOUR_EMAIL@gmail.com>",
      to: "admin@snexa.com",
      subject: "New Newsletter Subscriber",
      text: `New subscriber: ${email}`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Email sending failed" });
  }
});

app.listen(5000, () =>
  console.log("Newsletter API running on http://localhost:5000")
);
