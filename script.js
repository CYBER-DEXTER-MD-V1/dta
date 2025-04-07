const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// GitHub token and repository info
const githubToken = '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';  // Add your GitHub Access Token here
const repoOwner = 'CYBER-DEXTER-MD-V1';  // Your GitHub username
const repoName = 'CONTACT-PUSH-SITE-';  // Your GitHub repository name
const repoPath = 'data.json';  // Path to the data.json file in your repo

// Middleware to serve static files
app.use(express.static('public'));

// Route to handle file uploads
app.post('/upload', upload.fields([{ name: 'image' }, { name: 'audio' }, { name: 'video' }]), async (req, res) => {
    const files = req.files;
    
    if (!files || Object.keys(files).length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    // Create file metadata object
    const fileData = [];
    for (const field in files) {
        for (const file of files[field]) {
            fileData.push({
                field: field,
                filename: file.originalname,
                path: file.path,
                url: `https://github.com/${repoOwner}/${repoName}/blob/main/uploads/${file.filename}`
            });
        }
    }

    // Save metadata to GitHub repo (this is where the GitHub API comes in)
    try {
        // Read the existing data.json file from the GitHub repo
        const { data: fileContent } = await axios.get(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${repoPath}`,
            {
                headers: { Authorization: `Bearer ${githubToken}` }
            }
        );

        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const data = JSON.parse(decodedContent);
        data.push(...fileData);

        // Commit new data to the repo
        const newContent = JSON.stringify(data, null, 2);
        const encodedContent = Buffer.from(newContent).toString('base64');

        await axios.put(
            `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${repoPath}`,
            {
                message: 'Add new files',
                content: encodedContent,
                sha: fileContent.sha
            },
            {
                headers: { Authorization: `Bearer ${githubToken}` }
            }
        );

        res.send('Files uploaded and data saved to GitHub!');
    } catch (error) {
        res.status(500).send('Error uploading files to GitHub: ' + error.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
