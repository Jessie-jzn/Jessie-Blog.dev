import React, { useState } from 'react';
import { clientTranslate } from '@/lib/baidu/clientTranslate';
import { useTranslation } from 'next-i18next';

export default function TranslateComponent() {
  const { t } = useTranslation('common');
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
    <section className="editorial-surface space-y-4 rounded-2xl p-5 text-ink sm:p-6">
      <textarea
        id="article-translation-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        aria-label={t("articleControls.translationInput")}
        placeholder={t("articleControls.translationInput")}
        className="editorial-focus min-h-32 w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-6 text-ink placeholder:text-subtle"
      />
      <button
        type="button"
        onClick={handleTranslate}
        className="editorial-focus inline-flex min-h-10 items-center justify-center rounded-xl border border-line bg-primaryStrong px-4 py-2 text-sm font-semibold text-surface transition-[filter] hover:brightness-95"
      >
        {t("articleControls.translate")}
      </button>
      {translatedText ? (
        <div
          className="rounded-xl border border-line bg-muted p-4 text-sm leading-6 text-ink"
          aria-live="polite"
        >
          {translatedText}
        </div>
      ) : null}
    </section>
  );
}
