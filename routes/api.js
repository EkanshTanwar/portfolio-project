const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const PROJECTS_PATH = path.join(__dirname, '..', 'data', 'projects.json');
const MESSAGES_PATH = path.join(__dirname, '..', 'data', 'messages.json');

// GET /api/projects -> returns the list of projects from data/projects.json
router.get('/projects', (req, res) => {
  fs.readFile(PROJECTS_PATH, 'utf8', (err, fileData) => {
    if (err) {
      console.error('Error reading projects.json:', err);
      return res.status(500).json({ error: 'Could not load projects.' });
    }
    try {
      const projects = JSON.parse(fileData);
      res.json(projects);
    } catch (parseErr) {
      console.error('Error parsing projects.json:', parseErr);
      res.status(500).json({ error: 'Projects data is malformed.' });
    }
  });
});

// POST /api/contact -> saves a contact form submission to data/messages.json
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' });
  }

  const newEntry = {
    name,
    email,
    message,
    receivedAt: new Date().toISOString()
  };

  // Load existing messages (create the file fresh if it doesn't exist yet)
  fs.readFile(MESSAGES_PATH, 'utf8', (err, fileData) => {
    let messages = [];
    if (!err && fileData) {
      try {
        messages = JSON.parse(fileData);
      } catch (parseErr) {
        messages = [];
      }
    }

    messages.push(newEntry);

    fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving message:', writeErr);
        return res.status(500).json({ error: 'Could not save your message. Please try again.' });
      }
      res.status(201).json({ success: true, message: 'Message received. Thank you for reaching out!' });
    });
  });
});

module.exports = router;
