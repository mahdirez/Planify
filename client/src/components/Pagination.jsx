export default function Pagination({
                                       page,
                                       totalPages,
                                       onPageChange,
                                       previousLabel = "Previous",
                                       nextLabel = "Next",
                                       pageLabel,
                                   }) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {previousLabel}
            </button>
            <span className="text-sm text-slate-400">
        {pageLabel || `Page ${page} of ${totalPages}`}
      </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {nextLabel}
            </button>
        </div>
    );
}