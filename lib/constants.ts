const NOTION_HOST = "https://www.notion.so/";
const NOTION_TOKEN = process.env.NOTION_API_KEY as string;
const NOTION_PUBLIC_MENU = process.env.NOTION_PUBLIC_MENU as string;
const NOTION_HOME_ID = process.env.NOTION_HOME_ID as string; // home
const NOTION_ABOUT_ID = process.env.NOTION_ABOUT_ID as string; // about
const NOTION_ROOT_ID = process.env.NOTION_ROOT_ID as string; // root
const NOTION_POST_ID = process.env.NOTION_POST_ID as string; // post
const NOTION_GUIDE_ID = process.env.NOTION_GUIDE_ID as string; // 旅行攻略

const NOTION_COUNTRY_ID = process.env.NOTION_COUNTRY_ID as string;
const PREVIEW_IMAGES_ENABLED = true;
const LANG = process.env.NEXT_PUBLIC_LANG || "zh"; // zh-CN,'n-U
const IsPROD = process.env.NODE_ENV === "production";

const TRANSLATE_BAIDU_APPID = process.env.TRANSLATE_BAIDU_APPID;
const TRANSLATE_BAIDU_SECRETKEY = process.env.TRANSLATE_BAIDU_SECRETKEY;

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
  NOTION_COUNTRY_ID,
  NOTION_GUIDE_ID,
  NOTION_POST_ID,
  NOTION_ROOT_ID,
  NOTION_ABOUT_ID,
  LANG,
  TRANSLATE_BAIDU_APPID,
  TRANSLATE_BAIDU_SECRETKEY,
  IsPROD,
  ADSENSE_GOOGLE_ID,
  ADSENSE_GOOGLE_SLOT_IN_ARTICLE,
};
