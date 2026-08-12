/**
 * 404 页面：根据未知路径推断分类后跳转到对应分类页或首页。
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SiteConfig from '@/site.config';
import PageHeader from '@/components/common/PageHeader';

export default function Custom404() {
  const router = useRouter();
  const { asPath } = router;

  useEffect(() => {
    // 尝试从路径中提取分类
    const pathParts = asPath.split('/');
    const possibleCategory = pathParts[1];

    const timer = setTimeout(() => {
      // 检查是否是已知的分类
      if (possibleCategory && Object.values(SiteConfig.databaseMapping).includes(possibleCategory)) {
        // 如果是已知分类，重定向到分类页面
        router.push(`/${possibleCategory}`);
      } else {
        // 否则重定向到首页
        router.push('/');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, asPath]);

  return (
    <div className="min-h-[70vh] bg-canvas text-ink">
      <PageHeader
        eyebrow="404"
        title="页面不存在"
        description="正在为您重定向，也可以立即返回首页。"
        align="center"
      />
      <div className="site-container flex justify-center pb-16 md:pb-24">
        <Link
          href="/"
          className="editorial-focus inline-flex min-h-11 items-center justify-center rounded-xl border border-line bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primaryStrong"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
