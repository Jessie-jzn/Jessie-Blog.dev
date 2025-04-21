import SiteConfig from "@/site.config";

/**
 * 格式化日期
 * @timestampString 2024-02-22T15:22:31
 * @returns 格式化后的日期字符串，例如：2024年02月22日
 */
export const formatTimestampToDate = (
  timestampString: number | string
): string => {
  if (!timestampString) return "";
  const timestamp = new Date(timestampString);
  const year = timestamp.getFullYear();
  const month =
    (timestamp.getMonth() + 1 < 10 ? "0" : "") + (timestamp.getMonth() + 1);
  const day = (timestamp.getDate() < 10 ? "0" : "") + timestamp.getDate();
  return `${year}年${month}月${day}日`;
};
/**
 * 格式化日期
 * @param date 日期字符串或日期对象
 * @param locale 本地化字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date,
  locale: string = "zh"
): string => {
  if (!date || !locale) return date ? date.toString() : "";

  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const res = d.toLocaleDateString(locale, options);

  // 如果格式是中文日期，则转为横杆
  const format =
    locale.slice(0, 2).toLowerCase() === "zh"
      ? res.replace("年", "-").replace("月", "-").replace("日", "")
      : res;

  return format;
};
/**
 * 深拷贝对象
 * 根据源对象类型深度复制，支持object和array
 * @param {*} obj
 * @returns
 */
export const deepClone = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    // If obj is an array, create a new array and deep clone each element
    return obj.map((item) => deepClone(item)) as unknown as T;
  } else if (obj && typeof obj === "object") {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value instanceof Date) {
          newObj[key] = new Date(value.getTime());
        } else {
          newObj[key] = deepClone(value);
        }
      }
    }
    return newObj as T;
  } else {
    return obj;
  }
};

export const getEnv = (
  key: string,
  defaultValue?: string,
  env = process.env
): string => {
  const value = env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
};

// 添加一个获取数据库ID的方法
export const getDatabaseId = (category: string) => {
  // 反向查找 databaseMapping
  const entries = Object.entries(SiteConfig.databaseMapping);
  const found = entries.find(([_, value]) => value === category);
  return found ? found[0] : undefined;
};

/**
 * 是否可迭代
 * @param {*} obj
 * @returns
 */
export const isIterable = (obj: any) => {
  return obj != null && typeof obj[Symbol.iterator] === "function";
};

// 处理标签映射：合并相同标签、去重文章，同时为前端展示补充字段（返回 Map）
export const processTags = (
  tagOptions: any[]
): Map<
  string,
  { id: string; name: string; articles: any[]; count: number; value: string }
> => {
  // 创建一个 Map，以标签 id 为 key，用于去重和聚合
  const tagMap = new Map<
    string,
    { id: string; name: string; articles: any[]; count: number; value: string }
  >();

  for (const tag of tagOptions || []) {
    const existingTag = tagMap.get(tag.id);
    const newArticles = tag.articles || [];

    if (existingTag) {
      // 合并已有文章并去重
      const articlesMap = new Map(
        existingTag.articles.map((article: any) => [article.id, article])
      );

      newArticles.forEach((article: any) => {
        articlesMap.set(article.id, article);
      });

      const mergedArticles = Array.from(articlesMap.values());

      // 更新已有标签信息，包括 count 和 value
      existingTag.articles = mergedArticles;
      existingTag.count = mergedArticles.length;
      existingTag.value = existingTag.name;
    } else {
      // 新标签，直接添加，同时初始化 count 和 value 字段
      tagMap.set(tag.id, {
        id: tag.id,
        name: tag.name,
        articles: newArticles,
        count: newArticles.length, // 文章数量
        value: tag.name, // 用于前端展示的值
      });
    }
  }

  return tagMap;
};
