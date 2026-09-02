/**
 * Loads a third-party script from a React effect, after initial hydration.
 */
export function appendExternalScript(
  document: Pick<Document, 'createElement' | 'head'>,
  src: string,
) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);

  return () => script.remove();
}
