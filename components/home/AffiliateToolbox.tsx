import React from 'react';

const AffiliateToolbox = () => {
  const tools = [
    {
      name: '跨境汇款',
      desc: 'Wise首汇免费',
      icon: '💸',
      link: 'https://wise.prf.hn/click/camref:1110lvJeI',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      name: 'WHV保险',
      desc: '澳洲保险对比',
      icon: '🛡️',
      link: '/insurance-guide',
      color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    },
    {
      name: '澳洲流量',
      desc: 'eSIM立减$3',
      icon: '📲',
      link: '#',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      name: '住宿预订',
      desc: 'Booking',
      icon: '🏨',
      link: '#',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      {tools.map((tool, index) => (
        <a
          key={index}
          href={tool.link}
          target='_blank'
          rel='nofollow noopener noreferrer'
          className={`group ${tool.color} p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-3`}
        >
          <div className='text-2xl transform group-hover:scale-110 transition-transform'>
            {tool.icon}
          </div>
          <div>
            <div className='font-bold text-sm md:text-base'>{tool.name}</div>
            <div className='text-xs opacity-80'>{tool.desc}</div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default AffiliateToolbox;
