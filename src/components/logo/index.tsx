import { portfolioAssets } from "@/lib/portfolio-assets";
/* The original bitmap remains intact. A small vector extension completes its clipped tail. */
export default function Logo({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 1776 2639" width="1776" height="2639" aria-hidden="true" focusable="false">
    <image href={portfolioAssets.logo} x="0" y="0" width="1776" height="2639" />
    <path fill="#fff" d="M803 2450 L885 2450 C887 2480 890 2521 899 2567 C877 2543 834 2496 803 2450 Z" />
  </svg>
}
