# ⚡ ECAS Remake

A Progressive Web App (PWA) to track and analyze energy consumption (electricity, gas, water) based on manual meter readings.

---

## 🎯 Purpose

This project is a modern reimplementation of an existing energy tracking application.

It allows you to:

* 📥 Enter meter readings manually
* 📋 View the full history of readings
* 📊 Analyze consumption over time
* 📈 Generate monthly and yearly statistics
* 🧠 Estimate consumption even with irregular readings (linear regression)

---

## 🧱 Tech Stack

* **Vue 3**
* **Vite**
* **IndexedDB + Dexie.js** (local database)
* **Chart.js**
* **PWA** (installable on mobile)

---

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/ecas-remake.git
cd ecas-remake
npm install
npm run dev
```

---

## 📱 Key Features

### 🔌 Meter Management

* Create and manage multiple meters (e.g. peak/off-peak, gas, water)

### 🧾 Readings

* Manual input of meter values
* Full reading history
* Automatic consumption calculation between readings

### 📊 Statistics

* Monthly consumption aggregation
* Year-over-year comparison
* Differences in absolute value and percentage

### 📈 Advanced Analysis (planned)

* Linear regression for smoothing
* Estimation of missing data
* Anomaly detection

---

## 📄 License

MIT License
