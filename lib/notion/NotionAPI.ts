import * as notion from "notion-types";
// @ts-ignore
import got, { OptionsOfJSONResponseBody } from "got";
import {
  getBlockCollectionId,
  getPageContentBlockIds,
  parsePageId,
  uuidToId,
} from "@/lib/notion-utils";
import pMap from "p-map";

// import * as types from './types';

/**
 * 签名URL请求的接口定义
 */
export interface SignedUrlRequest {
  permissionRecord: PermissionRecord; // 权限记录
  url: string; // 需要签名的URL
}

/**
 * 权限记录的接口定义
 */
export interface PermissionRecord {
  table: string; // 表名
  id: notion.ID; // Notion ID
}

/**
 * 签名URL响应的接口定义
 */
export interface SignedUrlResponse {
  signedUrls: string[]; // 签名后的URL数组
}

/**
 * Notion API 的主要客户端类
 */
export class NotionAPI {
  private readonly _apiBaseUrl: string; // Notion API的基础URL
  private readonly _authToken?: string; // 认证令牌
  private readonly _activeUser?: string; // 活动用户
  private readonly _userTimeZone: string; // 用户时区
  private readonly _databaseId?: string; // 数据库ID

  /**
   * 构造函数
   * @param apiBaseUrl - Notion API的基础URL
   * @param authToken - 认证令牌
   * @param activeUser - 活动用户
   * @param userTimeZone - 用户时区
   * @param databaseId - 数据库ID
   */
  constructor({
    apiBaseUrl = "https://www.notion.so/api/v3",
    authToken,
    activeUser,
    userTimeZone = "America/New_York",
    databaseId,
  }: {
    apiBaseUrl?: string;
    authToken?: string;
    userLocale?: string;
    userTimeZone?: string;
    activeUser?: string;
    databaseId?: string;
  } = {}) {
    this._apiBaseUrl = apiBaseUrl;
    this._authToken = authToken;
    this._activeUser = activeUser;
    this._userTimeZone = userTimeZone;
    this._databaseId = databaseId;
  }

  /**
   * 获取完整的页面数据
   * @param pageId - 页面ID
   * @param concurrency - 并发请求数
   * @param fetchMissingBlocks - 是否获取缺失的块
   * @param fetchCollections - 是否获取集合数据
   * @param signFileUrls - 是否签名文件URL
   * @param chunkLimit - 每次获取的块数限制
   * @param chunkNumber - 块的起始编号
   * @param gotOptions - got请求的选项
   * @returns 返回扩展的记录映射
   */
  public async getPage(
    pageId: string,
    {
      concurrency = 3,
      fetchMissingBlocks = true,
      fetchCollections = true,
      signFileUrls = true,
      chunkLimit = 100,
      chunkNumber = 0,
      gotOptions,
    }: {
      concurrency?: number;
      fetchMissingBlocks?: boolean;
      fetchCollections?: boolean;
      signFileUrls?: boolean;
      chunkLimit?: number;
      chunkNumber?: number;
      gotOptions?: OptionsOfJSONResponseBody;
    } = {}
  ): Promise<notion.ExtendedRecordMap> {
    // 获取原始页面数据
    const page = await this.getPageRaw(pageId, {
      chunkLimit,
      chunkNumber,
      gotOptions,
    });

    const recordMap = page?.recordMap as notion.ExtendedRecordMap;

    if (!recordMap?.block) {
      throw new Error(`Notion page not found "${uuidToId(pageId)}"`);
    }

    // 确保所有顶级映射都存在
    recordMap.collection = recordMap.collection ?? {};
    recordMap.collection_view = recordMap.collection_view ?? {};
    recordMap.notion_user = recordMap.notion_user ?? {};

    // 额外映射，便于使用（这些不是原生的 Notion 对象）
    recordMap.collection_query = {};
    recordMap.signed_urls = {};

    // 如果需要，获取缺失的内容块
    if (fetchMissingBlocks) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // fetch any missing content blocks
        const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
          (id) => !recordMap.block[id]
        );

