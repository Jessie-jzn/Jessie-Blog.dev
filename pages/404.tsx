import { useEffect } from 'react';
import { useRouter } from 'next/router';
import SiteConfig from '@/site.config';

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">页面不存在</h1>
      <p className="text-gray-600">正在为您重定向...</p>
    </div>
  );
} 