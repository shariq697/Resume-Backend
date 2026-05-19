🚀 AI Resume Analyzer - Backend

📌 Overview

* Backend service for an AI-powered Resume Analyzer
* Uses Groq AI to evaluate resumes and generate ATS-style feedback
* Returns structured JSON including score, strengths, weaknesses, and summary

🌐 Live Links

* Frontend: https://resume-frontend-eight-sooty.vercel.app/
* Backend API: https://ai-resume-analyzer-ilzc.onrender.com/

⚙️ Features

* AI-powered resume analysis using LLM
* ATS score generation (0–100)
* Strengths extraction from resume
* Weakness identification
* Professional AI-generated summary
* Structured JSON API response
* Error handling with fallback responses

📡 API Endpoint

* Method: POST
* Endpoint: `/analyze`
* Description: Sends resume text and returns AI evaluation

🧠 AI Model

* Groq API used for inference
* Model: llama-3.1-8b-instant
* Optimized for fast and accurate text analysis

🛠 Tech Stack

* Node.js
* Express.js
* Groq SDK
* CORS
* dotenv

🚀 Installation & Setup

* Clone repository
* Run `npm install`
* Start server using `npm start`
* Create `.env` file and add `GROQ_API_KEY`

📥 Environment Variables

GROQ_API_KEY → Required for AI functionality

📌 Project Purpose

* Demonstrates AI integration in backend systems
* Simulates real-world ATS (Applicant Tracking System)
* Shows full-stack development and deployment skills
* Provides resume evaluation using LLM technology
