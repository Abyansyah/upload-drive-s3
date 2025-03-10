const { google } = require('googleapis');
require('dotenv').config();

const auth = new google.auth.OAuth2(process.env.GOOGLE_DRIVE_CLIENT_ID, process.env.GOOGLE_DRIVE_CLIENT_SECRET);

auth.setCredentials({
  refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
});

const drive = google.drive({
  version: 'v3',
  auth,
});

module.exports = drive;
