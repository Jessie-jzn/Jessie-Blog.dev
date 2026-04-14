/**Notion相关 */
const NOTION_HOST = "https://www.notion.so/";
const NOTION_TOKEN = process.env.NOTION_API_KEY as string;
const NOTION_PUBLIC_MENU = process.env.NOTION_PUBLIC_MENU as string;
const NOTION_HOME_ID = process.env.NOTION_HOME_ID as string; // home
const NOTION_ABOUT_ID = process.env.NOTION_ABOUT_ID as string; // about
const NOTION_ROOT_ID = process.env.NOTION_ROOT_ID as string; // root
const NOTION_POST_ID = process.env.NOTION_POST_ID as string; // post
const NOTION_POST_EN_ID = process.env.NOTION_POST_EN_ID as string; // post-en
const NOTION_GUIDE_ID = process.env.NOTION_GUIDE_ID as string; // 旅行攻略
const NOTION_GUIDE_EN_ID = process.env.NOTION_GUIDE_EN_ID as string; // 旅行攻略
/**
 * 官方 Integration（@notionhq/client）用的「数据库」UUID。
 * 在 Notion 打开目标数据库 → 右上角 ⋮ → Copy link，从 URL 取 32 位 id（可带连字符）。
 * 须与 NOTION_POST_ID 在 officialDatabaseId 中配对；未配置时列表自动回退到旧版 api/v3。
 */
const NOTION_POST_DATABASE_ID = process.env.NOTION_POST_DATABASE_ID as
  | string
  | undefined;
/**
 * 旅行攻略等第二套库的 database_id，与 NOTION_GUIDE_ID 成对；用法同 NOTION_POST_DATABASE_ID。
 */
const NOTION_GUIDE_DATABASE_ID = process.env.NOTION_GUIDE_DATABASE_ID as
  | string
  | undefined;
const NOTION_NOTIFICATIONS_ID = process.env.NOTION_NOTIFICATIONS_ID as string; // 用户订阅数据库
const COMMENT_REPO_URL = process.env.COMMENT_REPO_URL as string;
const COMMENT_REPO_NAME = process.env.COMMENT_REPO_NAME as string;
const COMMENT_CATEGORY_ID = process.env.COMMENT_CATEGORY_ID as string;
const COMMENT_REPO_ID = process.env.COMMENT_REPO_ID as string;

/**翻译 */
/**baidu */
const BAIDU_TRANSLATE_APP_ID = process.env.TRANSLATE_BAIDU_APPID as string;
const BAIDU_TRANSLATE_SECRET_KEY = process.env
  .TRANSLATE_BAIDU_SECRETKEY as string;

const PREVIEW_IMAGES_ENABLED = true;
const LANG = process.env.NEXT_PUBLIC_LANG || "zh"; // zh-CN,'n-U
const IsPROD = process.env.NODE_ENV === "production";

/** 营收广告 */
/** google ads */
const ADSENSE_GOOGLE_ID = process.env.ADSENSE_GOOGLE_ID;
const ADSENSE_GOOGLE_SLOT_IN_ARTICLE =
  process.env.ADSENSE_GOOGLE_SLOT_IN_ARTICLE; //按照单元广告=>新建展示广告

export {
  NOTION_TOKEN,
  NOTION_HOST,
  NOTION_PUBLIC_MENU,
  NOTION_HOME_ID,
  PREVIEW_IMAGES_ENABLED,
  COMMENT_CATEGORY_ID,
  COMMENT_REPO_URL,
  COMMENT_REPO_ID,
  COMMENT_REPO_NAME,
  NOTION_GUIDE_ID,
  NOTION_GUIDE_EN_ID,
  NOTION_POST_DATABASE_ID,
  NOTION_GUIDE_DATABASE_ID,
  NOTION_POST_ID,
  NOTION_POST_EN_ID,
  NOTION_ROOT_ID,
  NOTION_ABOUT_ID,
  NOTION_NOTIFICATIONS_ID,
  BAIDU_TRANSLATE_APP_ID,
  BAIDU_TRANSLATE_SECRET_KEY,
  LANG,
  IsPROD,
  ADSENSE_GOOGLE_ID,
  ADSENSE_GOOGLE_SLOT_IN_ARTICLE,
};
