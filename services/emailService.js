const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async ({ email, name, otp }) => {
  try {

    console.log(`
====================================
ShipEase OTP Verification
====================================
User: ${name}
Email: ${email}
OTP: ${otp}
====================================
`);

    const info = await transporter.sendMail({
      from: `"ShipEase" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "ShipEase Verification OTP",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name}</h2>

          <p>Your OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>This OTP expires in 5 minutes.</p>
        </div>
      `,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
    console.log(info.response);

    return true;

  } catch (error) {

    console.error("EMAIL ERROR:");
    console.error(error);

    return false;
  }
};

module.exports = {
  sendOtpEmail,
};  