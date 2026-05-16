const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data", "artworks.json");

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

function readArtworks() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  const data = fs.readFileSync(DATA_FILE);

  return JSON.parse(data);
}

function saveArtworks(artworks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(artworks, null, 2));
}

app.get("/api/artworks", (req, res) => {
  const artworks = readArtworks();
  res.json(artworks);
});

app.post("/api/artworks", upload.single("image"), (req, res) => {
  const artworks = readArtworks();

  const artwork = {
    id: Date.now().toString(),
    title: req.body.title,
    artist: req.body.artist,
    date: req.body.date,
    medium: req.body.medium,
    accessionNumber: req.body.accessionNumber,
    height: req.body.height,
    width: req.body.width,
    depth: req.body.depth,
    provenance: req.body.provenance,
    imagePath: req.file ? `/uploads/${req.file.filename}` : "",
    imageName: req.file ? req.file.originalname : "",
  };

  artworks.unshift(artwork);

  saveArtworks(artworks);

  res.json(artwork);
});

app.delete("/api/artworks/:id", (req, res) => {
  const artworks = readArtworks();

  const filtered = artworks.filter((artwork) => artwork.id !== req.params.id);

  saveArtworks(filtered);

  res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
