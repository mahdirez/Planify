import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdCheckBoxOutlineBlank, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function RegisterPage({ auth }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!email.trim() || !password.trim()) {
            setLocalError(t("auth.validationError"));
            return;
        }

        const result = await auth.register(email.trim(), password);
        if (result.success) {
            navigate("/app");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
            <div className="w-full max-w-sm">
                <div className="mb-4 flex justify-end">
                    <LanguageSwitcher />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white">
                            <MdCheckBoxOutlineBlank size={14} />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
              Planify
            </span>
                    </div>

                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {t("auth.createAccount")}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {t("auth.registerSubtitle")}
                    </p>

                    {(auth.error || localError) && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                            {auth.error || localError}
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <label className="block">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t("auth.email")}
              </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("auth.emailPlaceholder")}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </label>

                        <label className="block">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t("auth.password")}
              </span>
                            <div className="relative mt-1.5">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t("auth.strongPasswordPlaceholder")}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pe-10 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <MdOutlineVisibilityOff size={18} />
                                    ) : (
                                        <MdOutlineVisibility size={18} />
                                    )}
                                </button>
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={auth.loading}
                            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {auth.loading ? t("auth.creatingAccount") : t("auth.registerButton")}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        {t("auth.haveAccount")}{" "}
                        <Link
                            to="/login"
                            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            {t("auth.signInLink")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}