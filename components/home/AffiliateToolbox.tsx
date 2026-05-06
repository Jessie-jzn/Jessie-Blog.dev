import React from 'react';

const AffiliateToolbox = () => {
  const tools = [
    {
      name: '汇款',
      desc: 'Wise 首汇',
      icon: '💸',
      link: 'https://wise.prf.hn/l/LAR8QdR/',
      className:
        'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
    {
      name: 'WHV 保险',
      desc: '对比文',
      icon: '🛡️',
      link: '/whv-zh//australia-health-insurance-guide-whv-comparison/',
      className:
        'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
    {
      name: '电话卡',
      desc: '澳新',
      icon: '📲',
      link: '/whv-zh/australia-sim-card-guide/',
      className:
        'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
    {
      name: '住宿',
      desc: 'Booking',
      icon: '🏨',
      link: 'https://wise.prf.hn/l/LAR8QdR/',
      className:
        'bg-neutral-50 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
      {tools.map((tool, index) => (
        <a
          key={index}
          href={tool.link}
          target='_blank'
          rel='nofollow noopener noreferrer'
          className={`group rounded-2xl p-4 transition-all duration-300 ring-1 ring-black/[0.04] dark:ring-white/[0.06] flex items-center gap-3 ${tool.className}`}
        >
          <span className='text-xl opacity-90 shrink-0'>{tool.icon}</span>
          <div className='min-w-0'>
            <div className='font-semibold text-sm truncate'>{tool.name}</div>
            <div className='text-[11px] opacity-65'>{tool.desc}</div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default AffiliateToolbox;