        if (!pendingBlockIds.length) {
          break;
        }

        const newBlocks = await this.getBlocks(
          pendingBlockIds,
          gotOptions
        ).then((res) => res.recordMap.block);

        recordMap.block = { ...recordMap.block, ...newBlocks };
      }
    }

    const contentBlockIds = getPageContentBlockIds(recordMap);

    // Optionally fetch all data for embedded collections and their associated views.
    // NOTE: We're eagerly fetching *all* data for each collection and all of its views.
    // This is really convenient in order to ensure that all data needed for a given
    // Notion page is readily available for use cases involving server-side rendering
    // and edge caching.
    // 可选地获取嵌入集合及其关联视图的数据
    if (fetchCollections) {
      const allCollectionInstances: Array<{
        collectionId: string;
        collectionViewId: string;
      }> = contentBlockIds.flatMap((blockId) => {
        const block = recordMap.block[blockId].value;
        const collectionId =
          block &&
          (block.type === "collection_view" ||
            block.type === "collection_view_page") &&
          getBlockCollectionId(block, recordMap);

        if (collectionId) {
          return block.view_ids?.map((collectionViewId) => ({
            collectionId,
            collectionViewId,
          }));
        } else {
          return [];
        }
      });

      // 获取所有集合视图实例的数据
      await pMap(
        allCollectionInstances,
        async (collectionInstance) => {
          const { collectionId, collectionViewId } = collectionInstance;
          const collectionView =
            recordMap.collection_view[collectionViewId]?.value;

          try {
            const collectionData = await this.getCollectionData(
              collectionId,
              collectionViewId,
              collectionView,
              {
                gotOptions,
              }
            );

            // await fs.writeFile(
            //   `${collectionId}-${collectionViewId}.json`,
            //   JSON.stringify(collectionData.result, null, 2)
            // )

            recordMap.block = {
              ...recordMap.block,
              ...collectionData.recordMap.block,
            };

            recordMap.collection = {
              ...recordMap.collection,
              ...collectionData.recordMap.collection,
            };

            recordMap.collection_view = {
              ...recordMap.collection_view,
              ...collectionData.recordMap.collection_view,
            };

            recordMap.notion_user = {
              ...recordMap.notion_user,
              ...collectionData.recordMap.notion_user,
            };

            recordMap.collection_query![collectionId] = {
              ...recordMap.collection_query![collectionId],
              [collectionViewId]: (collectionData.result as any)
                ?.reducerResults,
            };
          } catch (err: any) {
            // It's possible for public pages to link to private collections, in which case
            // Notion returns a 400 error
            console.warn(
              "NotionAPI collectionQuery error",
              pageId,
              err.message
            );
            console.error(err);
          }
        },
        {
          concurrency,
        }
      );
    }

    // Optionally fetch signed URLs for any embedded files.
    // NOTE: Similar to collection data, we default to eagerly fetching signed URL info
    // because it is preferable for many use cases as opposed to making these API calls
    // lazily from the client-side.
    // 可选地获取嵌入文件的签名 URL
    if (signFileUrls) {
      await this.addSignedUrls({ recordMap, contentBlockIds, gotOptions });
    }

    return recordMap;
  }

  /**
   * 为记录映射添加签名URL
   * @param recordMap - 记录映射
   * @param contentBlockIds - 内容块ID数组
   * @param gotOptions - got请求的选项
   */
  public async addSignedUrls({
    recordMap,
    contentBlockIds,
    gotOptions = {},
  }: {
    recordMap: notion.ExtendedRecordMap;
    contentBlockIds?: string[];
    gotOptions?: OptionsOfJSONResponseBody;
  }) {
    recordMap.signed_urls = {};

    if (!contentBlockIds) {
      contentBlockIds = getPageContentBlockIds(recordMap);
    }

    const allFileInstances = contentBlockIds.flatMap((blockId) => {
      const block = recordMap.block[blockId]?.value;

      if (
        block &&
        (block.type === "pdf" ||
          block.type === "audio" ||
          (block.type === "image" && block.file_ids?.length) ||
          block.type === "video" ||
          block.type === "file" ||
          block.type === "page")
      ) {
        const source =
          block.type === "page"
            ? block.format?.page_cover
            : block.properties?.source?.[0]?.[0];

        if (source) {
          if (!source.includes("secure.notion-static.com")) {
            return [];
          }

          return {
            permissionRecord: {
              table: "block",
              id: block.id,
            },
            url: source,
          };
        }
      }

      return [];
    });

    if (allFileInstances.length > 0) {
      try {
        const { signedUrls } = await this.getSignedFileUrls(
          allFileInstances,
          gotOptions
        );

        if (signedUrls.length === allFileInstances.length) {
          for (let i = 0; i < allFileInstances.length; ++i) {
            const file = allFileInstances[i];
            const signedUrl = signedUrls[i];

            recordMap.signed_urls[file.permissionRecord.id] = signedUrl;
          }
        }
      } catch (err) {
        console.warn("NotionAPI getSignedfileUrls error", err);
      }
    }
  }

  /**
   * 获取原始页面数据
   * @param pageId - 页面ID
   * @param chunkLimit - 每次获取的块数限制
   * @param chunkNumber - 块的起始编号
   * @param gotOptions - got请求的选项
   * @returns 返回页面块数据
   */
  public async getPageRaw(
    pageId: string,
    {
      gotOptions,
      chunkLimit = 100,
      chunkNumber = 0,
    }: {
      chunkLimit?: number;
      chunkNumber?: number;
      gotOptions?: OptionsOfJSONResponseBody;
    } = {}
  ): Promise<notion.PageChunk> {
    const parsedPageId = parsePageId(pageId);

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`);
    }

    const body = {
      pageId: parsedPageId,
      limit: chunkLimit,
      chunkNumber: chunkNumber,
      cursor: { stack: [] },
      verticalColumns: false,
    };

    return this.fetch<notion.PageChunk>({
      endpoint: "loadPageChunk",
      body,
      gotOptions,
    });
  }

  /**
   * 获取集合数据
   * @param collectionId - 集合ID
   * @param collectionViewId - 集合视图ID
   * @param collectionView - 集合视图对象
   * @param limit - 结果数量限制
   * @param searchQuery - 搜索查询
   * @param userTimeZone - 用户时区
   * @param loadContentCover - 是否加载内容封面
   * @param gotOptions - got请求的选项
   * @returns 返回集合实例数据
   */
  public async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionView?: any,
    {
      limit = 9999,
      searchQuery = "",
      userTimeZone = this._userTimeZone,
      loadContentCover = true,
      gotOptions,
    }: {
      type?: notion.CollectionViewType; // 'table' | 'gallery' | 'list' | 'board' | 'calendar'
      limit?: number; // 结果限制数
      searchQuery?: string; // 搜索查询字符串
      userTimeZone?: string;
      userLocale?: string; // 用户时区
      loadContentCover?: boolean; // 是否加载内容封面
      gotOptions?: OptionsOfJSONResponseBody; // 请求选项
    } = {}
  ) {
    const type = collectionView?.type;
    // 检查是否为看板视图类型
    const isBoardType = type === "board";
    // 获取分组依据：看板视图使用board_columns_by，其他视图使用collection_group_by
    const groupBy = isBoardType
      ? collectionView?.format?.board_columns_by
      : collectionView?.format?.collection_group_by;

    // 初始化过滤器数组
    let filters = [];

    // 处理属性过滤器 (Property Filters)
    // 这些是在Notion界面上通过"Filter"按钮添加的过滤条件
    if (collectionView?.format?.property_filters) {
      filters = collectionView.format?.property_filters.map(
        (filterObj: any) => {
          return {
            filter: filterObj?.filter?.filter, // 过滤条件（例如：contains, does_not_contain等）
            property: filterObj?.filter?.property, // 要过滤的属性名
          };
        }
      );
    }

    // 处理高级过滤器 (Advanced Filters)
    // 这些通常是通过API或高级视图设置添加的过滤条件
    if (collectionView?.query2?.filter?.filters) {
      filters.push(...collectionView.query2.filter.filters);
    }

    // 配置数据加载器
    let loader: any = {
      type: "reducer",
      reducers: {
        collection_group_results: {
          type: "results",
          limit, // 结果数量限制
          loadContentCover, // 是否加载封面图片
        },
      },
      sort: [], // 排序条件
      ...collectionView?.query2,
      // 组合所有过滤条件
      filter: {
        filters: filters, // 过滤条件数组
        operator: "and", // 使用AND操作符组合所有过滤条件
      },
      searchQuery, // 搜索关键词
      userTimeZone, // 用户时区
    };

    // 处理分组
    if (groupBy) {
      // 获取分组信息，可能来自 board_columns 或 collection_groups
      const groups =
        collectionView?.format?.board_columns ||
        collectionView?.format?.collection_groups ||
        [];

      // 定义迭代器，根据不同的类型选择不同的迭代器
      const iterators = [
        isBoardType ? "board" : "group_aggregation",
        "results",
      ];
      // 定义运算符，用于不同类型的过滤条件
      const operators = {
        checkbox: "checkbox_is",
        url: "string_starts_with",
        text: "string_starts_with",
        select: "enum_is",
        multi_select: "enum_contains",
        created_time: "date_is_within",
        ["undefined"]: "is_empty", // 未定义的情况
      } as any;

      // 初始化 reducersQuery 对象，用于存储不同的 reducer 查询
      const reducersQuery = {} as any;

      // 遍历每个分组
      for (const group of groups) {
        const {
          property, // 分组的属性
          value: { value, type }, // 分组的值和类型
        } = group;

        // 遍历每个迭代器
        for (const iterator of iterators) {
          // 根据迭代器类型设置属性
          const iteratorProps =
            iterator === "results" // 结果迭代器
              ? {
                  type: iterator,
                  limit,
                }
              : {
                  type: "aggregation", // 聚合迭代器
                  aggregation: {
                    aggregator: "count", // 聚合方式为计数
                  },
                };
          // 判断值是否未定义
          const isUncategorizedValue = typeof value === "undefined";
          // 判断值是否为日期范围
          const isDateValue = value?.range;
          // 根据不同的值类型设置查询标签
          const queryLabel = isUncategorizedValue
            ? "uncategorized" // 未分类
            : isDateValue
            ? value.range?.start_date || value.range?.end_date // 日期范围
            : value?.value || value;

          // 根据不同的值类型设置查询值
          const queryValue =
            !isUncategorizedValue && (isDateValue || value?.value || value);
          // 构建 reducersQuery 对象
          reducersQuery[`${iterator}:${type}:${queryLabel}`] = {
            ...iteratorProps,
            filter: {
              operator: "and",
              filters: [
                {
                  property,
                  filter: {
                    operator: !isUncategorizedValue
                      ? operators[type]
                      : "is_empty",
                    ...(!isUncategorizedValue && {
                      value: {
                        type: "exact",
                        value: queryValue,
                      },
                    }),
                  },
                },
              ],
            },
          };
        }
      }
      // 根据是否为看板类型设置 reducer 标签
      const reducerLabel = isBoardType ? "board_columns" : `${type}_groups`;
      // 构建 loader 对象
      loader = {
        type: "reducer",
        reducers: {
          [reducerLabel]: {
            type: "groups",
            groupBy, // 分组依据
            ...(collectionView?.query2?.filter && {
              filter: collectionView?.query2?.filter, // 继承原有的过滤条件
            }),
            groupSortPreference: groups.map((group: any) => group?.value), // 分组排序偏好
            limit,
          },
          ...reducersQuery, // 包含所有的 reducersQuery
        },
        ...collectionView?.query2, // 继承原有查询条件
        searchQuery,
        userTimeZone,
        // 添加其他过滤条件
        filter: {
          filters: filters,
          operator: "and",
        },
      };
    }

    // if (isBoardType) {
    //   console.log(
    //     JSON.stringify(
    //       {
    //         collectionId,
    //         collectionViewId,
    //         loader,
    //         groupBy: groupBy || 'NONE',
    //         collectionViewQuery: collectionView.query2 || 'NONE'
    //       },
    //       null,
    //       2
    //     )
    //   )
    // }

    return this.fetch<notion.CollectionInstance>({
      endpoint: "queryCollection",
      body: {
        collection: {
          id: collectionId,
        },
        collectionView: {
          id: collectionViewId,
        },
        loader,
      },
      gotOptions,
    });
  }

  /**
   * 获取用户信息
   * @param userIds - 用户ID数组
   * @param gotOptions - got请求的选项
   * @returns 返回用户记录值
   */
  public async getUsers(
    userIds: string[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<notion.RecordValues<notion.User>>({
      endpoint: "getRecordValues",
      body: {
        requests: userIds.map((id) => ({ id, table: "notion_user" })),
      },
      gotOptions,
    });
  }

  /**
   * 获取块数据
   * @param blockIds - 块ID数组
   * @param gotOptions - got请求的选项
   * @returns 返回页面块数据
   */
  public async getBlocks(
    blockIds: string[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<notion.PageChunk>({
      endpoint: "syncRecordValues",
      body: {
        requests: blockIds.map((blockId) => ({
          // TODO: when to use table 'space' vs 'block'?
          table: "block",
          id: blockId,
          version: -1,
        })),
      },
      gotOptions,
    });
  }

  /**
   * 获取签名文件URL
   * @param urls - 需要签名的URL请求数组
   * @param gotOptions - got请求的选项
   * @returns 返回签名后的URL响应
   */
  public async getSignedFileUrls(
    urls: SignedUrlRequest[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<SignedUrlResponse>({
      endpoint: "getSignedFileUrls",
      body: {
        urls,
      },
      gotOptions,
    });
  }

  /**
   * 搜索Notion内容
   * @param params - 搜索参数
   * @param gotOptions - got请求的选项
   * @returns 返回搜索结果
   */
  public async search(
    params: notion.SearchParams,
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    //

    const body = {
      type: "BlocksInAncestor",
      source: "quick_find_public",
      ancestorId: parsePageId(params.ancestorId),
      sort: {
        field: "relevance",
      },
      limit: params.limit || 20,
      query: params.query,
      filters: {
        isDeletedOnly: false,
        isNavigableOnly: false,
        excludeTemplates: true,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {},
        ...params.filters,
      },
    };

    return this.fetch<notion.SearchResults>({
      endpoint: "search",
      body,
      gotOptions,
    });
  }

  /**
   * 通用的API请求方法
   * @param endpoint - API端点
   * @param body - 请求体
   * @param gotOptions - got请求的选项
   * @param headers - 自定义请求头
   * @returns 返回API响应数据
   */
  public async fetch<T>({
    endpoint,
    body,
    gotOptions,
    headers: clientHeaders,
  }: {
    endpoint: string;
    body: object;
    gotOptions?: OptionsOfJSONResponseBody;
    headers?: Record<string, string>;
  }): Promise<T> {
    const headers: any = {
      ...clientHeaders,
      ...gotOptions?.headers,
      "Content-Type": "application/json",
    };

    if (this._authToken) {
      headers.cookie = `token_v2=${this._authToken}`;
    }

    if (this._activeUser) {
      headers["x-notion-active-user-header"] = this._activeUser;
    }

    const url = `${this._apiBaseUrl}/${endpoint}`;

    return got
      .post(url, {
        ...gotOptions,
        json: body,
        headers,
      })
      .json();
  }
}
