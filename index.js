import express from "express";
import bodyParser from "body-parser";
import dialogflow from "@google-cloud/dialogflow";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

/* ======================
   FIX __dirname (ESM)
====================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ======================
   MIDDLEWARE
====================== */
app.use(bodyParser.json());
app.use(express.static("public",));

/* ======================
   DIALOGFLOW CONFIG
====================== */
const projectId = process.env.PROJECT_ID;
const sessionClient = new dialogflow.SessionsClient({
  credentials: process.env.GOOGLE_CREDENTIALS
    ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
    : undefined,});

/* ======================
   API CHATBOT
====================== */
app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const sessionId = uuidv4();

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "id",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      reply: result.fulfillmentText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Terjadi kesalahan server" });
  }
});

const port = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server jalan di http://localhost:${port}`);
  });
}

module.exports = app;
