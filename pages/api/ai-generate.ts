// /pages/api/ai-generate.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { jobTitle } = JSON.parse(req.body);

  if (!jobTitle) return res.status(400).json({ error: "Missing job title" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "你是一个简历写作专家，擅长用Markdown写出专业、有吸引力的技术类简历。",
        },
        {
          role: "user",
          content: `请帮我生成一份适合 "${jobTitle}" 岗位的中文简历片段，包含技能、项目经验等，返回Markdown格式`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content || "";
    res.status(200).json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "生成失败" });
  }
}
