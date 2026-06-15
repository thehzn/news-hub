📰 NewsHub

A full-stack news management platform where an admin can create, draft, schedule, and publish news articles — and the public can browse them by category.


🚀 Features

👤 Admin


Create and edit news articles
Save articles as drafts
Send articles for review
Schedule articles for future publishing
Publish articles instantly
Manage all articles from a dashboard


🌐 Public


Browse published news articles
Filter and explore news by category
Clean, read-only news feed



🛠 Tech Stack

LayerTechnologyFrontendReact + ViteBackendNode.js + ExpressStylingTailwind CSS


📁 Project Structure

news-hub/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/ 
│   │   └── main.jsx
│   └── vite.config.js
├── server/          # Node + Express backend
│   ├── routers/
│   ├── controllers/
│   └── index.js
└── README.md


⚙️ Getting Started

Prerequisites


Node.js v18+
npm or yarn


Installation

1. Clone the repo

bashgit clone https://github.com/thehzn/news-hub.git
cd news-hub

2. Install frontend dependencies

bashcd client
npm install

3. Install backend dependencies

bashcd ../server
npm install

Running the App

Start the backend

bashcd server
npm run dev

Start the frontend

bashcd client
npm run dev

Frontend runs on http://localhost:5173

Backend runs on http://localhost:4000 


git 

🙋 Author

thehzn — github.com/thehzn