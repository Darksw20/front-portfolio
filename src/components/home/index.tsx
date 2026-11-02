import { useI18n } from '@/lib/i18n';
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import Link from "next/link";
import localFont from "next/font/local";
import { publicApi } from "@/lib/public-api";
import styles from "./home.module.css";
const gameFont = localFont({ src: "../../../public/fonts/upheavtt.ttf" });
type Profile = { displayName: string; headline: string };
export default function Home() {
  const {locale,t}=useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { let active=true; setProfile(null); publicApi<Profile>("/v1/public/profile",locale).then(value => { if(active)setProfile(value) }).catch(() => { if(active)setProfile(null) }); return () => { active=false }; }, [locale]);
  return <main className={styles.home}>
    <div className={styles.content}><p className={styles.eyebrow}>{t.welcome}</p><h1 className={`${gameFont.className} ${styles.title}`}>{profile ? `> ${profile.displayName}_` : `> ${t.portfolio}_`}</h1>{profile && <p className={styles.headline}>{profile.headline}</p>}<Link className={styles.contact} href="/contact">{t.contact} <span aria-hidden="true">↗</span></Link></div>
    <div className={styles.mark} aria-label={t.mark} role="img"><div className={styles.halo} aria-hidden="true"/><div className={styles.orbit} aria-hidden="true"><span /></div><Logo className={styles.logo} /></div>
  </main>;
}
