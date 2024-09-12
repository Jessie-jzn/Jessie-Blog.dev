import React, { useState } from 'react';
import { clientTranslate } from '@/lib/baidu/clientTranslate';

export default function TranslateComponent() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    try {
      const result = await clientTranslate(inputText);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <button onClick={handleTranslate}>Translate</button>
      <div>{translatedText}</div>
    </div>
  );
}