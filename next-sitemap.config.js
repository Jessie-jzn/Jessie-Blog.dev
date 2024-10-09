/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://www.jessieontheroad.com',  // 你的网站URL
    generateRobotsTxt: true, // 是否生成robots.txt文件
    sitemapSize: 5000, // 每个站点地图的最大条目数（可根据需求调整）
    exclude: ['/admin/*', '/user/*'], // 排除不需要被索引的页面
    changefreq: 'weekly', // 设置爬取频率，适用于动态内容频繁更新的网站
    priority: 0.8, // 页面优先级
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://www.jessieontheroad.com/sitemap.xml', // 可以添加额外的站点地图链接
      ],
    },
  };