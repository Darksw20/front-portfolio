import { useEffect, useState } from "react";
import Link from "next/link";
import { publicApi } from "@/lib/public-api";
import { gameFont } from "./fonts";

type Project = { slug: string; title: string; summary: string; startDate: string | null; tags: Array<{ slug: string; name: string }> };
type ProjectResponse = { items: Project[] };

export default function Work() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError("");
    publicApi<ProjectResponse>(`/v1/public/projects?query=${encodeURIComponent(query)}`)
      .then((response) => setProjects(response.items))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [query]);

  return <main className="flex flex-col m-10 gap-8"><div className={gameFont.className}><h1 className="text-6xl">{"> Proyectos"}</h1></div><label className="max-w-md">Buscar proyecto<input className="block border p-2 text-black" onChange={(event) => { setLoading(true); setQuery(event.target.value); }} value={query} /></label>{error ? <p role="alert">{error}</p> : null}{loading ? <p>Cargando proyectos…</p> : null}<div className="rows subtitles">{projects.map((project) => <article className="column web" key={project.slug}><div className="content"><h2>{project.title}</h2><p>{project.summary}</p><p>{project.tags.map((tag) => tag.name).join(" · ")}</p><Link href={`/work/${project.slug}`}>Ver proyecto</Link></div></article>)}</div></main>;
}
