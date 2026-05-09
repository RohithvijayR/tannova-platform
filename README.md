<div align="center">
  <!-- <img width="800" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="TANNOVA Logo" /> -->
  
  <br />
  
  <h1>⚡ TANNOVA: Operational Intelligence Platform</h1>
  <p><strong>Advanced Decision Intelligence for Power Grids & Utility Operators</strong></p>
  
  <br />
</div>

## 📌 Overview

**TANNOVA** is a state-of-the-art Operational Intelligence and Decision Support Platform designed for utility companies (like BESCOM) to transition from reactive, manual billing systems to proactive, hardware-aware AI intelligence. The platform significantly reduces **AT&C (Aggregate Technical & Commercial) revenue losses** caused by power theft, meter tampering, and asset degradation.

Built with performance and stability in mind, TANNOVA uses a robust frontend-first approach coupled with high-fidelity statistical models to deliver continuous insights without relying on heavy backend dependencies during critical presentations.

---

## 🚀 Key Features

### 1. Predictive Demand Intelligence (TFT Engine)
- Forecasts regional energy demand with high accuracy.
- Displays realistic predictions featuring **P10/P50/P90 confidence quantiles** to account for variance and noise.
- Evaluates Exogenous Variables like Ambient Temperature and Humidity using **SHAP Feature Importance**.

### 2. LSTM Autoencoder Anomaly Detection
- Tracks and highlights sequence reconstruction errors.
- Automatically flags anomalies in the live sequence buffer, representing potential large-scale grid disruptions.

### 3. Advanced Detection HUD (Threat Diagnostics)
The **Detection HUD** acts as the command center for investigating anomalies:
- **Sub-Grid Topology & Threat Containment:** Interactive controls to initiate Smart-Breaker Throttling, Firmware Lockouts, and deploy Vigilance Drones.
- **Harmonics Spectrogram (THD):** Visualizes Total Harmonic Distortion (THD) to detect non-linear loads and bypass circuits (specifically targeting 3rd and 5th harmonic anomalies).
- **Phase Asymmetry Profiler:** Radar charts mapping Phase R/Y/B, Neutral, and Magnetic Flux deviations against established baselines.
- **Live Edge-Node Telemetry:** Real-time terminal visualizing secure IoT edge data, including Voltage/Current per phase, Hall Effect sensor readings, and Optical Seal integrity.
- **AI-Generated Operational Briefs (TANNOVA-G):** Instant AI diagnostic reporting localized in both English and Kannada for field teams.

### 4. Predictive Asset Degradation (RUL)
- Continuously calculates the Remaining Useful Life (RUL) of critical infrastructure like transformers.
- Tracks thermal stress and cumulative peak load exposure over time.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, TailwindCSS, Framer Motion (Animations), Recharts (Data Visualization)
- **Node.js Orchestrator:** Express.js (API Proxying & Child Process Management)
- **AI Microservice:** Python 3.x, Flask, LightGBM, Scikit-Learn, NumPy, Pandas, Joblib
- **Deployment:** PM2 / Systemd (Recommended for production)

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.9+ recommended)
- `pip` (Python package installer)

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd tannova-bescom-operational-intelligence
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   Ensure you install the required Python libraries for the AI microservice.
   ```bash
   pip install flask flask-cors pandas numpy scikit-learn lightgbm joblib
   ```

### Running the Application

TANNOVA uses an integrated runner that starts both the Vite React frontend and the Python Flask backend simultaneously.

```bash
npm run dev
```

- **Frontend Dashboard:** `http://localhost:3000`
- **Python AI Microservice:** `http://127.0.0.1:3002`

*Note: The frontend operates completely resiliently. If the Python API experiences latency or fails, the dashboard automatically reverts to high-quality client-side simulations to ensure 100% uptime during demonstrations.*

---

## 📊 System Architecture

1. **Data Ingestion:** Simulates real-time IoT edge-node telemetry (Voltage, Current, Magnetic Flux, Optical Status).
2. **AI Inference Layer:** Python microservice runs LightGBM predictions and statistical anomaly scoring.
3. **Orchestration Layer:** Node.js Express routes data securely to the frontend.
4. **Visualization Layer:** React dashboard visualizes complex data using tailored charts, radars, and spectrograms.

---

## 🛡️ Future Roadmap

- [ ] **Live Database Integration:** Transition from static CSV artifacts to PostgreSQL / TimescaleDB for persistent telemetry storage.
- [ ] **Hardware Integration:** Interface directly with `tannova_edge_node.ino` firmware using MQTT for real-world voltage/current fluctuations.
- [ ] **Automated Ticketing:** Integrate Twilio or SendGrid to dispatch SMS/Email alerts to field vigilance squads automatically when "GENERATE TICKET" is triggered.

---
*© 2026 TANNOVA PLATFORM. Built for BESCOM Operational Intelligence.*
