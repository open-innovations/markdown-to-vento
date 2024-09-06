document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileElem = document.getElementById('fileElem');
    const downloadLink = document.getElementById('download-link');

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('hover');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('hover');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('hover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileElem.addEventListener('change', () => {
        const files = fileElem.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                const convertedContent = convertMarkdownToVTO(content);
                createDownloadableFile(convertedContent);
            };

            reader.readAsText(file);
        }
    }

    function convertMarkdownToVTO(markdown) {
        let lines = markdown.split('\n');
        let inFrontMatter = false;
        let inCodeBlock = false;
        let inHtmlTag = false;
        let result = [];

        const openHtmlTagPattern = /<([a-zA-Z][a-zA-Z0-9]*)[^>]*>/;
        const closeHtmlTagPattern = /<\/([a-zA-Z][a-zA-Z0-9]*)>/;

        for (let line of lines) {
            if (line.trim() === '---') {
                inFrontMatter = !inFrontMatter;
                result.push(line);
                continue;
            }

            if (inFrontMatter) {
                result.push(line);
                continue;
            }

            if (line.trim().startsWith('```')) {
                if (!inCodeBlock) {
                    const language = line.trim().slice(3);
                    result.push(`<pre><code class='language-${language}'>`);
                } else {
                    result.push('</code></pre>');
                }
                inCodeBlock = !inCodeBlock;
                continue;
            }

            if (openHtmlTagPattern.test(line)) {
                inHtmlTag = true;
                result.push(line);
                continue;
            }

            if (closeHtmlTagPattern.test(line)) {
                inHtmlTag = false;
                result.push(line);
                continue;
            }

            if (inCodeBlock || inHtmlTag) {
                result.push(line);
            } else {
                if (line.trim() !== '') {
                    result.push(`<p>${line}</p>`);
                }
            }
        }

        return result.join('\n');
    }

    function createDownloadableFile(content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.style.display = 'block'; // Make the download link visible
    }
});
