/**
 * Extrait l'ID YouTube d'une URL YouTube complète
 */
export function extractYoutubeId(url: string): string {
    if (!url) return '';

    // Pattern pour extraire l'ID YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? match[2]
        : url;
}