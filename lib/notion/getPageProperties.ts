import SiteConfig from "../../site.config";
import { getDateValue, getTextContent } from "@/lib/notion-utils";
import { formatDate, formatTimestampToDate } from "@/lib/util"; // 假设这些是存在的实用函数

interface PageProperties {
  id: string;
  [key: string]: any;
}

interface Schema {
  [key: string]: {
    type: string;
    name: string;
  };
}

interface TagOption {
  value: string;
  color: string;
}

interface Value {
  properties?: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  format?: {
    page_full_width?: boolean;
    page_icon?: string;
    page_cover?: string;
  };
  content?: any[];
}

/**
 * 获取页面元素成员属性
 * @param {string} id - 页面ID
 * @param {Value} value - 页面值
 * @param {Schema} schema - 页面架构
 * @param {TagOption[]} tagOptions - 标签选项
 * @returns {Promise<PageProperties>} - 返回页面属性
 */
const getPageProperties = async (
  id: string,
  value: Value,
  schema: Schema,
  tagOptions: TagOption[]
): Promise<PageProperties> => {
  const rawProperties = Object.entries(value?.properties || []);
  const excludeProperties = ["date", "select", "multi_select", "person"];
  const properties: PageProperties = { id };

  for (const [key, val] of rawProperties) {
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val);
    } else {
      switch (schema[key]?.type) {
        case "date": {
          const dateProperty = getDateValue(val);
          properties[schema[key].name] = dateProperty;
          break;
        }
        case "select":
        case "multi_select": {
          const selects = getTextContent(val);
          if (selects.length) {
            properties[schema[key].name] = selects.split(",");
          }
          break;
        }
        // case 'person': {
        //   const rawUsers = val.flat();
        //   const users = [];
        //   const api = new NotionAPI({ authToken });

        //   for (const userArr of rawUsers) {
        //     if (userArr[0][1]) {
        //       const userId = userArr[0];
        //       const res = await api.getUsers(userId);
        //       const resValue = res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value;
        //       const user = {
        //         id: resValue?.id,
        //         first_name: resValue?.given_name,
        //         last_name: resValue?.family_name,
        //         profile_photo: resValue?.profile_photo,
        //       };
        //       users.push(user);
        //     }
        //   }
        //   properties[schema[key].name] = users;
        //   break;
        // }
        default:
          break;
      }
    }
  }

  // 映射键：用户自定义表头名
  //   const fieldNames = SiteConfig.NOTION_PROPERTY_NAME;
  //   if (fieldNames) {
  //     for (const key in fieldNames) {
  //       if (fieldNames[key] && properties[fieldNames[key]]) {
  //         properties[key] = properties[fieldNames[key]];
  //       }
  //     }
  //   }

  // type\status\category 是单选下拉框 取数组第一个
  properties.type = properties.type?.[0] || "";
  properties.status = properties.status?.[0] || "";
  properties.category = properties.category?.[0] || "";
  properties.comment = properties.comment?.[0] || "";

  // 映射值：用户个性化 type 和 status 字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(properties);

  properties.publishDate = new Date(
    properties?.date?.start_date || value.created_time
  ).getTime();
  properties.publishDay = formatDate(
    properties.publishDate,
    SiteConfig.language
  );
  properties.lastEditedDate = formatTimestampToDate(value?.last_edited_time);
  properties.lastEditedDay = formatDate(
    new Date(value?.last_edited_time),
    SiteConfig.language
  );
  properties.fullWidth = value?.format?.page_full_width ?? false;
  properties.pageIcon = mapImgUrl(value?.format?.page_icon, value) ?? "";
  properties.pageCover = mapImgUrl(value?.format?.page_cover, value) ?? "";
  properties.pageCoverThumbnail =
    mapImgUrl(value?.format?.page_cover, value, "block") ?? "";
  properties.ext = convertToJSON(properties?.ext);
  properties.content = value.content ?? [];
  properties.tagItems =
    properties?.tags?.map((tag: any) => {
      return {
        name: tag,
        color: tagOptions?.find((t) => t.value === tag)?.color || "",
      };
    }) || [];

  delete properties.content;
  return properties;
};

export default getPageProperties;

/**
 * 字符串转json
 * @param {*} str
 * @returns
 */
const convertToJSON = (str: string) => {
  if (!str) {
    return {};
  }
  // 使用正则表达式去除空格和换行符
  try {
    return JSON.parse(str.replace(/\s/g, ""));
  } catch (error) {
    console.warn("无效JSON", str);
    return {};
  }
};

interface MapProperties {
  type?: string;
  status?: string;
  [key: string]: any;
}
/**
 * 映射用户自定义表头
 * @param {Properties} properties - 页面属性对象
 */
const mapProperties = (properties: MapProperties): void => {
  if (properties?.type === SiteConfig.NOTION_PROPERTY_NAME.type_post) {
    properties.type = "Post";
  } else if (properties?.type === SiteConfig.NOTION_PROPERTY_NAME.type_page) {
    properties.type = "Page";
  } else if (properties?.type === SiteConfig.NOTION_PROPERTY_NAME.type_notice) {
    properties.type = "Notice";
  }

  if (properties?.status === SiteConfig.NOTION_PROPERTY_NAME.status_publish) {
    properties.status = "Published";
  } else if (
    properties?.status === SiteConfig.NOTION_PROPERTY_NAME.status_invisible
  ) {
    properties.status = "Invisible";
  }
};

