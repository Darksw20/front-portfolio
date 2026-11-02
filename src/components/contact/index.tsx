import { useI18n } from '@/lib/i18n';
import { useState } from "react";
import localFont from "next/font/local";
import styles from "./contact.module.css";

export const gameFont = localFont({ src: "../../../public/fonts/upheavtt.ttf" });
export const futuraFont = localFont({ src: "../../../public/fonts/futura medium bt.ttf" });

export default function Contact() {
  const {t}=useI18n();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "limited">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
    if (!backend) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const response = await fetch(`${backend}/v1/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (response.status === 429) { setStatus("limited"); return; }
      if (!response.ok) throw new Error("Contact submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <main className={styles.page}><h1 className={`${gameFont.className} ${styles.title}`}>{`> ${t.contactTitle}_`}</h1><div className={styles.layout}><section><p className={styles.intro}>{t.contactIntro}</p><form className={styles.form} onSubmit={handleSubmit}>
    <label>{t.name}<input name="name" type="text" required maxLength={160} autoComplete="name" /></label>
    <label>{t.email}<input name="email" type="email" required maxLength={320} autoComplete="email" /></label>
    <label className={styles.full}>{t.subject}<input name="subject" type="text" maxLength={255} /></label>
    <label className={styles.full}>{t.message}<textarea name="message" required minLength={10} maxLength={10000} rows={7} /></label>
    <div className={styles.honeypot} aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? t.sending : t.send}</button>
    <p className={styles.full} role="status" aria-live="polite">{status === "success" && t.sent}{status === "error" && t.sendError}{status === "limited" && t.limited}</p>
  </form></section><aside className={styles.location}><span>GUADALAJARA</span><strong>{t.location}</strong></aside></div></main>;
}
