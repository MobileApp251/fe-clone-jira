export function formatDate(
    isoString: string,
    locale: string = "vi-VN"
): string {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
