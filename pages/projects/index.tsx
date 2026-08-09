/**
 * 项目页：基于本地 PROJECTS 数据展示项目经历，并加载公共国际化文案。
 */
import Link from "next/link";
import type { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PageHeader from "@/components/common/PageHeader";
import { PROJECTS } from "@/lib/projects";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "zh", ["common"])),
  },
});

export default function ProjectsPage() {
  const { t } = useTranslation("common");

  return (
    <div className="bg-canvas text-ink">
      <PageHeader
        eyebrow={t("projectsPage.eyebrow")}
        title={t("projectsPage.title")}
        description={t("projectsPage.description")}
      />
      <main className="site-container pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 rounded-2xl border border-line bg-muted p-6 sm:p-8">
            <p className="text-sm font-medium text-primaryStrong">{t("projectsPage.experienceLabel")}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">{t("projectsPage.experienceTitle")}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">{t("projectsPage.experienceDescription")}</p>
          </div>
          <div className="space-y-5">
            {PROJECTS.map((project) => (
              <article key={project.id} className="editorial-card rounded-2xl p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primaryStrong">{t(`projectsPage.status.${project.status}`)}</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{project.title}</h2>
                  </div>
                  <p className="rounded-full bg-primarySoft px-3 py-1 text-xs font-medium text-primaryStrong">{project.role}</p>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-subtle">{project.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} technology stack`}>
                  {project.stack.map((item) => <li key={item} className="editorial-tag rounded-full px-3 py-1 text-xs">{item}</li>)}
                </ul>
                {(project.href || project.repository) && (
                  <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
                    {project.href && <Link href={project.href} className="editorial-focus rounded-md text-primaryStrong hover:underline">{t("projectsPage.viewProject")}</Link>}
                    {project.repository && <a href={project.repository} target="_blank" rel="noreferrer" className="editorial-focus rounded-md text-primaryStrong hover:underline">{t("projectsPage.viewRepository")}</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tools/resume" className="editorial-focus inline-flex rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink hover:bg-primarySoft">
              {t("projectsPage.resume")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
