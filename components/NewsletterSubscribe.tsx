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
    <form
      className="rounded-2xl group/form"
      ref={formRef}
      onSubmit={handleSubscribe}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
        <input
          type="email"
          ref={emailRef}
          placeholder="Email address"
          disabled={isSubmitting}
          className="min-w-0 flex-auto appearance-none rounded-lg border border-zinc-900/10 
          bg-white/80 px-3 py-2 text-sm md:text-base shadow-sm shadow-zinc-800/5 
          placeholder:text-zinc-400 
          focus:border-blue-500/80 focus:outline-none focus:ring-4 focus:ring-blue-500/10 
          dark:border-zinc-700/80 dark:bg-zinc-800/20 dark:text-zinc-200 
          dark:placeholder:text-zinc-500 
          dark:focus:border-blue-400/80 dark:focus:ring-blue-400/10
          backdrop-blur-sm transition-all duration-300
          group-hover/form:shadow-md group-hover/form:border-zinc-900/20 
          dark:group-hover/form:border-zinc-700/60"
        />
        <button
          className="inline-flex items-center gap-2 justify-center rounded-lg 
          py-2 px-4 text-sm md:text-base font-medium
          outline-offset-2 transition-all duration-300 active:transition-none
          bg-zinc-800/90 text-zinc-100 shadow-sm
          hover:bg-zinc-700 hover:shadow-md hover:-translate-y-0.5
          active:bg-zinc-800 active:text-zinc-100/70 
          dark:bg-zinc-700/90 dark:hover:bg-zinc-600 
          dark:active:bg-zinc-700 dark:active:text-zinc-100/70 
          sm:ml-4 flex-none backdrop-blur-sm w-full sm:w-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("subscribing")}
            </span>
          ) : (
            t("subscribe")
          )}
        </button>
      </div>
      {message && (
        <p className="mt-2 text-xs md:text-sm text-emerald-600 dark:text-emerald-400 transition-all duration-300">
          {message}
        </p>
      )}
    </form>
  );
};

export default NewsletterSubscribe;
