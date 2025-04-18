import { ExtendedRecordMap, Block } from "notion-types";

export interface MenuItem {
  id: number;
  summarize?: string;
  title: string;
  url: string;
}
export interface PageError {
  message?: string;
  statusCode: number;
}
// export interface Post {
//   id: string;
//   description?: string;
//   name?: string;
//   published?: boolean;
//   url: string;
//   date?: string;
//   image: string;
//   tags?: any;
//   tagItems?: { name: string; color: string }[];
//   pageCover?: string;
//   cover?: string;
//   created_time?: string;
//   country: string[];
// }
export interface Post {
  id: string;
  type?: "Post";
  status?: "Published";
  tags: string[];
  title: string;
  summarize?: string;
  category?: string;
  comment?: string;
  publishDate?: number; // 以时间戳表示
  publishDay?: string; // 格式化的日期字符串
  lastEditedDate?: string; // 格式化的日期字符串
  lastEditedDay?: string; // 格式化的日期字符串
  fullWidth?: boolean;
  pageIcon?: string; // 图标
  pageCover: string; // 封面图像 URL
  pageCoverThumbnail: string; // 封面缩略图 URL
  ext?: Record<string, any>; // 扩展属性，可以是任意对象
  slug?: string; // Added slug property
  tagItems?: Array<{
    id: string; // 假设 tagItems 数组中的每个对象有 id
    name: string; // 假设每个 tagItems 对象有 name
  }>;
}

export interface Site {
  name: string;
  domain: string;

  rootNotionPageId: string;
  rootNotionSpaceId: string;

  // settings
  html?: string;
  fontFamily?: string;
  darkMode?: boolean;
  previewImages?: boolean;

  // opengraph metadata
  description?: string;
  image?: string;
}
export interface Country {
  id: string;
  cover: string | null;
  url: string;
  image: string;
  guide: string[];
  title: string;
  icon: string;
  name: string;
  guides: Post[];
}
export interface PageProps {
  site?: Site;
  recordMap: ExtendedRecordMap;
  postData?: PostData;
  pageId?: string;
  error?: PageError;
}

export interface PropertyLastEditedTimeValueProps {
  block: Block;
  pageHeader: boolean;
  defaultFn: () => React.ReactNode;
}
export interface PropertyDateValueProps {
  data: DataItem[];
  schema: Schema;
  pageHeader: boolean;
  defaultFn: () => React.ReactNode;
}
export interface Schema {
  name?: string;
}

export interface DataItem {
  [key: string]: any;
}

// export interface SearchNotionParams {
//   query: string;
//   sort?: {
//     direction: 'ascending' | 'descending';
//     timestamp: 'created_time' | 'last_edited_time';
//   };
//   filter?: {
//     property: string;
//     value: string;
//   };
// }

export interface SearchParams {
  ancestorId?: string;
  query: string;
  filters?: {
    isDeletedOnly: boolean;
    excludeTemplates: boolean;
    isNavigableOnly: boolean;
    requireEditPermissions: boolean;
  };
  limit?: number;
  searchSessionId?: string;
}

export interface NotionPageParamsProp {
  pageId: string;
  from: string;
  filter?: any;
}

export interface SchemaProp {
  [key: string]: {
    type: string;
    name: string;
  };
}

export interface Tag {
  id: string;
  name?: string;
  color?: string;
  count: number;
  value: string;
  articles: Post[];
}
export interface Feature {
  title: string;
  href: string;
  description: string;
  icon: string;
}
export interface FAQItem {
  question: string;
  answer: string;
}

// 定义 TagItem 类型
interface TagItem {
  name: string;
  color: string;
}

// 定义 PostData 类型
export interface PostData {
  id: string; // 文章的唯一 ID
  keywords: string; // 关键字，用于 SEO
  summarize: string; // 文章简介或页面 URL 描述
  type: "Post" | "Page"; // 文章类型，可以是 Post 或 Page
  status: "Published" | "Draft"; // 文章状态，已发布或草稿
  tags: string[]; // 文章标签，字符串数组
  title: string; // 文章标题
  category: string; // 文章类别，可能为空
  comment: string; // 评论字段，可能为空
  publishDate: number; // 发布时间，Unix 时间戳
  publishDay: string; // 发布的具体日期，格式 'YYYY-MM-DD'
  lastEditedDate: string; // 最后编辑日期
  lastEditedDay: string; // 最后编辑具体日期，格式 'YYYY-MM-DD'
  fullWidth: boolean; // 页面是否全宽显示
  pageIcon: string; // 页面图标
  pageCover: string; // 页面封面图片 URL
  pageCoverThumbnail: string; // 页面封面缩略图 URL
  ext: Record<string, any>; // 扩展字段，允许附加任意扩展数据
  tagItems: TagItem[]; // 详细的标签数组，包含名称和颜色
}

export interface Category {
  id: string;
  name?: string;
  value?: string;
  color: string;
  count: number;
  articles: Array<any>;
}
