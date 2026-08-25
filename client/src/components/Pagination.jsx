export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 3;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="rounded-lg px-2.5 py-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:bg-slate-800"
            >
                ‹
            </button>

            {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-slate-400">
            ...
          </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                                p === page
                                    ? "bg-brand-500 text-white"
                                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            }`}
                        >
                            {p}
                        </button>
                    ),
            )}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-lg px-2.5 py-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:bg-slate-800"
            >
                ›
            </button>
        </div>
    );
}