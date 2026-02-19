import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY || process.env.VITE_API_KEY;
const DEEPSEEK_API_KEY = process.env.VITE_DEEPSEEK_API_KEY || process.env.VITE_API_KEY;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGroq: !!GROQ_API_KEY, hasDeepSeek: !!DEEPSEEK_API_KEY });
});

app.post('/api/ai/groq', async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/deepseek', async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });
  }
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('DeepSeek Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.BACKEND_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
