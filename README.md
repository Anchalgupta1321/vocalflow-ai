# VocalFlow AI — Indian AI Phone Receptionist & Telephony SaaS Platform

> **Production-Ready Multi-Tenant SaaS Architecture** powered by ElevenLabs, Cartesia, Low-Latency LLMs, Indian Telephony (Exotel/Twilio), and TRAI TCCCPR 2026 Regulatory Compliance.

---

## 🌟 Features & Platform Highlights

- 🤖 **Agent Studio**: Step-by-step receptionist builder (Persona, Spoken Languages: Hinglish/English/Hindi/Tamil, ElevenLabs/Cartesia voice selector with live audio sample playback, FAQ knowledge base editor, and Google Calendar sync).
- 📞 **Interactive Phone Call Simulator**: Real-time browser call testing with animated audio wave pulses, sub-350ms response latency meter, speech synthesis, intent extraction, and automated booking triggers.
- 📋 **Multi-Tenant Call Logs & Transcripts**: Searchable call history per business tenant, cost breakdown in ₹ (Voice + LLM + Telephony), sentiment scores, and data export.
- 📅 **Bookings & Calendar Manager**: Visual calendar grid of appointments auto-booked by the AI Receptionist per tenant.
- 📊 **Real-time Analytics**: Hourly call volume distribution, CSAT scores, sentiment breakdown, and peak calling hour analytics.
- 🛡️ **TRAI & DPDP Compliance Suite**: TRAI TCCCPR 2026 compliance hub, **Interactive NCPR DND Phone Scrubber**, 3-tier call risk classification, DLT Principal Entity registry tracker, and DPDP Consent Vault.
- 🔑 **API Keys & Telephony Settings (BYOK)**: Connect custom ElevenLabs API Keys, Exotel/Twilio SIP Trunk SID, Google Calendar OAuth, and Meta WhatsApp Business API tokens.
- 💳 **Billing & Metered Usage**: Razorpay subscription manager, saved payment method, auto-debit status, tax invoices (GSTIN), and minute top-up packs.
- 💰 **Unit Economics Engine**: Financial calculator projecting MRR, COGS per minute, subscriber scale, and net profit margins (~68% net).

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Glassmorphism UI
- **Backend**: Node.js + Express + WebSockets (Bi-directional Telephony Media Streams)
- **Database**: PostgreSQL (Prisma ORM Multi-Tenant Schema)
- **Voice Pipeline**: ElevenLabs Conversational AI WebSockets API / Cartesia Sonic
- **Telephony**: Exotel / Twilio / Tata Telecommunications SIP Trunking
- **Payments**: Razorpay Subscriptions API
- **Messaging**: Meta WhatsApp Cloud API / Gupshup

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Frontend Dev Server
```bash
npm run dev
# Running on http://127.0.0.1:5173/
```

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Run Backend Express Server
```bash
node server/index.js
# Running on http://localhost:4000
```

---

## 🐳 Docker Deployment

To launch the full multi-tenant stack (PostgreSQL + App Server) via Docker Compose:
```bash
docker-compose up -d
```

---

## 📄 License & Intellectual Property
Designed for launching AI Phone Agent SaaS startups in India. All rights reserved.
