/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	distDir: process.env.PORTFOLIO_NEXT_DIST_DIR || ".next",
	i18n: { locales: ["en-US", "es-MX"], defaultLocale: "en-US", localeDetection: false },
	async redirects() { return [{ source: "/darksw20/work", destination: "/work", permanent: false }]; },
};

module.exports = nextConfig;
