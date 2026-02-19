
# 🚀 Ondo Connect: The Local Economy OS

**Ondo Connect** is a high-impact digital ecosystem designed to empower the citizens of Ondo State, Nigeria. It bridges the gap between low-tech accessibility (USSD/WhatsApp) and high-tech efficiency (Hybrid AI) to formalize and grow the local economy.

---

## 🎯 The Vision
We are building the "Operating System" for regional prosperity. By integrating Agriculture, Artisanal Services, and Circular Economy modules into a single unified platform, we create a transparent, data-driven environment for growth.

## 🏗️ Technical Architecture
The platform leverages a **Hybrid AI Strategy** to ensure maximum performance and localized relevance:

- **Express Backend Proxy**: A secure Node.js backend to handle API requests and protect sensitive keys.
- **Groq Llama-3.2 Vision**: High-speed multimodal inference for real-time pest detection and waste verification.
- **DeepSeek Reasoning**: Advanced logic for localized translation, impact scoring, and business recommendations.
- **WhatsApp/USSD Simulation**: Familiar interfaces for maximum inclusivity among farmers and artisans.
- **Command Center**: A real-time geospatial dashboard for state administrators to monitor economic velocity and job creation.

## 📱 Core Demo Journeys

### 1. Farmer Amina (Agri-Connect)
- **Interface**: WhatsApp
- **AI Magic**: Amina sends a photo of a diseased cocoa leaf. **Groq Vision** diagnoses "Black Pod Disease" in milliseconds and provides organic remedy advice in a Yoruba-infused English dialect.

### 2. Artisan Chuka (Service-Connect)
- **Interface**: USSD (*123#)
- **Impact**: Chuka formalizes his auto-repair shop via a basic phone interface. Upon registration, the system generates a **Digital Storefront QR Code**, linking his offline business to the global digital map.

### 3. Waste Collector Bola (Circular-Connect)
- **Interface**: WhatsApp + Maps
- **Impact**: Bola tracks waste collection points. **DeepSeek logic** verifies the collection weight and automatically credits his digital wallet with EcoPoints and Naira rewards.

---

## 🛠️ Tech Stack
- **Frontend**: React + Tailwind CSS
- **Icons**: Lucide React
- **AI Core**:
  - `Groq API` (Model: `llama-3.2-11b-vision-preview`)
  - `DeepSeek API` (Model: `deepseek-chat`)
- **Speech**: Browser-native Web Speech API for localized voice assistance.
- **Animations**: CSS3 Keyframes + Tailwind Transitions for a "Wow-factor" experience.

---

## 🚀 Getting Started

1. **Environment Variables**:
   Ensure you have your API keys configured in your environment:
   ```env
   API_KEY=your_groq_or_deepseek_key
   ```
   *Note: The service layer is designed to use a unified key or individual `GROQ_API_KEY` and `DEEPSEEK_API_KEY` variables.*

2. **Installation**:
   ```bash
   npm install
   npm start
   ```

3. **Usage**:
   - Navigate through the three user journeys using the bottom selector grid.
   - Use the **Command Center** button in the header to view the aggregate state data.
   - Upload images in the WhatsApp view to trigger the **Groq Vision** analysis.

---

## 🌐 Deployment

### Backend
The Express backend (`server/index.js`) can be hosted on platforms like:
- **Render** / **Railway**: Recommended for easiest setup.
- **Heroku**: Standard PaaS choice.
- **DigitalOcean App Platform**: Robust scaling.

### Frontend
The Vite frontend can be hosted on **Vercel**, **Netlify**, or along with the backend on the platforms above.

Ensure you set the `VITE_BACKEND_URL` environment variable on your frontend host to point to your deployed backend.

---

## 🌍 Impact Metrics
- **Job Creation**: Tracking every new artisan registration.
- **Circular Economy**: Live tally of waste recovered (KG).
- **Economic Inclusion**: Monitoring the transition from informal to formal business nodes.

---

**Ondo Connect** — *Accelerating prosperity with Hybrid AI.*
