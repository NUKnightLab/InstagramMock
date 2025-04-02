// Preload script
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded successfully');
  
  // We can expose Node.js APIs to renderer if needed
  window.electronAPI = {
    // Add any IPC methods or Node.js functionality here if needed
    getVersion: () => process.versions.electron
  };
}); 