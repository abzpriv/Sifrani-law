// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create Nodemailer transporter using Gmail and environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Use email from .env file
    pass: process.env.GMAIL_PASS, // Use app password from .env file
  },
});

// POST route to send email
app.post("/send-email", (req, res) => {
  const { name, email, subject, message, theme } = req.body; // Added theme parameter to choose the theme

  // Check if the theme is dark or light; default to dark if not specified
  const isDarkTheme = theme === "dark";

  // Email content for dark theme
  const darkThemeHTML = `
<html>
  <body style="font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background-color: #121212; color: #e0e0e0;">
    <div style="max-width: 750px; margin: 0 auto; background-color: #1d1d1d; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);">
      <!-- Header Section -->
      <div style="background-color: #252525; padding: 25px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 4px solid #3a3a3a;">
        <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #f0f0f0;">Safrani Law</h1>
        <p style="margin: 0; font-size: 16px; color: #aaaaaa;">Professional Legal Solutions at Your Fingertips</p>
      </div>

      <!-- Body Section -->
      <div style="padding: 30px;">
        <h2 style="color: #e0e0e0; font-size: 28px; margin-bottom: 20px;">Contact Form Submission</h2>
        <div style="margin-bottom: 20px;">
          <p style="font-size: 18px; color: #bcbcbc; margin: 0;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 18px; color: #bcbcbc; margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 18px; color: #bcbcbc; margin: 0;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #2c2c2c; padding: 20px; border-left: 6px solid #0073e6; border-radius: 8px; margin-top: 20px;">
          <p style="font-size: 20px; font-weight: bold; margin: 0; color: #ffffff;">Message:</p>
          <p style="font-size: 18px; line-height: 1.8; color: #dcdcdc;">${message}</p>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="background-color: #252525; text-align: center; padding: 20px; border-radius: 0 0 12px 12px; border-top: 4px solid #3a3a3a;">
        <p style="font-size: 14px; color: #888888;">Sent from your Safrani Law contact form. &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  </body>
</html>
`;

  // Email content for light theme
  const lightThemeHTML = `
<html>
  <body style="font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background-color: #f7f8fa; color: #333;">
    <div style="max-width: 750px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
      <!-- Header Section -->
      <div style="background-color: #00509e; padding: 25px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 4px solid #003f7d;">
        <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #ffffff;">Safrani Law</h1>
        <p style="margin: 0; font-size: 16px; color: #dfe6ee;">Professional Legal Solutions at Your Fingertips</p>
      </div>

      <!-- Body Section -->
      <div style="padding: 30px;">
        <h2 style="color: #00509e; font-size: 28px; margin-bottom: 20px;">Contact Form Submission</h2>
        <div style="margin-bottom: 20px;">
          <p style="font-size: 18px; color: #555; margin: 0;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 18px; color: #555; margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 18px; color: #555; margin: 0;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #f1f4f9; padding: 20px; border-left: 6px solid #00509e; border-radius: 8px; margin-top: 20px;">
          <p style="font-size: 20px; font-weight: bold; margin: 0; color: #003f7d;">Message:</p>
          <p style="font-size: 18px; line-height: 1.8; color: #333;">${message}</p>
        </div>
      </div>

      <!-- Footer Section -->
      <div style="background-color: #00509e; text-align: center; padding: 20px; border-radius: 0 0 12px 12px; border-top: 4px solid #003f7d;">
        <p style="font-size: 14px; color: #dfe6ee;">Sent from your Safrani Law contact form. &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  </body>
</html>
`;

  // Select the correct HTML content based on the theme
  const htmlContent = isDarkTheme ? darkThemeHTML : lightThemeHTML;

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER, // Send email to your email address
    subject: `New Message from ${name} - ${subject}`,
    html: htmlContent, // Use the selected theme HTML content
  };

  // Send email to your email address
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }

    const customerMailOptions = {
      from: process.env.GMAIL_USER, // Your email address
      to: email, // Customer's email address
      subject: "Thank You for Reaching Out to Safrani Law",
      html: `
  <html>
    <head>
      <style>
        /* General Reset */
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f7;
          color: #333;
          line-height: 1.6;
        }

        .container {
          max-width: 700px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          padding: 0;
        }

        .header {
          background: #333333; /* Dark gray header */
          color: #ffffff;
          padding: 30px;
          text-align: center;
        }

        .header img {
          width: 150px; /* Slightly larger logo */
          height: 100px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .header h1 {
          font-size: 26px;
          margin: 15px 0 0;
          font-weight: bold;
        }

        .header p {
          font-size: 14px;
          margin: 5px 0 0;
        }

        .body {
          padding: 30px;
        }

        .body h2 {
          color: #333333;
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .body p {
          margin: 10px 0;
          font-size: 16px;
          color: #555555;
        }

        .body .highlight {
          background: #f9f9f9;
          padding: 15px;
          border-left: 5px solid #333333;
          margin: 20px 0;
          font-style: italic;
          color: #444444;
        }

        .footer {
          background: #f4f4f7;
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #888888;
        }

        .footer a {
          color: #333333;
          text-decoration: none;
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
          .header h1 {
            font-size: 22px;
          }

          .body p {
            font-size: 14px;
          }

          .body h2 {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header Section -->
        <div class="header">
          <img src="http://safranilaw.com/LogoWhite.png" alt="Safrani Law Logo">
          <h1>Safrani Law</h1>
          <p>Your Trusted Legal Partner</p>
        </div>

        <!-- Body Section -->
        <div class="body">
          <h2>Thank You for Reaching Out</h2>
          <p>Dear ${name},</p>
          <p>
            We appreciate your interest in Safrani Law and thank you for reaching out to us. Our dedicated team is
            currently reviewing your inquiry and will respond with a tailored solution shortly.
          </p>
          <div class="highlight">
            "Your legal matters are in safe hands. We are here to guide you every step of the way."
          </div>
          <p>
            Please note that this is an automated response. If your matter is urgent, feel free to contact us directly
            via our <a href="https://safranilaw.com/#contact" target="_blank">contact page</a>.
          </p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Safrani Law. All rights reserved.</p>
          <p>
            Visit us: <a href="http://safranilaw.com" target="_blank">www.safranilaw.com</a> | Call us: +92 320 4343047
          </p>
        </div>
      </div>
    </body>
  </html>
  `,
    };

    transporter.sendMail(customerMailOptions, (customerError, customerInfo) => {
      if (customerError) {
        return res.status(500).send(customerError.toString());
      }
      res.status(200).send("Email sent: " + info.response);
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
