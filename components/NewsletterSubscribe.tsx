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
      className="editorial-surface group/form rounded-2xl p-5"
      ref={formRef}
      onSubmit={handleSubscribe}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          ref={emailRef}
          placeholder="Email address"
          disabled={isSubmitting}
          className="editorial-focus min-h-11 min-w-0 flex-auto appearance-none rounded-xl border border-line
          bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-subtle
          transition-colors duration-300 group-hover/form:border-primary/50"
        />
        <button
          className="editorial-focus inline-flex min-h-11 w-full flex-none items-center justify-center gap-2 rounded-xl
          border border-line bg-primary px-5 py-2.5 text-sm font-semibold tracking-tight text-white
          transition-colors duration-300 hover:bg-primaryStrong active:opacity-90 disabled:cursor-not-allowed
          disabled:opacity-60 sm:w-auto"
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
        <p className="mt-3 text-xs text-primaryStrong transition-colors duration-300 md:text-sm">
          {message}
        </p>
      )}
    </form>
  );
};

export default NewsletterSubscribe;
