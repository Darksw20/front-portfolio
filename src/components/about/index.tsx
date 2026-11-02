import { useI18n } from '@/lib/i18n';
/* eslint-disable @next/next/no-img-element -- profile photos are managed URLs. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { portfolioAssets } from "@/lib/portfolio-assets";
import localFont from "next/font/local";
import { publicApi } from "@/lib/public-api";
import styles from "./about.module.css";
export const gameFont = localFont({ src: "../../../public/fonts/upheavtt.ttf" });
export const futuraFont = localFont({ src: "../../../public/fonts/futura medium bt.ttf" });
type Profile = { displayName: string; headline: string; biography: string; workHistory: string; photoUrl: string | null };
type Experience = { slug: string; company: string; title: string; summary: string; startMonth: string | null; endMonth: string | null; isCurrent: boolean };
type Project = { slug: string; title: string; summary: string; startDate: string | null };
export default function About() {
  const {locale,t}=useI18n();
  const [experiences, setExperiences] = useState<Experience[]>([]); const [profile, setProfile] = useState<Profile | null>(null); const [projects, setProjects] = useState<Project[]>([]); const [error, setError] = useState("");
  useEffect(() => {
    let active=true; setError(""); setProfile(null); setExperiences([]); setProjects([]);
    publicApi<{items: Experience[]}>('/v1/public/experiences',locale).then(data => { if(active)setExperiences(data.items) }).catch(() => { if(active)setError(t.loadCareerError) });
    publicApi<Profile>("/v1/public/profile",locale).then(data => { if(active)setProfile(data) }).catch(() => { if(active)setError(t.loadProfileError) });
    publicApi<{items: Project[]}>("/v1/public/projects?pageSize=48",locale).then(data => { if(active)setProjects(data.items.sort((a,b)=>(b.startDate || "").localeCompare(a.startDate || ""))) }).catch(() => { if(active)setError(t.loadContentError) });
    return () => { active=false };
  }, [locale,t]);
  return <main className={styles.page}><h1 className={`${gameFont.className} ${styles.title}`}>{`> ${t.aboutTitle}_`}</h1>{error && <p role="alert">{error}</p>}{profile && <><section className={styles.identity}><div className={styles.portrait}>{profile.photoUrl ? <img src={profile.photoUrl} alt={profile.displayName} className={styles.photo} /> : <img src={portfolioAssets.profilePhoto} alt={profile.displayName} width={350} height={350} className={styles.photo} />}</div><div className={styles.bio}><p className={styles.eyebrow}>{t.who}</p><h2>{profile.displayName}</h2><p>{profile.biography}</p><p className={styles.headline}>{profile.headline}</p></div></section><div className={styles.history}>{experiences.length > 0 && <section><h2>{t.career}</h2><div className={styles.timeline}>{experiences.map(entry => <article key={entry.slug}><h3><Link href={`/experience/${entry.slug}`}>{entry.title} · {entry.company} ↗</Link></h3><time>{entry.startMonth || ''} {entry.startMonth ? '—' : ''} {entry.isCurrent ? t.current : entry.endMonth || t.noEnd}</time><p>{entry.summary}</p></article>)}</div><Link className={styles.button} href="/experience">{t.allExperience} →</Link></section>}<section><h2>{t.featuredProjects}</h2><div className={styles.projects}>{projects.map(project => <article key={project.slug}><h3><Link href={`/work/${project.slug}`}>{project.title} ↗</Link></h3>{project.startDate && <time>{project.startDate}</time>}<p>{project.summary}</p></article>)}</div><Link className={styles.button} href="/work">{t.allProjects} →</Link></section></div></>}</main>;
}
