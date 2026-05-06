/** 读取 Mailchimp 受众成员总数（不含未确认等，与后台「总数」口径一致）。 */
export async function fetchMailchimpMemberCount(): Promise<number | null> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !prefix) return null;

  const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `apikey ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    const data = (await response.json()) as { stats?: { member_count?: number } };
    const n = data.stats?.member_count;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
