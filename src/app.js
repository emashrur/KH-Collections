import { loadArtworks, saveArtworks, clearArtworks } from "./storage.js";
import { renderArtworks } from "./render.js";

const form = document.querySelector("#artwork-form");
const artworkList = document.querySelector("#artwork-list");
const recordCount = document.querySelector("#record-count");
const searchInput = document.querySelector("#search");
const clearRecordsButton = document.querySelector("#clear-records");

let artworks = loadArtworks();

renderArtworks(artworks, artworkList, recordCount);

function getArtworkFromForm(formElement) {
    const formData = new FormData(formElement);

    return {
        id: crypto.randomUUID(),
        title: formData.get("title").trim(),
        artist: formData.get("artist").trim(),
        date: formData.get("date").trim(),
        medium: formData.get("medium").trim(),
        accessionNumber: formData.get("accessionNumber").trim(),
        height: formData.get("height").trim(),
        width: formData.get("width").trim(),
        depth: formData.get("depth").trim(),
        imageUrl: formData.get("imageUrl").trim(),
        provenance: formData.get("provenance").trim(),
        createdAt: new Date().toISOString()
    };
}

function filterArtworks(searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (!normalizedSearch) {
        return artworks;
    }

    return artworks.filter((artwork) => {
        const searchableText = [
            artwork.title,
            artwork.artist,
            artwork.date,
            artwork.medium,
            artwork.accessionNumber,
            artwork.provenance
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedSearch);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const artwork = getArtworkFromForm(form);

    artworks.unshift(artwork);
    saveArtworks(artworks);
    renderArtworks(artworks, artworkList, recordCount);

    form.reset();
    form.querySelector("#title").focus();
});

searchInput.addEventListener("input", () => {
    const filteredArtworks = filterArtworks(searchInput.value);
    renderArtworks(filteredArtworks, artworkList, recordCount);
});

clearRecordsButton.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to clear all saved artwork records from this browser?");

    if (!confirmed) {
        return;
    }

    artworks = [];
    clearArtworks();
    renderArtworks(artworks, artworkList, recordCount);
    searchInput.value = "";
});
