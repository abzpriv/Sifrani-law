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
    <body style="font-family: 'Garamond', serif; margin: 0; padding: 0; background-color: #222222; color: #f5f5f5;">
      <div style="max-width: 700px; margin: 0 auto; background-color: #2c2f36; padding: 40px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);">
        <div style="background-color: #1a1c20; color: #ffffff; padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 40px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #e0e0e0;">Contact Form Submission</h1>
        </div>
        <div style="margin-top: 25px;">
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #d0d3d8;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #d0d3d8;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #d0d3d8;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #343a40; border-left: 6px solid #555555; border-radius: 10px; padding: 25px; margin-top: 25px; font-size: 18px; color: #c8c8c8;">
          <p style="font-size: 20px; font-weight: 700; color: #e0e0e0;">Message:</p>
          <p style="font-size: 18px; color: #f5f5f5; line-height: 1.8;">${message}</p>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #9e9e9e;">
          <p>Sent from your Sifrani Law contact form. &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    </body>
  </html>
`;

  // Email content for light theme
  const lightThemeHTML = `
  <html>
    <body style="font-family: 'Garamond', serif; margin: 0; padding: 0; background-color: #ffffff; color: #333333;">
      <div style="max-width: 700px; margin: 0 auto; background-color: #f8f9fa; padding: 40px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #555555; color: #ffffff; padding: 25px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 40px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #e0e0e0;">Contact Form Submission</h1>
        </div>
        <div style="margin-top: 25px;">
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #555555;"><strong>Name:</strong> ${name}</p>
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #555555;"><strong>Email:</strong> ${email}</p>
          <p style="font-size: 20px; line-height: 1.8; margin-bottom: 12px; color: #555555;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #f1f3f5; border-left: 6px solid #888888; border-radius: 10px; padding: 25px; margin-top: 25px; font-size: 18px; color: #333333;">
          <p style="font-size: 20px; font-weight: 700; color: #555555;">Message:</p>
          <p style="font-size: 18px; color: #333333; line-height: 1.8;">${message}</p>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #888888;">
          <p>Sent from your Safrani law contact form. &copy; ${new Date().getFullYear()}</p>
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

    // Determine the logo and background color based on the theme
    const isDarkTheme = false; // Set to `true` for dark theme, `false` for light theme
    const logo = isDarkTheme
      ? "http://safranilaw.com/LogoWhite.png" // Dark theme logo
      : "http://safranilaw.com/Logo.png"; // Light theme logo

    // Dark theme: dark background for body, light background for content. Light theme: opposite.
    const backgroundColor = isDarkTheme ? "#222222" : "#ffffff"; // Dark background for the page in dark theme
    const contentBackgroundColor = "#ffffff"; // Light background for the content box
    const textColor = isDarkTheme ? "#f5f5f5" : "#333333"; // Light text for dark theme

    const customerMailOptions = {
      from: process.env.GMAIL_USER, // Your email address
      to: email, // Customer's email address
      subject: "Thank You for Reaching Out to Sifrani Law",
      html: `
  <html>
    <body style="font-family: 'Garamond', serif; margin: 0; padding: 0; background-color: ${backgroundColor}; color: ${textColor};">
      <div style="max-width: 700px; margin: 0 auto; padding: 40px; border-radius: 10px; background-color: ${contentBackgroundColor}; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <!-- Logo and Sifrani Law in one line -->
        <div style="display: flex; justify-content: flex-start; align-items: center; background-color: transparent;">
          <img src="${logo}" alt="Sifrani Law Logo" style="max-height: 40px; margin-right: 10px;">
          <span style="font-size: 24px; font-weight: bold; color: ${textColor};">| Sifrani Law</span>
        </div>

        <h2 style="text-align: center; color: ${
          isDarkTheme ? "#e0e0e0" : "#555555"
        };">Thank You for Reaching Out</h2>
        <p style="font-size: 18px; line-height: 1.6;">Dear ${name},</p>
        <p style="font-size: 18px; line-height: 1.6;">Thank you for choosing Sifrani Law as your trusted legal guide. We appreciate you taking the time to contact us, and we are committed to providing you with the best possible service. Our team is reviewing your message and will get back to you as soon as possible with a tailored response.</p>
        <p style="font-size: 18px; line-height: 1.6;">Please note that this is an auto-generated email, and we kindly ask that you do not reply to this message. If you have any urgent inquiries, feel free to contact us directly through our official channels.</p>
        <div style="text-align: center; margin-top: 30px; font-size: 14px; color: ${
          isDarkTheme ? "#888888" : "#555555"
        };">
          <p>We will get back to you shortly. Thank you for your patience.</p>
          <p>&copy; ${new Date().getFullYear()} Safrani Law</p>
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
