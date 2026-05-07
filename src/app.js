import { loadArtworks, saveArtworks, clearArtworks } from "./storage.js";
import { renderArtworks } from "./render.js";

const form = document.querySelector("#artwork-form");
const artworkList = document.querySelector("#artwork-list");
const recordCount = document.querySelector("#record-count");
const searchInput = document.querySelector("#search");
const clearRecordsButton = document.querySelector("#clear-records");
const imageInput = document.querySelector("#artworkImage");
const imagePreviewWrapper = document.querySelector("#image-preview-wrapper");
const imagePreview = document.querySelector("#image-preview");
const imageFileName = document.querySelector("#image-file-name");
const removeSelectedImageButton = document.querySelector("#remove-selected-image");

let artworks = loadArtworks();
let selectedImageData = "";
let selectedImageName = "";

renderArtworks(artworks, artworkList, recordCount);

function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            resolve(reader.result);
        });

        reader.addEventListener("error", () => {
            reject(reader.error);
        });

        reader.readAsDataURL(file);
    });
}

function clearSelectedImage() {
    selectedImageData = "";
    selectedImageName = "";
    imageInput.value = "";
    imagePreview.src = "";
    imageFileName.textContent = "";
    imagePreviewWrapper.classList.add("hidden");
}

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
        imageData: selectedImageData,
        imageName: selectedImageName,
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
            artwork.imageName,
            artwork.provenance
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedSearch);
    });
}

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];

    if (!file) {
        clearSelectedImage();
        return;
    }

    try {
        selectedImageData = await readImageAsDataUrl(file);
        selectedImageName = file.name;

        imagePreview.src = selectedImageData;
        imageFileName.textContent = file.name;
        imagePreviewWrapper.classList.remove("hidden");
    } catch (error) {
        console.error("Could not preview selected image.", error);
        alert("The selected image could not be previewed.");
        clearSelectedImage();
    }
});

removeSelectedImageButton.addEventListener("click", () => {
    clearSelectedImage();
});

form.addEventListener("reset", () => {
    setTimeout(clearSelectedImage, 0);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const artwork = getArtworkFromForm(form);

    artworks.unshift(artwork);
    saveArtworks(artworks);
    renderArtworks(filterArtworks(searchInput.value), artworkList, recordCount);

    form.reset();
    clearSelectedImage();
    form.querySelector("#title").focus();
});

searchInput.addEventListener("input", () => {
    const filteredArtworks = filterArtworks(searchInput.value);
    renderArtworks(filteredArtworks, artworkList, recordCount);
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
