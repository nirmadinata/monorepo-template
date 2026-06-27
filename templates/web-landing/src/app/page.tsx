import { getTranslations } from "next-intl/server";

export default async function Home() {
    const t = await getTranslations("HomePage");

    return (
        <div className="pb-16 sm:pb-20">
            <section
                className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:px-8 lg:pt-20 lg:pb-24"
                id="overview"
            >
                <div className="flex max-w-3xl flex-col justify-center space-y-8">
                    <div className="space-y-5">
                        <p className="text-xs font-semibold tracking-[0.32em] text-sky-700 uppercase">
                            {t("eyebrow")}
                        </p>
                        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            {t("title")}
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            {t("description")}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                            href="#contact"
                        >
                            {t("primaryCta")}
                        </a>
                        <a
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            href="#services"
                        >
                            {t("secondaryCta")}
                        </a>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70">
                            <dt className="text-sm font-medium text-slate-500">
                                {t("statOneLabel")}
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {t("statOneValue")}
                            </dd>
                        </div>
                        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70">
                            <dt className="text-sm font-medium text-slate-500">
                                {t("statTwoLabel")}
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {t("statTwoValue")}
                            </dd>
                        </div>
                        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/70">
                            <dt className="text-sm font-medium text-slate-500">
                                {t("statThreeLabel")}
                            </dt>
                            <dd className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {t("statThreeValue")}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="flex items-stretch">
                    <div className="w-full rounded-4xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)] sm:p-8">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    {t("cardTitle")}
                                </p>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                                    {t("cardDescription")}
                                </p>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
                                {t("cardBadge")}
                            </span>
                        </div>

                        <div className="space-y-4 py-6">
                            <div className="rounded-3xl bg-slate-950 p-5 text-white">
                                <p className="text-xs font-semibold tracking-[0.24em] text-sky-200 uppercase">
                                    {t("highlightEyebrow")}
                                </p>
                                <p className="mt-3 text-2xl font-semibold tracking-tight">
                                    {t("highlightTitle")}
                                </p>
                                <p className="mt-3 text-sm leading-6 text-slate-300">
                                    {t("highlightDescription")}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm font-semibold text-slate-950">
                                        {t("featureOneTitle")}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {t("featureOneDescription")}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm font-semibold text-slate-950">
                                        {t("featureTwoTitle")}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {t("featureTwoDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    {t("proofTitle")}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t("proofDescription")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    {t("featureThreeTitle")}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t("featureThreeDescription")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="services">
                <div className="max-w-2xl space-y-3">
                    <p className="text-xs font-semibold tracking-[0.3em] text-sky-700 uppercase">
                        {t("servicesEyebrow")}
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                        {t("servicesTitle")}
                    </h2>
                    <p className="text-base leading-7 text-slate-600">{t("servicesDescription")}</p>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-3">
                    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/70">
                        <p className="text-sm font-semibold text-slate-950">
                            {t("serviceOneTitle")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("serviceOneDescription")}
                        </p>
                    </article>
                    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/70">
                        <p className="text-sm font-semibold text-slate-950">
                            {t("serviceTwoTitle")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("serviceTwoDescription")}
                        </p>
                    </article>
                    <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-200/70">
                        <p className="text-sm font-semibold text-slate-950">
                            {t("serviceThreeTitle")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {t("serviceThreeDescription")}
                        </p>
                    </article>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="process">
                <div className="rounded-4xl border border-slate-200/80 bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
                    <div className="max-w-2xl space-y-3">
                        <p className="text-xs font-semibold tracking-[0.3em] text-sky-200 uppercase">
                            {t("processEyebrow")}
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            {t("processTitle")}
                        </h2>
                        <p className="text-base leading-7 text-slate-300">
                            {t("processDescription")}
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 lg:grid-cols-3">
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold tracking-[0.24em] text-sky-200 uppercase">
                                01
                            </p>
                            <h3 className="mt-4 text-lg font-semibold">{t("processOneTitle")}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {t("processOneDescription")}
                            </p>
                        </article>
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold tracking-[0.24em] text-sky-200 uppercase">
                                02
                            </p>
                            <h3 className="mt-4 text-lg font-semibold">{t("processTwoTitle")}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {t("processTwoDescription")}
                            </p>
                        </article>
                        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <p className="text-xs font-semibold tracking-[0.24em] text-sky-200 uppercase">
                                03
                            </p>
                            <h3 className="mt-4 text-lg font-semibold">{t("processThreeTitle")}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {t("processThreeDescription")}
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="results">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold tracking-[0.3em] text-sky-700 uppercase">
                            {t("resultsEyebrow")}
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                            {t("resultsTitle")}
                        </h2>
                        <p className="text-base leading-7 text-slate-600">
                            {t("resultsDescription")}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/70">
                            <p className="text-sm font-medium text-slate-500">
                                {t("resultOneLabel")}
                            </p>
                            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                                {t("resultOneValue")}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {t("resultOneDescription")}
                            </p>
                        </div>
                        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/70">
                            <p className="text-sm font-medium text-slate-500">
                                {t("resultTwoLabel")}
                            </p>
                            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                                {t("resultTwoValue")}
                            </p>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {t("resultTwoDescription")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="contact">
                <div className="rounded-4xl border border-sky-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <div className="max-w-2xl space-y-3">
                            <p className="text-xs font-semibold tracking-[0.3em] text-sky-700 uppercase">
                                {t("contactEyebrow")}
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                                {t("contactTitle")}
                            </h2>
                            <p className="text-base leading-7 text-slate-600">
                                {t("contactDescription")}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <a
                                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                                href="mailto:hello@example.com"
                            >
                                {t("contactPrimaryCta")}
                            </a>
                            <a
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                href="https://opennext.js.org/cloudflare"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {t("contactSecondaryCta")}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
