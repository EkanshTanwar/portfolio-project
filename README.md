# Personal Portfolio Website

A full-stack personal portfolio website built as part of a full-stack web development internship project.

- **Frontend:** HTML, CSS, JavaScript (vanilla — no framework)
- **Backend:** Node.js + Express
- **Data:** JSON files (`data/projects.json`, `data/messages.json`)

---

## 1. What this project does

- Displays an "About Me" section, a skills overview, and a projects showcase.
- Project cards are **not hardcoded in the HTML** — the frontend fetches them from the backend
  (`GET /api/projects`), which reads them from `data/projects.json`. This is the "backend manages the data" part of the brief.
- The contact form on the page submits to the backend (`POST /api/contact`), which validates the
  input and saves each message to `data/messages.json` with a timestamp.

## 2. Folder structure

```
portfolio-website/
├── server.js              # Express app entry point
├── package.json
├── routes/
│   └── api.js              # /api/projects and /api/contact routes
├── data/
│   ├── projects.json       
│   └── messages.json       # created automatically when someone submits the contact form
└── public/                 # everything here is served as the frontend
    ├── index.html
    ├── css/style.css
    └── js/main.js
```

## 3. Running it locally

You need [Node.js](https://nodejs.org) installed (v18 or newer recommended).

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open your browser
http://localhost:3000
```

The server serves the frontend AND the API from the same port — you don't need a separate frontend server.

