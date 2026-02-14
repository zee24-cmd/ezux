export const HighlightText = ({ text, highlight }: { text: string | number | unknown, highlight?: string }) => {
    const strText = String(text ?? '');
    if (!highlight || !strText) return <>{strText}</>;

    // Escape special regex chars
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = strText.split(new RegExp(`(${escapedHighlight})`, 'gi'));

    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase()
                    ? <mark key={i} className="bg-[#ccff00] dark:bg-[#d4ff33] text-black rounded-sm px-0.5 font-bold shadow-[0_0_8px_rgba(204,255,0,0.5)] dark:shadow-[0_0_12px_rgba(212,255,51,0.4)] transition-all animate-in fade-in zoom-in duration-300 inline-block">{part}</mark>
                    : part
            )}
        </>
    );
};
