document.getElementById('fileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const files = ['image', 'audio', 'video'];

    files.forEach((fileType) => {
        const fileInput = document.getElementById(fileType);
        if (fileInput.files.length > 0) {
            formData.append(fileType, fileInput.files[0]);
        }
    });

    const statusDiv = document.getElementById('uploadStatus');
    const statusMessage = document.getElementById('statusMessage');
    const fileLinksDiv = document.getElementById('fileLinks');

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            statusDiv.classList.add('success');
            statusMessage.textContent = 'Files uploaded successfully!';
            
            data.files.forEach(file => {
                const fileLink = document.createElement('a');
                fileLink.href = file.url;
                fileLink.textContent = `Download ${file.filename}`;
                fileLinksDiv.appendChild(fileLink);
            });
        } else {
            statusDiv.classList.add('error');
            statusMessage.textContent = 'Upload failed. Please try again.';
        }
    } catch (error) {
        statusDiv.classList.add('error');
        statusMessage.textContent = 'Error: ' + error.message;
    } finally {
        statusDiv.classList.remove('hidden');
    }
});
