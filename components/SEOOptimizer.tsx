import { useState } from "react";
import { motion } from "framer-motion";
import { SEOSuggestions } from "@/lib/services/seoOptimizer";

interface SEOOptimizerProps {
  title: string;
  content: string;
  category: string;
  onApplyChanges: (suggestions: SEOSuggestions) => void;
}

export default function SEOOptimizer({
  title,
  content,
  category,
  onApplyChanges,
}: SEOOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SEOSuggestions | null>(null);
  const [error, setError] = useState("");

  const optimizeSEO = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/seo/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, category }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize SEO");
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editorial-surface rounded-2xl p-5 text-ink sm:p-6">
      <h3 className="mb-4 text-lg font-semibold">SEO 优化建议</h3>

      {!suggestions && !loading && (
        <button
          type="button"
          onClick={optimizeSEO}
          className="editorial-focus min-h-11 rounded-xl border border-line bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primaryStrong"
        >
          获取 SEO 建议
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h4 className="font-medium mb-2">优化后的标题</h4>
            <p className="text-primaryStrong">{suggestions.title}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Meta Description</h4>
            <p className="text-subtle">
              {suggestions.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">关键词</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="editorial-tag rounded-full px-2.5 py-1 text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">建议的标题结构</h4>
            <ul className="list-inside list-disc space-y-1 text-subtle">
              {suggestions.headings.map((heading, index) => (
                <li key={index}>{heading}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">内容改进建议</h4>
            <ul className="list-inside list-disc space-y-2 text-subtle">
              {suggestions.contentSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onApplyChanges(suggestions)}
            className="editorial-focus min-h-11 rounded-xl border border-line bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primaryStrong"
          >
            应用这些建议
          </button>
        </motion.div>
      )}
    </div>
  );
}

