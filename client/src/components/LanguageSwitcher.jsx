import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const next = i18n.language === "fa" ? "en" : "fa";
        i18n.changeLanguage(next);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
        >
            {i18n.language === "fa" ? "English" : "فارسی"}
        </button>
    );
}