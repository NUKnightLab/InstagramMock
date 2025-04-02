# Instagram Mock Creator

A desktop application for creating realistic Instagram post mockups. Easily create, customize, and export Instagram posts with multiple images, captions, and full Instagram styling.

![Instagram Mock Creator](screenshot.png)

## Features

### Core Functionality
- **Multi-Image Carousel**: Create Instagram posts with multiple images that behave just like the real Instagram carousel
- **Drag-and-Drop**: Simply drag images from your computer to add them to your post
- **Image Reordering**: Easily rearrange images using the thumbnail grid
- **PDF Export**: Export your post to a PDF with all images and post details included
- **Exact Instagram UI**: Realistic Instagram post interface with all UI elements

### Customization
- **Post Details**: Edit username, location, caption, and likes count
- **Real-time Preview**: See changes immediately as you type
- **Dark/Light Mode**: Toggle between Instagram's light and dark themes
- **Post Layout**: Fixed-width Instagram post with proper dimensions and styling

### User Experience
- **Intuitive Interface**: Clean, two-panel layout with controls on the left and preview on the right
- **Instagram-Style Navigation**: Previous/next arrows and pagination dots for multi-image posts
- **Simple Workflow**: Drop images → Arrange order → Customize details → Export PDF

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/NUKnightLab/InstagramMock.git
```

2. Install dependencies:
```bash
cd InstagramMock
npm install
```

3. Start the application:
```bash
npm start
```

### Usage

1. **Add Images**: Drag and drop image files onto the drop zone
2. **Arrange Images**: Drag the thumbnails to reorder them in the carousel
3. **Customize Post**: 
   - Enter username, location, and caption
   - Set likes count
4. **Toggle Theme**: Click the theme button to switch between light/dark mode
5. **Export**: Click "Export PDF" to save your Instagram post as a PDF

## Technologies

- **Electron**: Cross-platform desktop application framework
- **Swiper.js**: Touch-enabled JavaScript slider library
- **jsPDF & html2canvas**: PDF generation from HTML content
- **HTML/CSS/JavaScript**: Core web technologies

## Development

The application follows a simple architecture:
- `main.js`: Electron main process
- `preload.js`: Preload script for secure context bridge
- `renderer.js`: Main application logic
- `index.html`: Application HTML structure
- `style.css`: Styling and theming

## License

[MIT License](LICENSE)