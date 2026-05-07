import { loadArtworks, saveArtworks, clearArtworks } from "./storage.js";
import { renderArtworks } from "./render.js";

const artworkList = document.querySelector("#artwork-list");
const recordCount = document.querySelector("#record-count");
const searchInput = document.querySelector("#search");
const clearRecordsButton = document.querySelector("#clear-records");

let artworks = loadArtworks();

renderArtworks(artworks, artworkList, recordCount);

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
            artwork.imageName,
            artwork.provenance
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedSearch);
    });
}

searchInput.addEventListener("input", () => {
    renderArtworks(filterArtworks(searchInput.value), artworkList, recordCount);
});

artworkList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-record-button")) {
        return;
    }

    const artworkId = event.target.dataset.id;

    artworks = artworks.filter((artwork) => artwork.id !== artworkId);
    saveArtworks(artworks);

    renderArtworks(filterArtworks(searchInput.value), artworkList, recordCount);
});

clearRecordsButton.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to clear all saved artwork records from this browser?");

    if (!confirmed) {
        return;
    }

    artworks = [];
    clearArtworks();
    searchInput.value = "";
    renderArtworks(artworks, artworkList, recordCount);
});
