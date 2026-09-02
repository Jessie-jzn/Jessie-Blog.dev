import Link from 'next/link';
import { useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/router';
import { createIntentPrefetch } from '@/lib/routing/intentPrefetch';

interface ArticleLinkProps {
  href: string;
  className: string;
  children: ReactNode;
}

/**
 * Keeps article lists lightweight while warming a detail page when the visitor
 * is about to open it.
 */
export default function ArticleLink({
  href,
  className,
  children,
}: ArticleLinkProps) {
  const router = useRouter();
  const prefetchOnIntent = useMemo(
    () => createIntentPrefetch(router.prefetch, href),
    [href, router.prefetch],
  );

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      onMouseEnter={prefetchOnIntent}
      onFocus={prefetchOnIntent}
      onTouchStart={prefetchOnIntent}
    >
      {children}
    </Link>
  );
}
