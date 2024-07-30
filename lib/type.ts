import { ExtendedRecordMap, Block } from 'notion-types';

export interface MenuItem {
  id: number;
  slug?: string;
  title: string;
  url: string;
}
export interface PageError {
  message?: string;
  statusCode: number;
}
export interface Post {
  id: string;
  description?: string;
  name?: string;
  published?: boolean;
  url: string;
  date?: string;
  image: string;
  tags?: any;
  tagItems?: { name: string; color: string }[];
  pageCover?: string;
  cover?: string;
  created_time?: string;
  country: string[];
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
}

export interface SchemaProp {
  [key: string]: {
    type: string;
    name: string;
  };
}
