const form = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Uploading...';
  const formData = new FormData(form);
  try {
    const res = await fetch('/upload', { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Upload failed');
    statusEl.textContent = `Uploaded to ${json.organ}: ${json.filename}`;
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message;
  }
});
