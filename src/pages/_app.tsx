import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type Meta = { title:string; description:string }
const pages: Record<string, {es:Meta;en:Meta}> = {
  '/': {es:{title:'Ricardo Navarro | Desarrollo de software y DevOps',description:'Portafolio de Ricardo Navarro: desarrollo de software, DevOps, proyectos y trayectoria profesional.'},en:{title:'Ricardo Navarro | Software development and DevOps',description:'Ricardo Navarro’s portfolio: software development, DevOps, projects, and professional experience.'}},
  '/about': {es:{title:'Acerca de | Ricardo Navarro',description:'Conoce a Ricardo Navarro, su trayectoria profesional y los proyectos en los que ha participado.'},en:{title:'About | Ricardo Navarro',description:'Learn about Ricardo Navarro, his professional experience, and his projects.'}},
  '/skills': {es:{title:'Habilidades | Ricardo Navarro',description:'Habilidades de desarrollo, DevOps, tecnología y formación de Ricardo Navarro.'},en:{title:'Skills | Ricardo Navarro',description:'Ricardo Navarro’s development, DevOps, technology skills, and education.'}},
  '/work': {es:{title:'Proyectos | Ricardo Navarro',description:'Explora proyectos de software y soluciones desarrolladas por Ricardo Navarro.'},en:{title:'Projects | Ricardo Navarro',description:'Explore software projects and solutions developed by Ricardo Navarro.'}},
  '/work/[slug]': {es:{title:'Proyecto | Ricardo Navarro',description:'Detalles de un proyecto de software del portafolio de Ricardo Navarro.'},en:{title:'Project | Ricardo Navarro',description:'Details of a software project from Ricardo Navarro’s portfolio.'}},
  '/experience': {es:{title:'Experiencia laboral | Ricardo Navarro',description:'Trayectoria y experiencia profesional de Ricardo Navarro en desarrollo de software y DevOps.'},en:{title:'Work experience | Ricardo Navarro',description:'Ricardo Navarro’s professional career in software development and DevOps.'}},
  '/experience/[slug]': {es:{title:'Experiencia laboral | Ricardo Navarro',description:'Detalles de la trayectoria profesional de Ricardo Navarro.'},en:{title:'Work experience | Ricardo Navarro',description:'Details of Ricardo Navarro’s professional career.'}},
  '/contact': {es:{title:'Contacto | Ricardo Navarro',description:'Ponte en contacto con Ricardo Navarro para conversar sobre desarrollo de software y tecnología.'},en:{title:'Contact | Ricardo Navarro',description:'Get in touch with Ricardo Navarro about software development and technology.'}},
}
export default function App({ Component, pageProps }: AppProps) {
  const router=useRouter(),locale=router.locale==='es-MX'?'es-MX':'en-US',page=pages[router.pathname]?.[locale==='en-US'?'en':'es'];
  useEffect(()=>{document.documentElement.lang=locale},[locale]);
  const path=router.asPath.split(/[?#]/)[0],hasPath=!path.includes('[')&&!path.includes(']');
  const localizedPath=(language:string)=>`${language==='es-MX'?'/es-MX':''}${path==='/'?'':path}`||'/';
  const canonical=hasPath?`https://ricardonavarro.mx${localizedPath(locale)}`:null;
  // Project slugs may differ by language. Detail alternates require server-side lookup.
  const hasAlternates=hasPath&&!router.pathname.includes('[');
  return <>{page&&<Head><title>{page.title}</title><meta name="description" content={page.description}/>{canonical&&<link rel="canonical" href={canonical}/>}<meta property="og:type" content="website"/><meta property="og:title" content={page.title}/><meta property="og:description" content={page.description}/>{canonical&&<meta property="og:url" content={canonical}/>}<meta name="twitter:card" content="summary"/>{hasAlternates&&<><link rel="alternate" hrefLang="es-MX" href={`https://ricardonavarro.mx${localizedPath('es-MX')}`}/><link rel="alternate" hrefLang="en-US" href={`https://ricardonavarro.mx${localizedPath('en-US')}`}/><link rel="alternate" hrefLang="x-default" href={`https://ricardonavarro.mx${localizedPath('en-US')}`}/></>}</Head>}<Component {...pageProps}/></>
}
