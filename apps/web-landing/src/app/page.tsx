import { getTranslations } from "next-intl/server";

import { LanguageSwitcher } from "@/components/language-switcher";

export default async function Home() {
    const t = await getTranslations("HomePage");

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fafc,#e2e8f0_45%,#cbd5e1)] px-6 py-10 text-slate-950 sm:px-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-12">
                <header className="flex flex-col gap-6 rounded-4xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-300/30 backdrop-blur sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-3xl space-y-4">
                            <p className="text-xs font-semibold tracking-[0.3em] text-sky-700 uppercase">
                                {t("eyebrow")}
                            </p>
                            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                                {t("title")}
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                {t("description")}
                            </p>
                        </div>
                        <LanguageSwitcher></LanguageSwitcher>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                            href="https://nextjs.org/docs"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {t("primaryCta")}
                        </a>
                        <a
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            href="https://opennext.js.org/cloudflare"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {t("secondaryCta")}
                        </a>
                    </div>
                </header>

                <section className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-md shadow-slate-300/20 backdrop-blur">
                        <h2 className="text-lg font-semibold text-slate-950">
                            {t("featureOneTitle")}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("featureOneDescription")}
                        </p>
                    </article>
                    <article className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-md shadow-slate-300/20 backdrop-blur">
                        <h2 className="text-lg font-semibold text-slate-950">
                            {t("featureTwoTitle")}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("featureTwoDescription")}
                        </p>
                    </article>
                    <article className="rounded-[1.75rem] border border-white/70 bg-white/75 p-6 shadow-md shadow-slate-300/20 backdrop-blur">
                        <h2 className="text-lg font-semibold text-slate-950">
                            {t("featureThreeTitle")}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("featureThreeDescription")}
                        </p>
                    </article>
                </section>
            </div>
        </main>
    );
}
