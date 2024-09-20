import CryptoJS from 'crypto-js';

const PROXY_TRANSLATE_API_URL = '/api/translate';

export async function baiduTranslate(text: string, from: string = 'auto', to: string = 'zh') {
  if (new TextEncoder().encode(text).length > 6000) {
    throw new Error('Text length exceeds 6000 bytes');
  }

  const appid = process.env.TRANSLATE_BAIDU_APPID;
  const key = process.env.TRANSLATE_BAIDU_SECRETKEY;

  if (!appid || !key) {
    throw new Error('Missing BAIDU_TRANSLATE_APP_ID or BAIDU_TRANSLATE_SECRET_KEY');
  }

  const salt = Date.now().toString();
  const sign = CryptoJS.MD5(appid + text + salt + key).toString();

  const params = new URLSearchParams();
  params.append('q', text); // Do not URL encode here
  params.append('from', from);
  params.append('to', to);
  params.append('appid', appid);
  params.append('salt', salt);
  params.append('sign', sign);

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