/**
 * 图片映射
 * 根据给定的图片地址、数据块及类型，将图片地址转换为对应的永久地址，并根据配置决定是否压缩图片。
 *
 * @param {string} img - 图片地址，可能是相对路径或外链。
 * @param {any} block - 数据块，可能是单个内容块或Page。
 * @param {string} [type='block'] - 数据块类型，默认为 'block'。可以是 'block' 或 'collection'。
 * @param {boolean} [needCompress=true] - 是否需要压缩图片，默认为 true。
 * @returns {string | null} - 返回映射后的图片地址，如果 img 为空则返回 null。
 */
const mapImgUrl = (
  img: string | undefined,
  block: any,
  type: string = "block",
  needCompress: boolean = true
): string | null => {
  if (!img) {
    return null;
  }

  let ret: string | null = null;

  // 如果图片地址是相对路径，则视为 Notion 的自带图片
  if (img.startsWith("/")) {
    ret = SiteConfig.NOTION_HOST + img;
  } else {
    ret = img;
  }

  // 判断是否是 Notion 的图床转换地址
  const hasConverted =
    ret.startsWith("https://www.notion.so/image") ||
    ret.includes("notion.site/images/page-cover/");

  // 判断是否需要转换的 URL (AWS 图床地址或者 bookmark 类型的外链图片)
  const needConvert =
    !hasConverted &&
    (block.type === "bookmark" ||
      ret.includes("secure.notion-static.com") ||
      ret.includes("prod-files-secure"));

  // 使用 Notion 图传转换地址
  if (needConvert) {
    ret =
      SiteConfig.NOTION_HOST +
      "/image/" +
      encodeURIComponent(ret) +
      "?table=" +
      type +
      "&id=" +
      block.id;
  }

  // 如果不是 emoji 并且不是 Notion 的 page-cover 图片
  if (!isEmoji(ret) && !ret.includes("notion.so/images/page-cover")) {
    // if (SiteConfig.RANDOM_IMAGE_URL) {
    //   // 只有配置了随机图片接口，才会替换图片
    //   const texts = SiteConfig.RANDOM_IMAGE_REPLACE_TEXT;
    //   let isReplace = false;

    //   if (texts) {
    //     const textArr = texts.split(',');
    //     // 判断是否包含替换的文本
    //     textArr.forEach((text) => {
    //       if (ret.includes(text)) {
    //         isReplace = true;
    //       }
    //     });
    //   } else {
    //     isReplace = true;
    //   }

    //   if (isReplace) {
    //     ret = SiteConfig.RANDOM_IMAGE_URL;
    //   }
    // }

    // 图片 URL 优化，确保每篇文章的图片 URL 唯一
    if (
      ret &&
      ret.length > 4 &&
      !ret.includes("https://www.notion.so/images/")
    ) {
      // 图片接口拼接唯一识别参数，防止请求的图片被缓存而导致随机结果相同
      const separator = ret.includes("?") ? "&" : "?";
      ret = `${ret.trim()}${separator}t=${block.id}`;
    }
  }

  // 统一压缩图片
  if (needCompress) {
    const width = block?.format?.block_width;
    ret = compressImage(ret, width);
  }

  return ret;
};

/**
 * 压缩图片
 * 根据指定的 URL 查询参数压缩裁剪图片。
 * 1. Notion 图床可以通过指定 URL 查询参数来压缩裁剪图片，例如 ?xx=xx&width=400。
 * 2. Unsplash 图片可以通过 API 参数 q=50 控制压缩质量，width=400 控制图片尺寸。
 *
 * @param {string} image - 图片地址，可能是相对路径或外链。
 * @param {number} [width] - 压缩后的图片宽度。
 * @param {number} [quality=50] - 压缩质量，默认值为 50。
 * @param {string} [fmt='webp'] - 图片格式，默认值为 'webp'。
 * @returns {string} - 返回压缩后的图片地址。
 */
const compressImage = (
  image: string,
  width: number = 100,
  quality: number = 50,
  fmt: string = "webp"
): string => {
  if (!image || !image.startsWith("http")) {
    return image;
  }

  if (image.includes(".svg")) {
    return image;
  }

  //   if (!width || width === 0) {
  //     width = siteConfig('IMAGE_COMPRESS_WIDTH');
  //   }

  // 将 URL 解析为一个对象
  const urlObj = new URL(image);
  // 获取 URL 参数
  const params = new URLSearchParams(urlObj.search);

  // Notion 图床
  if (
    image.startsWith(SiteConfig.NOTION_HOST) &&
    image.includes("amazonaws.com")
  ) {
    params.set("width", width.toString());
    params.set("cache", "v2");
    // 生成新的 URL
    urlObj.search = params.toString();
    return urlObj.toString();
  } else if (image.startsWith("https://images.unsplash.com/")) {
    // 压缩 Unsplash 图片
    params.set("q", quality.toString());
    params.set("width", width.toString());
    params.set("fmt", fmt);
    params.set("fm", fmt);
    // 生成新的 URL
    urlObj.search = params.toString();
    return urlObj.toString();
  } else if (image.startsWith("https://your_picture_bed")) {
    // 添加自定义图传的封面图压缩参数
    // 示例： return 'do_somethin_here'
  }

  return image;
};
/**
 * 是否是emoji图标
 * @param {*} str
 * @returns
 */
const isEmoji = (str: string): boolean => {
  const emojiRegex =
    /[\u{1F300}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}\u{2B06}\u{2B07}\u{2B05}\u{27A1}\u{2194}-\u{2199}\u{2194}\u{21A9}\u{21AA}\u{2934}\u{2935}\u{25AA}\u{25AB}\u{25FE}\u{25FD}\u{25FB}\u{25FC}\u{25B6}\u{25C0}\u{1F200}-\u{1F251}]/u;
  return emojiRegex.test(str);
};
