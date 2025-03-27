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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">SEO 优化建议</h3>

      {!suggestions && !loading && (
        <button
          onClick={optimizeSEO}
          className="px-4 py-2 bg-[#62BFAD] text-white rounded-lg hover:bg-[#62BFAD]/90 transition-colors"
        >
          获取 SEO 建议
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#62BFAD] border-t-transparent" />
        </div>
      )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h4 className="font-medium mb-2">优化后的标题</h4>
            <p className="text-[#62BFAD]">{suggestions.title}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Meta Description</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {suggestions.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">关键词</h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.keywords?.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#62BFAD]/10 text-[#62BFAD] text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">建议的标题结构</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              {suggestions.headings.map((heading, index) => (
                <li key={index}>{heading}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">内容改进建议</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {suggestions.contentSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onApplyChanges(suggestions)}
            className="px-4 py-2 bg-[#62BFAD] text-white rounded-lg hover:bg-[#62BFAD]/90 transition-colors"
          >
            应用这些建议
          </button>
        </motion.div>
      )}
    </div>
  );
}


