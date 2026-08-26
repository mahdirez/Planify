import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage, MdKeyboardArrowDown } from "react-icons/md";

const LANGUAGES = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fa", label: "فارسی", flag: "🇮🇷" },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current =
        LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectLanguage = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
                <MdLanguage size={16} />
                <span>{current.code.toUpperCase()}</span>
                <MdKeyboardArrowDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute bottom-full start-0 z-30 mb-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code)}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition ${
                                lang.code === i18n.language
                                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                        >
                            <span>{lang.flag}</span>
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}