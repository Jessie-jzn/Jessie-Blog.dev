import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');

// Render the real section; replace only framework integration boundaries.
function renderWhvSection(language: string): string {
  const cache = new Map<string, any>();
  const messages = JSON.parse(readFileSync(`public/locales/${language}/home.json`, 'utf8'));
  const framework = {
    'next/link': { __esModule: true, default: ({ prefetch, ...props }: any) => React.createElement('a', props) },
    'next/image': { __esModule: true, default: ({ fill, priority, unoptimized, ...props }: any) => React.createElement('img', props) },
    'next-i18next': { useTranslation: () => ({
      i18n: { language },
      t: (key: string) => key.split('.').reduce((value: any, part: string) => value?.[part], messages) ?? key,
    }) },
  };
  const load = (filename: string): any => {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const localRequire = (name: string) => {
      if (name in framework) return framework[name as keyof typeof framework];
      if (!name.startsWith('@/')) return require(name);
      const base = path.resolve(name.slice(2));
      const resolved = ['.tsx', '.ts'].map(ext => base + ext).find(existsSync);
      assert.ok(resolved, `Missing module: ${name}`);
      return load(resolved);
    };
    const code = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020, esModuleInterop: true,
    } }).outputText;
    vm.runInThisContext(`(function(require, module, exports) {${code}\n})`)(localRequire, module, module.exports);
    return module.exports;
  };
  const Section = load(path.resolve('components/home/WhvGuideSection.tsx')).default;
  return renderToStaticMarkup(React.createElement(Section, { posts: [] }));
}

for (const locale of ['zh', 'en']) {
  test(`WHV stages without configured posts link to the WHV hub (${locale})`, () => {
    const html = renderWhvSection(locale);
    const stages = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .filter(match => match[2].includes('tabular-nums'));
    assert.equal(stages.length, 4);
    assert.deepEqual(stages.map(match => match[1]), ['/whv', '/whv', '/whv', '/whv']);
    assert.doesNotMatch(html, /\/tag\//);
  });
}
