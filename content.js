(function () {
  function createScreenshotButton() {
    // Prevent duplicate buttons
    if (document.querySelector('#screenshot-btn')) return;

    // Find the container with the Like/Share buttons
    const container = document.querySelector('#top-level-buttons-computed');
    if (!container) return;

    // Create the screenshot button
    const button = document.createElement('button');
    button.textContent = 'Screenshot'; // Text-only button
    button.title = 'Take Screenshot';
    button.id = 'screenshot-btn';
    button.style.fontSize = '14px';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = '#f1f1f1';
    button.style.border = '1px solid #ccc';
    button.style.borderRadius = '18px';
    button.style.color = '#333';
    button.style.cursor = 'pointer';
    button.style.marginLeft = '10px'; // Add space from other buttons

    button.addEventListener('click', takeScreenshot);

    // Append the button to the Like/Share button container
    container.appendChild(button);
  }

  async function takeScreenshot() {
    const video = document.querySelector('video');
    const videoTitle = document.querySelector('#below #title h1').innerText || 'untitled-video';
    if (!video) return;

    // Create a canvas to draw the current video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      // Copy to clipboard
      try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        alert('Screenshot copied to clipboard!');
      } catch (clipboardErr) {
        console.error('Clipboard write failed:', clipboardErr);
      }

      // Create a link to download the screenshot
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      // Include video title in the filename (sanitize the title to remove invalid characters)
      const sanitizedTitle = videoTitle.replace(/[\/\\?%*:|"<>]/g, '-');
      link.download = `${sanitizedTitle}-screenshot-${Date.now()}.png`; // Set file name with video title and timestamp

      // Trigger download automatically (no alert)
      link.click();
    });
  }

  function checkForContainer() {
    const container = document.querySelector('#top-level-buttons-computed');
    if (container && !document.querySelector('#screenshot-btn')) {
      createScreenshotButton();
    }
  }

  // Observe changes in the DOM to handle navigation within YouTube
  const observer = new MutationObserver(() => {
    checkForContainer();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial check when the script loads
  checkForContainer();
})();
