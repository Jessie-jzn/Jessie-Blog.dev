import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await axios.post(
        "https://fanyi-api.baidu.com/api/trans/vip/translate",
        new URLSearchParams(req.body).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Translation failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
