import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { subscribeToNewsletter } from "@/lib/mailchimp";

const NewsletterSubscribe: React.FC = () => {
  const { t } = useTranslation("common");
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (emailRef.current) {
        const email = emailRef.current.value;
        if (email) {
          try {
            const response = await subscribeToNewsletter(email);
            if (response.success) {
              setMessage(t("subscriptionSuccess"));
              emailRef.current.value = "";
            } else {
              setMessage(response.message);
            }
          } catch (error) {
            console.error("Subscription failed:", error);
            setMessage(t("subscriptionFailed"));
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setMessage(t("emailRequired"));
        }
      }
    },
    [t]
  );

  return (
    <form className="rounded-2xl" ref={formRef} onSubmit={handleSubscribe}>
      <div className="mt-6 flex">
        <input
          type="email"
          ref={emailRef}
          placeholder="Email address"
          disabled={isSubmitting}
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
        />
        <button
          className="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 ml-4 flex-none"
          type="submit"
        >
          {isSubmitting ? <span className="loader"></span> : t("subscribe")}
        </button>
      </div>
    </form>
  );
};

export default NewsletterSubscribe;
