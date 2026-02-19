
/**
 * AI Service Layer
 * Integrated with Groq (Vision/Multimodal) and DeepSeek (Reasoning).
 * Optimized for Ondo Connect's localized economic OS.
 */

export const getSmartResponse = async (
  query: string, 
  context: string, 
  imageBase64?: string
): Promise<string> => {
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    // Vision tasks (Crop analysis, Waste verification) use Groq's high-speed inference via local proxy
    if (imageBase64) {
      const cleanData = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      
      const response = await fetch(`${BACKEND_URL}/api/ai/groq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages: [
            {
              role: 'system',
              content: `You are the ONDO CONNECT AI Assistant. Context: ${context}. 
              TONE: Professional, localized to Ondo State, Nigeria. 
              TASKS:
              - Diagnose cocoa/cassava issues if a plant image is sent.
              - Verify waste materials if a recycling image is sent.
              - Mention local areas like Akure, Owo, or Odigbo. 
              Keep response strictly under 3 sentences.`
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: query || "Analyze this image for the Ondo Connect platform." },
                {
                  type: 'image_url',
                  image_url: { url: `data:image/jpeg;base64,${cleanData}` }
                }
              ]
            }
          ],
          temperature: 0.1
        })
      });

      if (!response.ok) throw new Error(`Vision node offline: ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Ondo Connect AI has processed your media request.";
    }

    // Reasoning and Localized logic use DeepSeek via local proxy
    const dsResponse = await fetch(`${BACKEND_URL}/api/ai/deepseek`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are the ONDO CONNECT AI Assistant. Context: ${context}. 
            Provide concise, localized assistance for Ondo State citizens. 
            Infuse local Yoruba-English dialect where friendly. 
            Maintain professional state-backed authority.`
          },
          { role: 'user', content: query }
        ],
        stream: false
      })
    });

    if (!dsResponse.ok) throw new Error(`Reasoning node offline: ${dsResponse.status}`);
    const dsData = await dsResponse.json();
    return dsData.choices?.[0]?.message?.content || "Ondo Connect AI is standing by.";
  } catch (error) {
    console.error("AI Service Error:", error);
    return "The system is currently optimizing regional bandwidth. Please hold while we reconnect.";
  }
};

/**
 * Localized Text-to-Speech using Browser API
 */
export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.05;
    utterance.rate = 0.98;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};
