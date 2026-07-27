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
    <div className="editorial-surface overflow-hidden rounded-2xl text-ink">
      <motion.button
        type="button"
        initial={false}
        aria-expanded={isOpen}
        className="editorial-focus flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-semibold sm:text-lg">{question}</span>
        <motion.div
          aria-hidden="true"
          className="text-2xl text-primaryStrong"
          transition={{ duration: 0.2 }}
        >
          {isOpen ? "−" : "+"}
        </motion.div>
      </motion.button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="border-t border-line px-5 py-4 text-sm leading-6 text-subtle sm:px-6">
          {answer}
        </div>
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
      className="site-section bg-muted text-ink"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      variants={fadeInUp}
    >
      <div className="site-container grid gap-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primaryStrong">
            {t("faqSection.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            {t("faqSection.title")}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs?.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};
export default SectionFAQ;
