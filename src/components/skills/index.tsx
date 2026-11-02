import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';
/* eslint-disable @next/next/no-img-element -- icons are administered image URLs. */
import localFont from 'next/font/local';
import { publicApi } from '@/lib/public-api';
import styles from './skills.module.css';

export const gameFont = localFont({ src: '../../../public/fonts/upheavtt.ttf' });
export const futuraFont = localFont({ src: '../../../public/fonts/futura medium bt.ttf' });
type Skill = { id: string; group: string; name: string; proficiency: number | null; description: string | null; iconUrl: string | null; developmentAreas: Array<{slug: string; es: string; en: string}> };
type Learning = { id: string; type: string; title: string; provider: string; description: string | null; completedOn: string | null; credentialUrl: string | null };

function SkillGroup({ title, items, symbol, wide = false }: { title: string; items: Skill[]; symbol: string; wide?: boolean }) {
  return <section className={styles.group}><header className={styles.groupHeader}><span className={styles.groupIcon} aria-hidden="true">{symbol}</span><h2>{title}</h2></header><ul className={`${styles.skillList} ${wide ? styles.wideList : ''}`}>{items.map(skill => <li key={skill.id}><span className={styles.icon} aria-hidden="true">{skill.iconUrl ? <img src={skill.iconUrl} alt="" loading="lazy" /> : skill.name.slice(0, 2).toUpperCase()}</span><div className={styles.skillText}><strong>{skill.name}</strong>{skill.description && <p>{skill.description}</p>}{skill.proficiency != null && <small>{skill.proficiency}%</small>}</div></li>)}</ul></section>;
}
export default function Skills() {
  const {locale,t,en}=useI18n();
  const [area, setArea] = useState(''); const [query, setQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]); const [learning, setLearning] = useState<Learning[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; setLoading(true); setError(''); setSkills([]); setLearning([]); Promise.all([publicApi<{items: Skill[]}>('/v1/public/skills',locale), publicApi<{items: Learning[]}>('/v1/public/learning',locale)]).then(([s,l]) => { if (active) { setSkills(s.items); setLearning(l.items); } }).catch(() => { if (active) setError(t.loadSkillsError); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [locale, t]);
  const soft = skills.filter(skill => skill.group === 'soft_skill');
  const hard = skills.filter(skill => skill.group === 'programming_language' || skill.group === 'tool');
  const areaMap = new Map<string, string>(); hard.forEach(skill => (skill.developmentAreas ?? []).forEach(item => { if (!areaMap.has(item.slug)) areaMap.set(item.slug, en ? item.en : item.es); }));
  const areas = Array.from(areaMap, ([slug, name]) => ({ slug, name })).sort((a,b) => a.name.localeCompare(b.name, locale));
  const visibleHard = hard.filter(skill => (!area || (skill.developmentAreas ?? []).some(item => item.slug === area)) && (!query.trim() || `${skill.name} ${skill.description || ''}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale))));
  return <main className={styles.page}><h1 className={`${gameFont.className} ${styles.title}`}>{`> ${t.skills}_`}</h1>{error && <p role="alert">{error}</p>}{loading && <p role="status">{t.loadingSkills}</p>}{!loading && !error && !skills.length && !learning.length && <p>{t.noSkills}</p>}
    {soft.length > 0 && <section className={styles.softSkills} aria-label={t.softSkills}>{soft.map(skill => <span key={skill.id}>{skill.name}</span>)}</section>}
    <div className={styles.filters}><label>{t.area}<select value={area} onChange={event => setArea(event.target.value)}><option value="">{t.allAreas}</option>{areas.map(item => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label><label>{t.searchTechnology}<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t.searchTechnologyPlaceholder}/></label></div>
    {!loading && !error && hard.length > 0 && visibleHard.length === 0 && <p role="status" className={styles.empty}>{t.noMatchingSkills}</p>}
    <div className={styles.technical}><SkillGroup title={t.programming} symbol="</>" items={visibleHard.filter(s => s.group === 'programming_language')} /><SkillGroup title={t.tools} symbol="⚒" wide items={visibleHard.filter(s => s.group === 'tool')} /></div>
    <div className={styles.secondary}><section className={styles.group}><header className={styles.groupHeader}><span className={styles.groupIcon} aria-hidden="true">◇</span><h2>{t.education}</h2></header>{learning.length ? learning.map(entry => <article key={entry.id} className={styles.learning}><h3>{entry.title}</h3><p>{entry.provider}</p>{entry.description && <p>{entry.description}</p>}{entry.completedOn && <time>{entry.completedOn}</time>}{entry.credentialUrl && /^https?:\/\//i.test(entry.credentialUrl) && <a href={entry.credentialUrl}>{t.credential} ↗</a>}</article>) : <p>{t.noEducation}</p>}</section><SkillGroup title={t.languages} symbol="◎" items={skills.filter(s => s.group === 'spoken_language')} /></div>
  </main>;
}
