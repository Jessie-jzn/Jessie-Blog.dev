import type { PostData } from '@/lib/type';

export const WHV_TOOL_URL = 'https://www.jessieonroad.com/whv-ai-copilot/';

const WHV_JOB_KEYWORDS = ['whv', '462', 'job', 'work', '找工作', '工作'];

type PostPromotionData = Pick<PostData, 'category' | 'tags'>;

export const isWhvJobPost = ({
  category,
  tags,
}: PostPromotionData): boolean =>
  [category, ...tags]
    .filter(Boolean)
    .some((value) =>
      WHV_JOB_KEYWORDS.some((keyword) => value.toLowerCase().includes(keyword)),
    );
