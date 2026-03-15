const UploadModule = {
    handlePreview(event) {
        const file = event.target.files[0];
        const previewContainer = document.getElementById('preview-container');
        const prompt = document.getElementById('upload-prompt');

        if (file) {
            // 1. Client-side Size Validation
            if (file.size > 25 * 1024 * 1024) {
                alert("File is too large! Max 25MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.classList.remove('hidden');
                prompt.classList.add('hidden');
                
                if (file.type.startsWith('image/')) {
                    previewContainer.innerHTML = `<img src="${e.target.result}" class="max-h-64 mx-auto rounded-lg shadow">`;
                } else if (file.type.startsWith('video/')) {
                    previewContainer.innerHTML = `<video src="${e.target.result}" controls class="max-h-64 mx-auto rounded-lg"></video>`;
                } else {
                    previewContainer.innerHTML = `<div class="p-4 bg-gray-100 dark:bg-slate-900 rounded">📄 ${file.name}</div>`;
                }
            };
            reader.readAsDataURL(file);
        }
    }
};

// Listen for file changes
document.getElementById('media-input')?.addEventListener('change', UploadModule.handlePreview);
