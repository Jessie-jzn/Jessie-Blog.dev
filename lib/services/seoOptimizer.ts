import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SEOSuggestions {
  title: string;
  description: string;

  headings: string[];
  contentSuggestions: string[];

  keywords?: string[];
  structure?: {
    headings: string[];
    paragraphs: string[];
  };
  contentQuality?: {
    readability: string[];
    engagement: string[];
    completeness: string[];
  };
  internalLinks?: {
    suggestions: string[];
    reasons: string[];
  };
}

export async function optimizePostSEO(
  originalTitle: string,
  originalContent: string,
  category: string
): Promise<SEOSuggestions> {
  try {
    const prompt = `
    作为一个 SEO 专家,请帮我优化这篇${category}类文章:
    
    标题: ${originalTitle}
    内容: ${originalContent.substring(0, 1500)}...
    
    请从以下几个方面提供优化建议:
    1. 标题优化 (考虑搜索意图、关键词密度、吸引力)
    2. Meta Description (包含核心关键词,150字以内,有吸引力和行动召唤)
    3. 核心关键词和长尾关键词建议 (3-5个核心词,3-5个长尾词)
    4. 内容结构建议 (标题层级、段落组织)
    5. 内容质量提升建议 (可读性、互动性、完整性)
    6. 内部链接建议
    
    请以 JSON 格式返回,并为每项建议提供具体的理由和预期效果。
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "你是一个专业的 SEO 优化专家,特别擅长优化旅行和技术类文章。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const suggestions = JSON.parse(response.choices[0].message.content || "{}");

    return {
      title: suggestions.title,
      description: suggestions.description,
      keywords: suggestions.keywords,
      headings: suggestions.headings,
      contentSuggestions: suggestions.contentSuggestions,
    };
  } catch (error) {
    console.error("SEO optimization error:", error);
    throw error;
  }
}
