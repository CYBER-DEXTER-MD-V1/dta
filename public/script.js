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
      fetchFileList();  // Reload file list after successful upload
    } else {
      result.innerHTML = `❌ Upload failed: ${data.message}`;
    }
  } catch (err) {
    result.innerHTML = `❌ Error: ${err.message}`;
  }
});

// Fetch and display uploaded files
async function fetchFileList() {
  try {
    const res = await fetch('/');
    const data = await res.json();
    const fileList = document.getElementById('fileList');
    
    fileList.innerHTML = ''; // Clear the current list

    data.files.forEach(file => {
      const fileElement = document.createElement('div');
      fileElement.innerHTML = `<a href="${file.downloadUrl}" target="_blank" download>${file.name}</a>`;
      fileList.appendChild(fileElement);
    });
  } catch (err) {
    console.error('Error fetching file list:', err);
  }
}

// Initialize file list on page load
window.onload = fetchFileList;
