import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (path: string) => readFileSync(path, 'utf8');

test('the home WHV guide gives visitors a direct route to the 462 tool', () => {
  const section = source('components/home/WhvGuideSection.tsx');

  assert.match(section, /WHV_TOOL_URL/);
  assert.match(section, /landing\.whv\.tool/);
  assert.match(section, /href=\{WHV_TOOL_URL\}/);
});

test('relevant blog posts show the 462 tool promotion after their content', () => {
  const page = source('components/Notion/NotionPage.tsx');
  const route = source('pages/[category]/[id].tsx');

  assert.match(page, /isWhvJobPost\(postData\)/);
  assert.match(page, /landing\.whv\.tool/);
  assert.match(page, /WHV_TOOL_URL/);
  assert.match(route, /serverSideTranslations\([\s\S]*?\["common", "home"\]/);
});
