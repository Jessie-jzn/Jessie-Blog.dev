import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import * as Types from "@/lib/type";

interface FAQItemProps {
  question: string;
  answer: string;
}

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
  const { t } = useTranslation("common");
  const faqs: Types.FAQItem[] = t("faqs", {
    returnObjects: true,
  }) as Types.FAQItem[];
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
        {faqs?.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </motion.section>
  );
};
export default SectionFAQ;
