import { baseURL } from "@/config";

/**
 * Ajoute une URL de base à un lien.
 *
 * @param {string} baseUrl L'URL de base (par exemple, "https://www.exemple.com/").
 * @param {string} link Le lien à compléter (par exemple, "/page.html" ou "https://www.autreexemple.com/").
 * @returns {string} Le lien complet.
 */
export function getFullUrlFile(link: string, baseUrl: string = baseURL) {
    try {
        const absoluteUrl = new URL(link, baseUrl.replace("/api/v1", ""));
        return absoluteUrl.href;
    } catch (e) {
        console.error("Erreur lors de la création de l'URL : ", e);
        return link;
    }
}
