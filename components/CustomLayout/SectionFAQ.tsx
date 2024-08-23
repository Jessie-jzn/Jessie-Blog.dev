import { useState } from "react";
import { motion } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer: string;
}
const faqs = [
  {
    question: "你能从这个博客中获得什么？",
    answer:
      "在这个博客中，我会分享技术见解、旅行攻略和生活感悟，技术分享主要包括 Next.js、React 和 Node.js 等前端技术，搭建高效、美观、用户友好的 web 应用，旅行攻略包括国内外旅游攻略详情",
  },
  {
    question: "为什么要有这个博客？",
    answer:
      "我对编程和技术分享的热爱促使我创建了这个博客。这里是我记录开发历程、分享技术技巧，并提供深入的编程指南的平台。通过这个博客，我希望与各位开发者建立联系，分享有价值的见解，并提供实用的建议，帮助大家提升编程技能。我相信技术能够改变世界，创造更好的未来。我希望我的博客能成为你编程学习的灵感和信息来源。",
  },
  {
    question: "针对技术开发，使用的工具有哪些？",
    answer:
      "编辑器：Visual Studio Code,版本控制：Git & GitHub,框架和库：Next.js, React, Node.js, Tailwind CSS,开发环境：Docker, Vercel",
  },
];
const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dark:text-white text-zinc-800">
      <motion.div
        initial={false}
        className={`cursor-pointer flex justify-between items-center py-4 px-6 border-t border-gray-700`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-bold">{question}</h3>
        <motion.div
          className="text-2xl zinc-800"
          transition={{ duration: 0.2 }}
        >
          {isOpen ? "−" : "+"}
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 text-sm">{answer}</div>
      </motion.div>
    </div>
  );
};
const SectionFAQ = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.section
      className="bg-[#f8f5dc] p-16 flex justify-start items-center min-h-96 xs:flex-col dark:bg-gray-950 dark:text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      variants={fadeInUp}
    >
      <h2 className="text-4xl font-bold text-zinc-800 mr-72 ml-56  xs:mb-16 dark:text-white">
        FAQs
      </h2>
      <div className="flex flex-col dark:text-white">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </motion.section>
  );
};
export default SectionFAQ;
