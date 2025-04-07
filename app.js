const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'CYBER-DEXTER-MD-V1';
const REPO_NAME = 'CONTACT-PUSH-SITE-';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.json({ success: false, message: "No file uploaded" });

  const fileContent = fs.readFileSync(file.path, { encoding: 'base64' });
  const githubPath = `uploads/${file.originalname}`;
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${githubPath}`;

  try {
    await axios.put(apiUrl, {
      message: `Uploaded ${file.originalname}`,
      content: fileContent
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    fs.unlinkSync(file.path); // Clean up local file
    res.json({
      success: true,
      fileUrl: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${githubPath}`
    });
  } catch (err) {
    res.json({ success: false, message: "Upload failed", error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
