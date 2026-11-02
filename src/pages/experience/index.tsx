import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { gameFont } from '@/components/work/fonts';
import { publicApi } from '@/lib/public-api';
import styles from '@/components/work/work.module.css';
import timeline from './timeline.module.css';
type Entry = { slug:string; company:string; logoUrl:string|null; title:string; summary:string; startMonth:string|null; endMonth:string|null; isCurrent:boolean };
export default function ExperienceList() {
 const {locale,t}=useI18n();
 const [items,setItems]=useState<Entry[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;setLoading(true);setError('');setItems([]);publicApi<{items:Entry[]}>('/v1/public/experiences',locale).then(data=>{if(active)setItems(data.items)}).catch(()=>{if(active)setError(t.loadCareerError)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[locale,t]);
 return <div className="flex flex-row"><Navbar/><main className={styles.page}><header className={styles.header}><div><p className={styles.eyebrow}>{t.experienceEyebrow}</p><h1 className={`${gameFont.className} ${styles.title}`}>{`> ${t.experience}_`}</h1><p className={styles.intro}>{t.experienceIntro}</p></div></header>{loading&&<p role="status">{t.loading}</p>}{error&&<p role="alert">{error}</p>}{!loading&&!error&&!items.length&&<p>{t.noExperience}</p>}
 <ol className={timeline.timeline}>{items.map((item,index)=><li className={timeline.entry} key={item.slug}><span className={timeline.marker} aria-hidden="true"/><Link href={`/experience/${item.slug}`} className={timeline.card}><div className={timeline.logo}>{item.logoUrl ? <img src={item.logoUrl} alt="" /> : <span aria-hidden="true">{item.company.slice(0,2).toUpperCase()}</span>}</div><div className={timeline.content}><p className={timeline.date}>{item.startMonth || t.noDate} — {item.isCurrent ? t.current : item.endMonth || t.noEnd}</p><p className={timeline.company}>{item.company}</p><h2>{item.title}</h2><p className={timeline.summary}>{item.summary}</p><span className={timeline.more}>{t.exploreExperience} ↗</span></div><span className={timeline.number} aria-hidden="true">{String(index+1).padStart(2,'0')}</span></Link></li>)}</ol></main></div>
}
