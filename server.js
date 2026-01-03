const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const uploadBase = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadBase)) fs.mkdirSync(uploadBase, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const organ = (req.body.organ || 'unknown').toLowerCase();
    const dir = path.join(uploadBase, organ);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Serve production build if present, otherwise fall back to legacy `public` folder
const prodDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(prodDir)) {
  app.use(express.static(prodDir));
} else {
  app.use(express.static(publicDir));
}

app.post('/upload', upload.single('report'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  res.json({ status: 'success', organ: req.body.organ, filename: req.file.filename });
});

// For single-page-app routing: serve index.html from dist or public
app.get('*', (req, res) => {
  const indexPath = fs.existsSync(prodDir)
    ? path.join(prodDir, 'index.html')
    : path.join(publicDir, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
