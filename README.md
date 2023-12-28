
_****Auto Reply Gmail Bot using Node.js****_
**Description**
This repository contains the code for openinapp assignment developed using Node.js and Google APIs. The application is designed to automatically respond to emails in your Gmail mailbox while you are busy.

**Features**
Node.js clusters support.
Checks for new emails in a specified Gmail ID.
Sends replies to emails without prior responses.
Adds a label to the email and moves it to the labeled folder.
Periodically performs the above steps within a random time interval ranging from 45 to 120 seconds.

**Libraries**
googleapis: This package is imported from the googleapis module, providing essential functionality to interact with various Google APIs, including the Gmail API.
OAuth2: The OAuth2 class from the google.auth module is utilized to authenticate the application and obtain an access token for making requests to the Gmail API. It handles token refresh and retrying requests if necessary.

**Getting Started**
To set up OAuth 2.0 authentication for your application, follow these steps:

1. Go to the Google Cloud Console and create a new project.
2. Click on the project name to navigate to the project dashboard.
3. In the left sidebar, click on the "Credentials" tab under the "APIs & Services" section.
4. On the Credentials page, click on the "Create credentials" button and select "OAuth client ID" from the dropdown menu.
5. Choose "Web application" as the application type and provide a name for the OAuth 2.0 client ID.
6. Enter the authorized redirect URI (e.g., "https://developers.google.com/oauthplayground").
7. Click "Create" to obtain the client ID and client secret, and also enable the Gmail API.
8. Open the OAuth 2.0 Playground.
9. Enter the client ID and client secret in the playground settings.
10. In "Step 1: Select & authorize APIs," enter https://mail.google.com and select the appropriate Gmail API scope.
11. Click "Authorize APIs" and sign in with the Google account associated with the Gmail account.
12. Copy the authorization code, click "Exchange authorization code for tokens," .
13. Replace placeholder values in credentials.js with obtained values: CLIENT_ID, CLIENT_SECRET and REDIRECT_URI.
Save the credentials.js file.
Installation and Running
bash
Copy code
# git clone link
(git clone https://github.com/ghostbadfame/openinapp-assignment.git)

# Install NPM dependencies
npm install

# Install googleapis and nodemon
npm install googleapis nodemon google-auth-library dotenv express open

# Start the app
npm start

**#Code Improvements**
Note on areas where your code can be improved:

Error Handling: Enhance error handling for more robust execution.
Code Efficiency: Optimize the code to handle larger volumes of emails efficiently.
Security: Ensure secure storage of sensitive information, such as client secrets and refresh tokens.
User-specific Configuration: Allow users to provide their configuration options, such as email filters or customized reply messages.
Time Monitoring: Improve time monitoring by using the cron jobs package to schedule email tasks.
