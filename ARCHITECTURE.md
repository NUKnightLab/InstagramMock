# System Architecture

## Overview

This document outlines the architecture of the InstagramMock application.

## Components

- **Main Process (`main.js`):** Manages application lifecycle, creates browser windows.
- **Renderer Process (`index.html`, `renderer.js`, `style.css`):** Handles the user interface:
  - Drag-and-drop image intake (`#drop-zone`).
  - Image sequencing via drag-and-drop thumbnails (`.image-carousel` in sort mode).
  - Instagram post preview mode with image carousel (`#preview-area.preview-active`, `.dots-container`).
  - PDF export logic (placeholder `export-pdf` button). 