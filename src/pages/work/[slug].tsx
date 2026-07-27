/* eslint-disable @next/next/no-img-element -- media URLs are managed dynamically in Vercel Blob. */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { publicApi } from "@/lib/public-api";

type Detail = {
  title: string;
  summary: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  tags: Array<{ slug: string; name: string }>;
  roles: Array<{ slug: string; name: string }>;
  media: Array<{ url: string; altText: string; isPrimary: boolean; displayOrder: number }>;
};

export default function ProjectDetailPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const [project, setProject] = useState<Detail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    publicApi<Detail>(`/v1/public/projects/${encodeURIComponent(slug)}`)
      .then(setProject)
      .catch((requestError: Error) => setError(requestError.message));
  }, [slug]);

  if (error) return <main className="m-10"><p role="alert">{error}</p><Link href="/work">Volver a proyectos</Link></main>;
  if (!project) return <main className="m-10">Cargando proyecto…</main>;
  return <main className="m-10 max-w-5xl"><Link href="/work">← Volver a proyectos</Link><h1 className="mt-8 text-5xl">{project.title}</h1><p className="mt-4 text-xl">{project.summary}</p><p className="mt-6 whitespace-pre-wrap">{project.description}</p><dl className="mt-6"><dt>Etiquetas</dt><dd>{project.tags.map((tag) => tag.name).join(" · ") || "Sin etiquetas"}</dd><dt className="mt-3">Participación</dt><dd>{project.roles.map((role) => role.name).join(" · ") || "Sin roles registrados"}</dd></dl>{project.media.length ? <section className="mt-8"><h2 className="text-3xl">Galería</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{project.media.map((media) => <img alt={media.altText || project.title} className="w-full" key={`${media.url}-${media.displayOrder}`} src={media.url} />)}</div></section> : null}</main>;
}
