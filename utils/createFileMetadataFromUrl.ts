export type FileMetadata = {
    name: string
    size: number
    type: string
    url: string
    id: string
}

// Mapping des extensions vers les types MIME
const MIME_TYPES: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    'avif': 'image/avif',
    'heic': 'image/heic',
    'heif': 'image/heif',

    // Vidéos
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    'm4v': 'video/x-m4v',
    '3gp': 'video/3gpp',
    'ogv': 'video/ogg',

    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'flac': 'audio/flac',
    'aac': 'audio/aac',
    'ogg': 'audio/ogg',
    'wma': 'audio/x-ms-wma',
    'm4a': 'audio/x-m4a',

    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'rtf': 'application/rtf',
    'odt': 'application/vnd.oasis.opendocument.text',
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',
    'odp': 'application/vnd.oasis.opendocument.presentation',

    // Archives
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',

    // Code/Texte
    'html': 'text/html',
    'htm': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'csv': 'text/csv',
    'md': 'text/markdown',
    'yaml': 'text/yaml',
    'yml': 'text/yaml',

    // Autres
    'epub': 'application/epub+zip',
    'mobi': 'application/x-mobipocket-ebook'
}

/**
 * Génère un ID unique pour un fichier
 */
function generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extrait l'extension d'un fichier à partir de son nom
 */
function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1) return ''
    return filename.slice(lastDot + 1).toLowerCase()
}

/**
 * Extrait le nom du fichier à partir d'une URL
 */
function getFileName(url: string): string {
    try {
        const urlObj = new URL(url)
        const pathname = urlObj.pathname
        const filename = pathname.split('/').pop() || ''
        return decodeURIComponent(filename)
    } catch {
        const parts = url.split('/')
        return parts[parts.length - 1] || 'unknown'
    }
}

/**
 * Détermine le type MIME à partir de l'extension du fichier
 */
function getMimeTypeFromExtension(extension: string): string {
    return MIME_TYPES[extension.toLowerCase()] || 'application/octet-stream'
}

/**
 * Crée un objet File à partir d'une URL
 * @param url - L'URL du fichier à télécharger
 * @param options - Options pour la création du File
 * @returns Promise<File>
 */
export async function createFileFromUrl(
    url: string,
    options: {
        customName?: string
        customType?: string
    } = {}
): Promise<File> {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()

        // Déterminer le nom du fichier
        const fileName = options.customName || getFileName(url)

        // Déterminer le type MIME
        let mimeType = options.customType
        if (!mimeType) {
            // Essayer d'abord de récupérer depuis les headers de la réponse
            mimeType = response.headers.get('content-type')?.split(';')[0]

            // Sinon, déterminer depuis l'extension
            if (!mimeType) {
                const extension = getFileExtension(fileName)
                mimeType = getMimeTypeFromExtension(extension)
            }
        }

        // Créer l'objet File
        const file = new File([blob], fileName, {
            type: mimeType,
            lastModified: Date.now()
        })

        return file
    } catch (error) {
        throw new Error(`Impossible de créer le File depuis l'URL: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
}

/**
 * Crée un FileMetadata à partir d'un objet File
 * @param file - L'objet File
 * @param options - Options additionnelles
 * @returns FileMetadata
 */
export function createFileMetadataFromFile(
    file: File,
    options: {
        url?: string
        customId?: string
    } = {}
): FileMetadata {
    const { url = '', customId } = options

    return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: url,
        id: customId || generateFileId()
    }
}

/**
 * Crée un FileMetadata directement à partir d'une URL (via File)
 * @param url - L'URL du fichier
 * @param options - Options additionnelles
 * @returns Promise<FileMetadata>
 */
export async function createFileMetadataFromUrl(
    url: string,
    options: {
        customName?: string
        customType?: string
        customId?: string
    } = {}
): Promise<FileMetadata> {
    const { customId, ...fileOptions } = options

    const file = await createFileFromUrl(url, fileOptions)

    return createFileMetadataFromFile(file, {
        url: url,
        customId: customId
    })
}

/**
 * Version légère qui ne télécharge pas le fichier (pour économiser la bande passante)
 * @param url - L'URL du fichier
 * @param options - Options additionnelles
 * @returns Promise<FileMetadata>
 */
export async function createFileMetadataFromUrlLight(
    url: string,
    options: {
        customName?: string
        customId?: string
    } = {}
): Promise<FileMetadata> {
    const { customName, customId } = options

    try {
        // Requête HEAD pour récupérer les métadonnées sans télécharger le contenu
        const response = await fetch(url, { method: 'HEAD' })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const fileName = customName || getFileName(url)
        const contentLength = response.headers.get('content-length')
        const contentType = response.headers.get('content-type')?.split(';')[0]

        let mimeType = contentType
        if (!mimeType) {
            const extension = getFileExtension(fileName)
            mimeType = getMimeTypeFromExtension(extension)
        }

        return {
            name: fileName,
            size: contentLength ? parseInt(contentLength, 10) : 0,
            type: mimeType || 'application/octet-stream',
            url: url,
            id: customId || generateFileId()
        }
    } catch (error) {
        // Fallback en cas d'erreur
        const fileName = customName || getFileName(url)
        const extension = getFileExtension(fileName)

        return {
            name: fileName,
            size: 0,
            type: getMimeTypeFromExtension(extension),
            url: url,
            id: customId || generateFileId()
        }
    }
}

// Exemples d'utilisation
/*
// 1. Créer un File depuis une URL, puis un FileMetadata
const file = await createFileFromUrl('https://example.com/document.pdf')
const metadata = createFileMetadataFromFile(file, { url: 'https://example.com/document.pdf' })
 
// 2. Directement créer un FileMetadata depuis une URL (télécharge le fichier)
const metadata = await createFileMetadataFromUrl('https://example.com/image.jpg')
 
// 3. Version légère (requête HEAD seulement)
const metadata = await createFileMetadataFromUrlLight('https://example.com/video.mp4')
 
// 4. À partir d'un File existant (ex: depuis un input file)
const inputFile = document.querySelector('input[type="file"]').files[0]
const metadata = createFileMetadataFromFile(inputFile, { url: 'local-file' })
*/