// 这个对象包含了网站的元数据信息，比如标题、作者、描述等。可以在 Next.js 网站中使用这些信息
const SiteConfig = {
  // 网站基础信息（必填）
  // basic site info (required)
  title: "Jessie's Blog",
  author: "Jessie", // 作者姓名
  summary: "记录技术与日常感想", // 作者简介

  fullName: "Jessie Chen",
  headerTitle: "Jessie's Blog",
  description:
    "My desire to practice my skills and share my acquired knowledge fuels my endeavors.",
  language: "zh", // 中文：zh 英文：en
  siteLogo: "https://qiniu.jessieontheroad.com/avatar.png",
  socialBanner: "/static/images/projects/karhdo-blog.png",
  theme: "system",
  locale: "zh",
  // siteUrl: 'www.jessieontheroad.com',
  siteUrl: "https://www.jessieontheroad.com",
  domain: "jessieontheroad.com",
  imageDomainUrl: "https://qiniu.jessieontheroad.com/",

  // 导航栏（必填）
  // navigation（required）
  navigationLinks: [
    {
      id: 1,
      title: "home",
      href: "/",
    },
    {
      id: 2,
      title: "technical",
      href: "/technical",
    },
    {
      id: 3,
      title: "travel",
      href: "/travel",
    },
    // {
    //   id: 4,
    //   title: "life",
    //   href: "/life",
    // },
    // {
    //   id: 4,
    //   title: "tags",
    //   href: "/tags",
    // },
    {
      id: 5,
      title: "about",
      href: "/about",
    },
  ],
  // 社交媒体地址（可选）
  // social (optional)
  email: "znjessie858@gmail.com",
  twitter: "https://x.com/Qioj3exsXCtf1Ol",
  instagram: "https://www.instagram.com",
  newsletter: "",
  linkedin: "https://www.linkedin.com/in/jiaxin-chen-569865229/",
  youtube: "https://www.youtube.com/channel/UCPI1WEz-ykfaxK7x1YZs-Hw",
  // github: 'Jessie-jzn',
  facebook: "https://facebook.com/100093684045138",
  github: "https://github.com/Jessie-jzn",

  // 默认 notion 图标和封面图像，以实现全站一致性（可选）
  // default notion icon and cover images for site-wide consistency (optional)
  defaultPageIcon: undefined,
  defaultPageCover: undefined,
  defaultPageCoverPosition: 0.5,

  // layout配置
  useCustomLayout: true,
  useCustomHomeLayout: true,
  useCustomPostLayout: true,
  useCustomHeader: true,

  // notion配置
  NOTION_PROPERTY_NAME: {
    password: process.env.NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD || "password",

    // 文章类型字段
    type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || "type",

    // 博文类型
    type_post: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || "Post",

    // 单页类型
    type_page: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE || "Page",

    // 公告类型
    type_notice:
      process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_NOTICE || "Notice",

    // 菜单类型
    type_menu: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_MENU || "Menu",

    // 子菜单类型
    type_sub_menu:
      process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_SUB_MENU || "SubMenu",

    // 文章标题字段
    title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || "title",

    // 状态字段
    status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || "status",

    // 发布状态,可以为中文
    status_publish:
      process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH || "Published",

    // 隐藏发布状态,可以为中文
    status_invisible:
      process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE || "Invisible",

    // 文章摘要字段
    summary: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || "summary",

    // 自定义链接字段
    slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || "slug",

    // 分类字段
    category: process.env.NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY || "category",

    // 日期字段
    date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || "date",

    // 标签字段
    tags: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TAGS || "tags",

    // 图标字段
    icon: process.env.NEXT_PUBLIC_NOTION_PROPERTY_ICON || "icon",

    // 扩展字段，存放json-string，用于复杂业务
    ext: process.env.NEXT_PUBLIC_NOTION_PROPERTY_EXT || "ext",
  },
  Notion_ROOT_PAGE_Id: "",
  NOTION_HOST: "https://www.notion.so",
  databaseMapping: {
    [process.env.NOTION_POST_ID || ""]: "technical",
    [process.env.NOTION_GUIDE_ID || ""]: "travel",
    // 添加其他数据库映射
  },
  useImageProxy: true, // 控制是否使用图片代理
  imageProxyUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/image-proxy"
      : "https://jessieontheroad.com/api/image-proxy",
};

export default SiteConfig;
