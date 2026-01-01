const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("@google-cloud/dialogflow");
const { v4: uuidv4 } = require("uuid");
const open = require("open");

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(bodyParser.json());

// ⬇️ INI YANG KAMU TANYAKAN (WAJIB DI SINI)
app.use(express.static("public"));

/* ======================
   DIALOGFLOW CONFIG
====================== */
const projectId = "chatbot-puskesmas-h9mi";
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "chatbot-puskesmas-h9mi.json",
});

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

/* ======================
   SERVER
====================== */


app.listen(2000, () => {
  console.log("🚀 Server jalan di http://localhost:2000");
})
//   // buka otomatis di Chrome
//   open("http://localhost:2000", {
//     app: {
//       name: "chrome"
//     }
//   });
// });
