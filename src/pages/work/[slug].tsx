import { useI18n } from '@/lib/i18n';
/* eslint-disable @next/next/no-img-element -- project images can be managed URLs. */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { gameFont } from "@/components/work/fonts";
import styles from "@/components/work/work.module.css";
import { publicApi } from "@/lib/public-api";
type Detail = { title: string; summary: string; description: string; githubUrl: string | null; websiteUrl: string | null; coverImageUrl: string | null; galleryImageUrls: string[]; skills: Array<{id: string; name: string}>; tags: Array<{slug: string; name: string}>; roles: Array<{slug: string; name: string}>; media: Array<{url: string; altText: string; isPrimary: boolean}> };
export default function ProjectDetailPage() {
  const {locale,t}=useI18n();
  const router = useRouter(); const slug = typeof router.query.slug === "string" ? router.query.slug : ""; const [project, setProject] = useState<Detail | null>(null); const [error, setError] = useState("");
  useEffect(() => { if (!slug) return; let active = true; setProject(null); setError(""); publicApi<Detail>(`/v1/public/projects/${encodeURIComponent(slug)}`,locale).then(value => { if (active) setProject(value); }).catch((err: Error) => { if (active) setError(t.loadProjectError); }); return () => { active = false; }; }, [slug,locale,t]);
  const cover = project?.coverImageUrl || project?.media.find(item => item.isPrimary)?.url;
  const gallery = [...(project?.galleryImageUrls ?? []), ...(project?.media.filter(item => item.url !== cover).map(item => item.url) ?? [])].filter((url, index, all) => url !== cover && all.indexOf(url) === index);
  return <div className="flex flex-row"><Navbar /><main className={styles.page}><Link href="/work" className={styles.back}>← {t.workBack}</Link>{error ? <p role="alert">{error}</p> : !project ? <p role="status">{t.loadingProject}</p> : <><header className={styles.detailHeader}><p className={styles.eyebrow}>{t.projectEyebrow}</p><h1 className={`${gameFont.className} ${styles.title}`}>{project.title}_</h1><p className={styles.summary}>{project.summary}</p><div className={styles.links}>{project.githubUrl && /^https?:\/\//i.test(project.githubUrl) && <a className={styles.linkButton} href={project.githubUrl} target="_blank" rel="noopener noreferrer">{t.github} ↗</a>}{project.websiteUrl && /^https?:\/\//i.test(project.websiteUrl) && <a className={styles.linkButton} href={project.websiteUrl} target="_blank" rel="noopener noreferrer">{t.visitSite} ↗</a>}</div></header><div className={styles.projectDetail}>{cover && <img className={styles.hero} src={cover} alt={project.title} />}<div className={styles.detailBody}><section><h2 className={styles.eyebrow}>{t.aboutProject}</h2><p className={styles.description}>{project.description}</p></section><dl className={styles.meta}>{project.skills?.length > 0 && <><dt>{t.skills}</dt><dd>{project.skills.map(skill => skill.name).join(' · ')}</dd></>}{project.tags.length > 0 && <><dt>{t.technologies}</dt><dd>{project.tags.map(tag => tag.name).join(' · ')}</dd></>}{project.roles.length > 0 && <><dt>{t.participation}</dt><dd>{project.roles.map(role => role.name).join(' · ')}</dd></>}</dl></div></div>{gallery.length > 0 && <section className={styles.gallery}><h2>{t.gallery}</h2><div className={styles.galleryGrid}>{gallery.map((url, index) => <img key={url} src={url} alt={`${project.title} — ${t.image} ${index + 1}`} loading="lazy" />)}</div></section>}</>}</main></div>;
}
