import { useI18n } from '@/lib/i18n';
/* eslint-disable @next/next/no-img-element -- project images can be managed URLs. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";
import { gameFont } from "./fonts";
import styles from "./work.module.css";
type Project = { slug: string; title: string; summary: string; primaryImageUrl: string | null; tags: Array<{ slug: string; name: string }> };
type Area = { slug: string; name: string };
type ProjectResponse = { items: Project[]; page: { number: number; totalPages: number } };
export default function Work() {
  const {locale,t}=useI18n();
  const [areas, setAreas] = useState<Area[]>([]); const [area, setArea] = useState(""); const [areasError, setAreasError] = useState(false);
  useEffect(() => { let active = true; setAreasError(false); publicApi<{items: Area[]}>("/v1/public/project-areas",locale).then(data => { if (active) setAreas(data.items); }).catch(() => { if (active) setAreasError(true); }); return () => { active = false; }; }, [locale]);
  const [projects, setProjects] = useState<Project[]>([]); const [query, setQuery] = useState(""); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(0); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    publicApi<ProjectResponse>(`/v1/public/projects?query=${encodeURIComponent(query)}&page=${page}&area=${encodeURIComponent(area)}`,locale)
      .then(response => { if (active) { setProjects(response.items); setTotalPages(response.page.totalPages); } })
      .catch((err: Error) => { if (active) { setProjects([]); setError(t.loadContentError); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, page, area, locale, t]);
  return <main className={styles.page}><header className={styles.header}><div><p className={styles.eyebrow}>{t.workEyebrow}</p><h1 className={`${gameFont.className} ${styles.title}`}>{`> ${t.workTitle}_`}</h1><p className={styles.intro}>{t.workIntro}</p></div><div className={styles.filters}><label className={styles.search}>{t.searchProject}<input type="search" placeholder={t.searchPlaceholder} value={query} onChange={event => { setPage(1); setQuery(event.target.value); }} /></label><label className={styles.search}>{t.area}<select value={area} disabled={areasError} onChange={event => { setPage(1); setArea(event.target.value); }}><option value="">{t.allAreas}</option>{areas.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>{areasError && <p role="status">{t.areaError}</p>}</div></header>
    {error && <p role="alert">{error}</p>}{loading && <p role="status">{t.loadingProjects}</p>}{!loading && !error && !projects.length && <p>{t.noProjects}</p>}
    <div className={styles.grid}>{projects.map(project => <Link href={`/work/${project.slug}`} className={styles.card} key={project.slug}>
      <div className={styles.image}>{project.primaryImageUrl ? <img src={project.primaryImageUrl} alt="" loading="lazy" /> : <div className={styles.placeholder} aria-hidden="true"><span>RN<span className={styles.cursor}>_</span></span><small>{t.projectPortfolio}</small></div>}<span className={styles.arrow} aria-hidden="true">↗</span></div>
      <div className={styles.cardContent}><p className={styles.tags}>{project.tags.map(tag => tag.name).join(' / ') || t.project}</p><h2>{project.title}</h2><p>{project.summary}</p><span className={styles.more}>{t.viewProject} →</span></div>
    </Link>)}</div>
    {totalPages > 1 && <div className={styles.pagination}><button disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>{t.previous}</button><span>{page} / {totalPages}</span><button disabled={page >= totalPages || loading} onClick={() => setPage(page + 1)}>{t.next}</button></div>}
  </main>;
}
