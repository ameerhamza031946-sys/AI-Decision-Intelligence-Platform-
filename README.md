# AI Decision Intelligence Platform — Frontend

A modern React.js dashboard for the AI Decision Intelligence Platform — built for smart city analytics, autonomous AI agent pipelines, and community-level explainability.

## 🚀 Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** (custom dark theme)
- **Recharts** (data visualization)
- **Lucide React** (icons)
- **Axios** (API communication)
- **React Hot Toast** (notifications)

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── ExplainPanel.jsx     # AI Explainability component (instant cache)
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main analytics dashboard
│   │   ├── AIAgent.jsx          # Autonomous Decision Agent page
│   │   ├── Recommendations.jsx  # AI recommendations
│   │   ├── Analytics.jsx        # Analytics & predictions
│   │   ├── Map.jsx              # Community map view
│   │   ├── Upload.jsx           # Data upload
│   │   └── Admin.jsx            # Admin panel
│   ├── services/
│   │   └── api.js               # Backend API service (Axios)
│   └── main.jsx                 # App entry point
├── .env.example                 # Environment variable template
└── vite.config.js               # Vite configuration
```

## ⚙️ Setup & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Set your backend URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔑 Environment Variables
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://ai-29bz.onrender.com`) |

## 🌐 Live Backend
Connected to: **https://ai-29bz.onrender.com**

## ✨ Features
- 📊 Real-time community analytics dashboard
- 🤖 Autonomous 4-step AI Decision Agent pipeline
- ⚡ Instant AI Explainability (local cache + live API)
- 🗺️ Interactive community map
- 📈 Predictive analytics & forecasting
- 📁 CSV/JSON data upload & analysis
- 💬 AI chat assistant
- 🔒 Admin panel
