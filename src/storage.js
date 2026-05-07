const STORAGE_KEY = "kenkeleba-artwork-records";

export function loadArtworks() {
    const savedRecords = localStorage.getItem(STORAGE_KEY);

    if (!savedRecords) {
        return [];
    }

    try {
        return JSON.parse(savedRecords);
    } catch (error) {
        console.error("Could not read saved artwork records.", error);
        return [];
    }
}

export function saveArtworks(artworks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
}

export function clearArtworks() {
    localStorage.removeItem(STORAGE_KEY);
}
