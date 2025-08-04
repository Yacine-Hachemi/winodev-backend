require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["https://winodev.com", "http://localhost:3000"], 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour envoyer des emails
app.post("/send", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Envoyer l'email
    await transporter.sendMail({
      from: '"Winodev Contact" <contact@winodev.com>', 
      replyTo: email, 
      to: "contact@winodev.com", 
      subject: `Nouveau message: ${subject}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    res.status(200).send("Email envoyé avec succès");
  } catch (error) {
    console.error("Erreur d'envoi:", error);
    res.status(500).send("Erreur lors de l'envoi de l'email: " + error.message);
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});