function getDimensions(artwork) {
    const dimensions = [artwork.height, artwork.width, artwork.depth].filter(Boolean);

    if (dimensions.length === 0) {
        return "Not recorded";
    }

    return dimensions.join(" × ");
}

function createArtworkCard(artwork) {
    const card = document.createElement("article");
    card.className = "artwork-card";

    card.innerHTML = `
        <h3>${artwork.title}</h3>
        <p><strong>Artist:</strong> ${artwork.artist}</p>

        <div class="card-meta">
            <p><strong>Date:</strong> ${artwork.date || "Not recorded"}</p>
            <p><strong>Medium:</strong> ${artwork.medium || "Not recorded"}</p>
            <p><strong>Accession #:</strong> ${artwork.accessionNumber || "Not assigned"}</p>
            <p><strong>Dimensions:</strong> ${getDimensions(artwork)}</p>
        </div>

        ${artwork.imageUrl ? `<p><strong>Image/File:</strong> <a href="${artwork.imageUrl}" target="_blank" rel="noopener">Open reference</a></p>` : ""}

        ${artwork.provenance ? `
            <p class="card-notes"><strong>Provenance / Notes:</strong><br>${artwork.provenance}</p>
        ` : ""}
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
