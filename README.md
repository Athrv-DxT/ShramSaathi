# Shram Saathi

Shram Saathi is a voice-first AI assistant for Hindi-speaking gig and informal workers in India. It leverages STT/TTS (Sarvam AI), LLM answering (Gemini 1.5 Flash), Vector Retrieval (Supabase pgvector) for government schemes, and Live Weather features (Open-Meteo).

## Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS (Deployed on Vercel)
- **Backend**: Node.js + Express (Deployed on Render.com)
- **Database**: Supabase PostgreSQL with `pgvector`

## Prerequisites
You will need the following API Keys:
1. **Sarvam AI API Key** (`SARVAM_API_KEY`) form app.sarvam.ai
2. **Google AI Studio API Key** (`GEMINI_API_KEY`) from aistudio.google.com
3. **Supabase URL & Anon Key** (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) from supabase.com

## Local Setup Instructions (Under 10 Steps)

1. **Clone/Download** this repository.
2. **Setup Supabase Database**: Open your Supabase project's SQL editor and execute the contents of `supabase_setup.sql` in the root of the project to initialize the vector database.
3. **Configure Backend Environment**:
   - Navigate to `backend/`.
   - Copy `.env.example` to `.env`.
   - Fill in all the API keys in your `.env` file.
4. **Install Backend Dependencies**:
   - While still in `backend/`, run `npm install`.
5. **Seed the Government Schemes Database** (One-time):
   - Run `npm run seed`. This will scrape myscheme.gov.in and store chunks natively in Supabase via Gemini embeddings.
6. **Start the Backend Server**:
   - Run `npm run dev` or `npm start`. It will run on port `5000`.
7. **Configure Frontend Environment**:
   - Navigate to `frontend/`.
   - Create a `.env` file containing `VITE_API_URL=http://localhost:5000/api/voice`.
8. **Install Frontend Dependencies**:
   - Run `npm install` inside the `frontend/` folder.
9. **Start the Frontend App**:
   - Run `npm run dev`.
10. **Test Shram Saathi**: Open `http://localhost:5173` in a browser, grant microphone/location access, and tap the Speak button!

## Deployments

### Backend -> Render.com
1. Connect this repo to Render.com.
2. Tell Render to deploy using the `backend/render.yaml` configuration automatically.
3. Add the exact environment variables from `.env` to your Render dashboard.

### Frontend -> Vercel
1. Connect this repo to Vercel.
2. Pick the `frontend/` directory as the Root Directory. Vercel will automatically read `vercel.json`.
3. Set `VITE_API_URL` environment variable to your newly deployed Render URL (e.g., `https://shram-saathi-backend.onrender.com/api/voice`).
