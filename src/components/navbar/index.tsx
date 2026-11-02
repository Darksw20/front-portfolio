import Link from "next/link";
import Logo from "@/components/logo";
import { useRouter } from "next/router";
import { Person, Settings, Work, Phone, Login, GitHub, LinkedIn, OpenInNew, MoreHoriz, Close, BusinessCenter, Language, Check } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { publicApi } from "@/lib/public-api";
import { useI18n, type Locale } from "@/lib/i18n";
import styles from "./navbar.module.css";
type Profile = { socialLinks: Array<{ platform: string; url: string }> };
export default function Navbar() {
  const {locale,t}=useI18n();const [links,setLinks]=useState<Profile["socialLinks"]>([]),[expanded,setExpanded]=useState(false),[languageError,setLanguageError]=useState(''),[languageOpen,setLanguageOpen]=useState(false),[menuPosition,setMenuPosition]=useState({left:0,top:0});const router=useRouter();
  const languageButton=useRef<HTMLButtonElement>(null),languageMenu=useRef<HTMLDivElement>(null);
  useEffect(()=>{let active=true;publicApi<Profile>("/v1/public/profile",locale).then(profile=>{if(active)setLinks(profile.socialLinks)}).catch(()=>{if(active)setLinks([])});return()=>{active=false}},[locale]);
  useEffect(()=>{setExpanded(false);setLanguageOpen(false)},[router.asPath,locale]);
  useEffect(()=>{if(!languageOpen)return;const dismiss=(event:MouseEvent)=>{if(!languageButton.current?.contains(event.target as Node)&&!languageMenu.current?.contains(event.target as Node))setLanguageOpen(false)};const resize=()=>setLanguageOpen(false);document.addEventListener('mousedown',dismiss);window.addEventListener('resize',resize);return()=>{document.removeEventListener('mousedown',dismiss);window.removeEventListener('resize',resize)}},[languageOpen]);
  useEffect(()=>{if(languageOpen)languageMenu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus()},[languageOpen]);
  const adminUrl=process.env.NEXT_PUBLIC_ADMIN_URL;
  const pages=[{href:'/about',label:t.about,Icon:Person},{href:'/skills',label:t.skills,Icon:Settings},{href:'/work',label:t.projects,Icon:Work},{href:'/experience',label:t.experience,Icon:BusinessCenter}];
  const navLink=(href:string,label:string,icon:React.ReactNode)=><Link key={href} href={href} className={styles.navLink} aria-label={label} aria-current={(href==='/'?router.pathname==='/':router.pathname.startsWith(href))?'page':undefined}>{icon}<span>{label}</span></Link>;
  async function changeLanguage(next:Locale) {
    if(next===locale)return;setLanguageError('');let path=router.asPath;
    if(router.pathname==='/work/[slug]'&&typeof router.query.slug==='string') {
      try {const project=await publicApi<{localizedSlugs:Record<string,string>}>(`/v1/public/projects/${encodeURIComponent(router.query.slug)}`,locale);const slug=project.localizedSlugs[next];if(!slug)throw new Error('Missing translation');path=`/work/${encodeURIComponent(slug)}`}
      catch {setLanguageError(locale==='en-US'?'Could not switch language for this project.':'No se pudo cambiar el idioma de este proyecto.');return}
    }
    document.cookie=`NEXT_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
    await router.push(path,path,{locale:next});
  }
  function toggleLanguage() {
    if(languageOpen){setLanguageOpen(false);return}
    const rect=languageButton.current?.getBoundingClientRect();if(!rect)return;
    const width=208,height=104,mobile=window.innerWidth<=640;
    setMenuPosition({left:mobile?Math.max(8,Math.min(window.innerWidth-width-8,rect.right-width)):Math.min(window.innerWidth-width-8,rect.right+8),top:Math.max(8,Math.min(window.innerHeight-height-8,mobile?rect.top-height-8:rect.bottom-height))});
    setLanguageOpen(true);
  }
  function languageKeys(event:React.KeyboardEvent<HTMLDivElement>) {
    if(event.key==='Escape'){event.preventDefault();setLanguageOpen(false);languageButton.current?.focus();return}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'||event.key==='Home'||event.key==='End'){
      event.preventDefault();const options=Array.from(languageMenu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')??[]);const index=options.indexOf(document.activeElement as HTMLButtonElement);
      const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next]?.focus();
    }
  }
  return <aside className={styles.sidebar}><nav aria-label={t.navigation} className={styles.navigation}>
    <div className={styles.homeGroup}>{navLink('/',t.home,<Logo className={styles.brandMark} />)}</div>
    <div className={styles.mainGroup}>{pages.map(({href,label,Icon})=>navLink(href,label,<Icon />))}</div>
    <div id="social-navigation" className={`${styles.extras} ${expanded?styles.extrasOpen:''}`}>
      {navLink('/contact',t.contact,<Phone />)}
      {links.filter(link=>/^https?:\/\//i.test(link.url)).map(link=><a key={link.platform} href={link.url} className={styles.extraLink} aria-label={link.platform} target="_blank" rel="noopener noreferrer">{link.platform.toLowerCase()==='github'?<GitHub />:link.platform.toLowerCase()==='linkedin'?<LinkedIn />:<OpenInNew />}<span>{link.platform}</span></a>)}
      {adminUrl&&<a href={adminUrl} className={styles.extraLink} aria-label={t.admin}><Login /><span>{t.admin}</span></a>}
      <button ref={languageButton} type="button" className={styles.language} aria-label={t.language} aria-haspopup="menu" aria-expanded={languageOpen} aria-controls={languageOpen?'language-menu':undefined} onClick={toggleLanguage}><Language aria-hidden="true"/><span className={styles.languageLabel}>{t.language}</span><span className={styles.languageCode}>{locale==='es-MX'?'ES':'EN'}</span></button>
      {languageError&&<span role="alert" className={styles.languageError}>{languageError}</span>}
    </div>
    <button type="button" aria-label={expanded?t.closeMenu:t.moreLinks} aria-expanded={expanded} aria-controls="social-navigation" className={`${styles.navLink} ${styles.more}`} onClick={()=>{setLanguageOpen(false);setExpanded(!expanded)}}>{expanded?<Close />:<MoreHoriz />}<span>{t.more}</span></button>
  </nav>{languageOpen&&typeof document!=='undefined'&&createPortal(<div id="language-menu" ref={languageMenu} role="menu" aria-label={t.language} className={styles.languageMenu} style={{left:menuPosition.left,top:menuPosition.top}} onKeyDown={languageKeys} onBlur={event=>{const target=event.relatedTarget as Node|null;if(!languageMenu.current?.contains(target)&&!languageButton.current?.contains(target))setLanguageOpen(false)}}>{([['es-MX','Español','MX'],['en-US','English','US']] as const).map(([code,name,region])=><button key={code} type="button" role="menuitemradio" aria-checked={locale===code} onClick={()=>{setLanguageOpen(false);void changeLanguage(code);languageButton.current?.focus()}}><span>{name}<small>{region}</small></span>{locale===code&&<Check aria-hidden="true"/>}</button>)}</div>,document.body)}</aside>;
}
