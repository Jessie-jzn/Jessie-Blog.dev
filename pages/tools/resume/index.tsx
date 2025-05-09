// pages/resume.tsx

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePDF } from "react-to-pdf";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 动态导入 Markdown 编辑器（避免 SSR 报错）
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const themes = {
  tui: {
    name: "tui",
    pdfCss: "tuiCssForPdf",
    editorCss: "tuiCssForEditor",
  },
  github: {
    name: "github",
    pdfCss: "githubCssForPdf",
    editorCss: "githubCssForEditor",
  },
};

export default function MarkdownResume() {
  // Markdown 文本内容
  const [markdown, setMarkdown] = useState("");
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  // 当前主题
  const [theme, setTheme] = useState<keyof typeof themes>(
    themes.github.name as keyof typeof themes
  );

  // 导出 PDF 所需 hook
  const { toPDF, targetRef } = usePDF({ filename: "resume.pdf" });

  // 初始化加载本地缓存
  useEffect(() => {
    const saved = localStorage.getItem("markdown_resume");
    if (saved) setMarkdown(saved);
  }, []);

  // Markdown 内容变动后自动保存
  useEffect(() => {
    localStorage.setItem("markdown_resume", markdown);
  }, [markdown]);


  // 编辑器中右侧预览 HTML 渲染逻辑
  const renderHTML = useCallback((text: string) => (
    <div className={`${themes[theme].editorCss}`}>
      <div
        ref={targetRef} // 用于 PDF 导出定位
        className={'markdown-body'}
        key={theme}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>

  ), [targetRef, theme]);

  // 图片上传处理（此处为 base64 示例，可改为上传至 OSS 等）
  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  console.log('theme', theme)
  const handleExportPDF = async () => {
    const element = targetRef.current;
    if (!element) return;

    // 动态导入 print-js
    const printJS = (await import("print-js")).default;

    // 直接使用 element 的 innerHTML
    const decoratedHtml = element.innerHTML;
    const pdfCssPath = `/themes/${themes[theme].pdfCss}.css`;
    printJS({
      type: "raw-html",
      css: pdfCssPath,
      scanStyles: true,
      printable: decoratedHtml,
      targetStyles: ["*"],
      documentTitle: "&nbsp",
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/ai-generate', {
      method: 'POST',
      body: JSON.stringify({ jobTitle }),
    });
    const data = await res.json();
    setMarkdown(prev => prev + '\n\n' + data.content);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Markdown 简历编辑器</title>
      </Head>
      <div className="min-h-screen p-4 bg-white text-black">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* 顶部操作栏 */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Markdown 简历编辑器</h1>
            <div className="flex gap-2 items-center">
              {/* 主题选择器 */}
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value as keyof typeof themes);
                  setMarkdown((prev) => prev + " ");
                }}
                className="border rounded px-2 py-1"
              >
                {Object.entries(themes).map(([key, t]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>

              {/* 导出 PDF 按钮 */}
              <button
                onClick={handleExportPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                导出 PDF
              </button>
            </div>
          </div>

          {/* 编辑器区域 */}
          <div className="w-full">
            <div className="min-h-screen overflow-auto">
              <MdEditor
                value={markdown}
                style={{ height: "100%", width: "100%" }}
                renderHTML={renderHTML}
                className="min-h-screen"
                onChange={({ text }) => setMarkdown(text)}
                onImageUpload={handleImageUpload}
                onFocus={(e) => console.log("focus", e)}
                onBlur={(e) => console.log("blur", e)}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: true,
                    fullScreen: true,
                    hideMenu: false,
                  },
                  table: {
                    maxRow: 5,
                    maxCol: 6,
                  },
                  imageUrl: "https://octodex.github.com/images/minion.png",
                  syncScrollMode: ["leftFollowRight", "rightFollowLeft"],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 多语言支持
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common"])),
    },
  };
};
