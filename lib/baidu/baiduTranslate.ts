const PROXY_TRANSLATE_API_URL = '/api/translate';
import CryptoJS from 'crypto-js';

export async function baiduTranslate(text: string, from: string = 'auto', to: string = 'zh') {
  if (new TextEncoder().encode(text).length > 6000) {
    throw new Error('Text length exceeds 6000 bytes');
  }

  const appid = process.env.BAIDU_TRANSLATE_APP_ID;
  const key = process.env.BAIDU_TRANSLATE_SECRET_KEY;
  const salt = Date.now().toString();
  const sign = CryptoJS.MD5(appid + text + salt + key).toString();

  const params = new URLSearchParams();
  params.append('q', text);
  params.append('from', from);
  params.append('to', to);
  params.append('appid', appid ?? '');
  params.append('salt', salt);
  params.append('sign', sign);

  console.log('执行')
  try {
    const response = await fetch(PROXY_TRANSLATE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.error_code) {
      throw new Error(`Error ${data.error_code}: ${data.error_msg || 'Translation failed'}`);
    }
    if (data.trans_result) {
      return data.trans_result.map((result: { src: string; dst: string }) => ({
        src: result.src,
        dst: result.dst,
      }));
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error('Baidu translation error:', error);
    throw error;
  }
}