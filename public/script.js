document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const result = document.getElementById('result');
  result.innerHTML = "Uploading... ⏳";

  try {
    const res = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      result.innerHTML = `✅ Upload Successful!<br>
        <a href="${data.fileUrl}" target="_blank" download>Download File</a>`;
    } else {
      result.innerHTML = `❌ Upload failed: ${data.message}`;
    }
  } catch (err) {
    result.innerHTML = `❌ Error: ${err.message}`;
  }
});
