function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getDimensions(artwork) {
    const dimensions = [artwork.height, artwork.width, artwork.depth].filter(Boolean);

    if (dimensions.length === 0) {
        return "Not recorded";
    }

    return dimensions.join(" × ");
}

function getThumbnailMarkup(artwork) {
    if (!artwork.imageData) {
        return `<div class="thumbnail-placeholder">No image selected</div>`;
    }

    return `
        <img 
            class="thumbnail" 
            src="${artwork.imageData}" 
            alt="Thumbnail preview for ${escapeHtml(artwork.title)}"
        >
    `;
}

function createArtworkCard(artwork) {
    const card = document.createElement("article");
    card.className = "artwork-card";

    card.innerHTML = `
        <div class="card-image">
            ${getThumbnailMarkup(artwork)}
        </div>

        <div class="card-content">
            <h3>${escapeHtml(artwork.title)}</h3>
            <p><strong>Artist:</strong> ${escapeHtml(artwork.artist)}</p>

            <div class="card-meta">
                <p><strong>Date:</strong> ${escapeHtml(artwork.date) || "Not recorded"}</p>
                <p><strong>Medium:</strong> ${escapeHtml(artwork.medium) || "Not recorded"}</p>
                <p><strong>Accession #:</strong> ${escapeHtml(artwork.accessionNumber) || "Not assigned"}</p>
                <p><strong>Dimensions:</strong> ${escapeHtml(getDimensions(artwork))}</p>
            </div>

            ${artwork.imageName ? `<p><strong>Image File:</strong> ${escapeHtml(artwork.imageName)}</p>` : ""}

            ${artwork.provenance ? `
                <p class="card-notes"><strong>Provenance / Notes:</strong><br>${escapeHtml(artwork.provenance)}</p>
            ` : ""}

            <div class="card-actions">
                <button class="delete-record-button" type="button" data-id="${artwork.id}">
                    Remove Record
                </button>
            </div>
        </div>
    `;

    return card;
}

export function renderArtworks(artworks, container, countElement) {
    container.innerHTML = "";

    countElement.textContent = `${artworks.length} ${artworks.length === 1 ? "record" : "records"} saved`;

    if (artworks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No artwork records yet. Add the first record using the form.</p>
            </div>
        `;
        return;
    }

    artworks.forEach((artwork) => {
        container.appendChild(createArtworkCard(artwork));
    });
}
