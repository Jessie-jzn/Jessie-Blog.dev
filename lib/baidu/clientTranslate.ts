import axios from 'axios';

export async function clientTranslate(text: string, from: string = 'auto', to: string = 'zh') {
  try {
    const response = await axios.post('/api/translate', { text, from, to });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}