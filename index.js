const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
require("dotenv");
const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
];

//keep track of users already replied to using repliedUsers
const repliedUsers = new Set();

app.get('/', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});


app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('Error retrieving access token:', error.message);
    res.status(500).send('Error during authentication');
  }
});

app.get('/send-replies', async (req, res) => {
    sendReplies;
});

//Step 1. check for new emails and sends replies .
async function sendReplies() {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Get the list of unread messages.
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "in:inbox",  // Adjust the query as needed
      maxResults: 5,
      orderBy: "internalDate",  // Order by internal date in descending order
    });
    const messages = res.data.messages;

    if (messages && messages.length > 0) {
      // Fetching complete message details.
      for (const message of messages) {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        
        // Extracting data from headers
        const from = email.data.payload.headers.find(
          (header) => header.name === "From"
        );
        const toHeader = email.data.payload.headers.find(
          (header) => header.name === "To"
        );
        const Subject = email.data.payload.headers.find(
          (header) => header.name === "Subject"
        );
        //who sends email extracted
        const From = from.value;
        //who gets email extracted
        const toEmail = toHeader.value;
        //subject of unread email
        const subject = Subject.value;
        console.log("email come From", From);
        console.log("to Email", toEmail);
        //check if the user already been replied to
        if (repliedUsers.has(From)) {
          console.log("Already replied to : ", From);
          continue;
        }
        // 2.send replies to Emails that have no prior replies
        // Check if the email has any replies.
        const thread = await gmail.users.threads.get({
          userId: "me",
          id: message.threadId,
        });

        //isolated the email into threads
        const replies = thread.data.messages.slice(1);

        if (replies.length === 0) {
          // Reply to the email.
          await gmail.users.messages.send({
            userId: "me",
            requestBody: {
              raw: await createReplyRaw(toEmail, From, subject),
            },
          });

          // Add a label to the email.
          const labelName = "onMars";
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            requestBody: {
              addLabelIds: [await createLabel(labelName)],
            },
          });

          console.log("Sent reply to email:", From);
          //Add the user to replied users set
          repliedUsers.add(From);
        }
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

//converts string to base64EncodedEmail format
async function createReplyRaw(from, to, subject) {
  const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\nUnavaliable Right now !!!!!`;
  const base64EncodedEmail = Buffer.from(emailContent)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return base64EncodedEmail;
}

// 3.add a Label to the email and move the email to the label
async function createLabel(labelName) {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  // Check if the label already exists.
  const res = await gmail.users.labels.list({ userId: "me" });
  const labels = res.data.labels;

  const existingLabel = labels.find((label) => label.name === labelName);
  if (existingLabel) {
    return existingLabel.id;
  }

  // Create the label if it doesn't exist.
  const newLabel = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      name: labelName,
      labelListVisibility: "labelShow",
      messageListVisibility: "show",
    },
  });

  return newLabel.data.id;
}

/*4.repeat this sequence of steps 1-3 in random intervals of 45 to 120 seconds*/
function Interval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Setting Interval and calling main function in every interval
setInterval(sendReplies, Interval(45, 120) * 1000);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
