import assert from 'node:assert/strict';
import test from 'node:test';

import { appendExternalScript } from '../../lib/runtime/deferredExternalScript.ts';

test('appends the configured third-party script only when invoked after hydration', () => {
  const appended: Array<{ async: boolean; src: string; remove: () => void }> = [];
  const document = {
    createElement: () => ({
      async: false,
      src: '',
      remove() {},
    }),
    head: {
      appendChild: (script: { async: boolean; src: string; remove: () => void }) => {
        appended.push(script);
      },
    },
  };

  assert.equal(appended.length, 0);

  const cleanup = appendExternalScript(
    document as unknown as Pick<Document, 'createElement' | 'head'>,
    'https://emrldtp.cc/MzMyNjk0.js?t=332694',
  );

  assert.deepEqual(appended.map((script) => script.src), [
    'https://emrldtp.cc/MzMyNjk0.js?t=332694',
  ]);
  assert.equal(appended[0].async, true);

  cleanup();
});
