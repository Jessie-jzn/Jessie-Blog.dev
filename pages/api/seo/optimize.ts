import { NextApiRequest, NextApiResponse } from "next";
import { optimizePostSEO } from "@/lib/services/seoOptimizer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const seoSuggestions = await optimizePostSEO(title, content, category);

    res.status(200).json(seoSuggestions);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
