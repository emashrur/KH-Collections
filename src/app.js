import { loadArtworks, saveArtworks } from "./storage.js";

const form = document.querySelector("#artwork-form");
const imageInput = document.querySelector("#artworkImage");
const imagePreviewWrapper = document.querySelector("#image-preview-wrapper");
const imagePreview = document.querySelector("#image-preview");
const imageFileName = document.querySelector("#image-file-name");
const removeSelectedImageButton = document.querySelector("#remove-selected-image");
const saveMessage = document.querySelector("#save-message");

let selectedImagePreview = "";
let selectedImageName = "";

function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", () => reject(reader.error));

        reader.readAsDataURL(file);
    });
}

function clearSelectedImage() {
    selectedImagePreview = "";
    selectedImageName = "";
    imageInput.value = "";
    imagePreview.src = "";
    imageFileName.textContent = "";
    imagePreviewWrapper.classList.add("hidden");
}

function showSaveMessage(message) {
    saveMessage.textContent = message;

    setTimeout(() => {
        saveMessage.textContent = "";
    }, 3500);
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
        imageName: selectedImageName,
        imagePreview: selectedImagePreview,
        provenance: formData.get("provenance").trim(),
        createdAt: new Date().toISOString()
    };
}

imageInput.addEventListener("change", async () => {
    const file = imageInput.files[0];

    if (!file) {
        clearSelectedImage();
        return;
    }

    selectedImageName = file.name;

    try {
        selectedImagePreview = await readImageAsDataUrl(file);
        imagePreview.src = selectedImagePreview;
        imageFileName.textContent = file.name;
        imagePreviewWrapper.classList.remove("hidden");
    } catch (error) {
        console.error("Could not preview selected image.", error);
        selectedImagePreview = "";
        imageFileName.textContent = `${file.name} selected. Preview unavailable.`;
        imagePreviewWrapper.classList.remove("hidden");
    }
});

removeSelectedImageButton.addEventListener("click", clearSelectedImage);

form.addEventListener("reset", () => {
    setTimeout(clearSelectedImage, 0);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const artworks = loadArtworks();
    const artwork = getArtworkFromForm(form);

    artworks.unshift(artwork);
    saveArtworks(artworks);

    form.reset();
    clearSelectedImage();
    form.querySelector("#title").focus();

    showSaveMessage("Record added. You can view it on the Collection Records page.");
});
