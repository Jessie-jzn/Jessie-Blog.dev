import React from 'react';
import { formatTimestampToDate } from '@/lib/util';

interface PropertyValueProps {
  type: 'lastEdited' | 'created' | 'published';
  block?: {
    last_edited_time?: number;
    created_time?: number;
  };
  data?: any;
  schema?: { name: string };
  pageHeader?: boolean;
}

const NotionPropertyValue = (
  { type, block, data, schema, pageHeader }: PropertyValueProps,
  defaultFn: () => React.ReactNode,
) => {
  if (pageHeader) {
    let date: number | undefined;

    switch (type) {
      case 'lastEdited':
        date = block?.last_edited_time;
        if (date) {
          return `最新编辑 ${formatTimestampToDate(date)}`;
        }
        break;
      case 'created':
        date = block?.created_time;
        if (date) {
          return `${formatTimestampToDate(date)}`;
        }
        break;
      case 'published':
        if (schema?.name?.toLowerCase() === 'published') {
          const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;
          if (publishDate) {
            return formatTimestampToDate(publishDate);
          }
        }
        break;
    }
  }

  return defaultFn();
};

export default NotionPropertyValue;
