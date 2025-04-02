# Change Log

## [Unreleased]

### Added
- Initial project setup with basic Electron structure.
- Created `package.json`, `main.js`, `index.html`, `renderer.js`, `style.css`, `CHANGELOG.md`, and `ARCHITECTURE.md`.
- Implemented basic drag-and-drop functionality to read and display dropped images in the preview area (`renderer.js`).
- Added drag-and-drop reordering for images within the preview area (`renderer.js`, `style.css`).
- Modified functionality to display the Instagram post preview/carousel immediately after dropping images (`renderer.js`, `style.css`).
  - Images are displayed as thumbnails for sorting initially.
  - The button now toggles to an "Edit Sequence" mode showing thumbnails for sorting.
  - Clicking 'Preview Post' switches to a view showing one image at a time.
  - Indicator dots are shown and functional immediately in the initial preview mode.
- Implemented smooth sliding transition between images in preview mode using CSS `transform`.
- Adjusted CSS overflow properties to ensure subsequent images are visible during slide.
- Added `will-change: transform` CSS hint to improve sliding animation rendering.
- Added `transform: translateZ(0)` CSS hint to preview images to potentially improve rendering during slide.
- Added `flex-shrink: 0` and `backface-visibility: hidden` to preview image styles for rendering stability.
- Changed image preview carousel from CSS transform-based sliding to absolute positioning with opacity transition.
- Fixed issue where dots were hidden behind images by adding `z-index` to `.dots-container`.
- Reverted image preview carousel back to using CSS transform-based sliding, keeping previous rendering hints.
- Added setTimeout delay before applying initial transform to potentially fix rendering race condition.
- Fixed error where initial transform/dot update logic was moved outside the drop handler.
- Ensured initial transform is applied via setTimeout(0) *after* images are loaded within the drop handler.
- Simplified preview image CSS to basic flex properties, removing potentially conflicting styles (object-fit, max-height) and rendering hints.
- Changed carousel implementation from flexbox to CSS grid for better rendering compatibility.
- Completely replaced sliding carousel with simple show/hide approach using display: none/block and CSS classes.
- Implemented proper sliding carousel using Swiper.js library:
  - Added Swiper.js via CDN to index.html
  - Updated carousel HTML structure to use Swiper's containers
  - Added Swiper-specific CSS styles while preserving Instagram-like appearance
  - Refactored JavaScript to initialize and control the Swiper instance 
+ Fixed issues:
+   - Added proper preload.js script for Electron
+   - Replaced missing profile image with inline SVG avatar
+   - Made preload script path loading more robust in main.js
+   - Added logging for better debugging of Swiper initialization 
+ Fixed image display issues:
+   - Added Content Security Policy to index.html 
+   - Improved Swiper CSS to properly display images
+   - Enhanced image loading logic with proper error handling
+   - Added debugging for Swiper initialization and image loading 
+ - Fixed carousel display by removing conflicting CSS rules from previous implementation 
- Fixed image stacking issue:
  - Added debugging to detect slides with multiple images
  - Enhanced Swiper wrapper and slide CSS properties
  - Added more robust cleanup when dropping new images
  - Added explicit height and positioning to Swiper elements 
- Fixed vertical stacking bug by removing a CSS rule that was overriding Swiper's flex layout with display: block 
+ - Fixed carousel sliding issue by removing overflow:hidden from .image-carousel that was preventing proper Swiper functionality 
+ - Improved navigation dots centering with stronger CSS rules 
+ - Changed user workflow to start in edit mode after dropping images:
+   - Images now appear in an edit/sorting view immediately after dropping
+   - Added help message explaining how to use the drag-and-drop reordering
+   - Enhanced thumbnail view styling with hover effects and improved layout
+   - User must explicitly click "Preview Post" to see the Instagram carousel view 
+ - Reverted to starting in preview mode after dropping images for stability and consistency 
+ - Implemented dual-view functionality:
+   - Added thumbnail container above the preview area
+   - Thumbnails show numbered images that can be dragged to reorder
+   - Reordering thumbnails automatically updates the preview carousel
+   - Maintained smooth Swiper.js carousel for the Instagram preview 
+ - Enhanced Instagram-like appearance:
+   - Added proper SVG icons from icons folder (heart, comment, share, bookmark)
+   - Updated post header with profile info and location
+   - Added post details including likes count, comments section, and timestamp
+   - Improved CSS styling to match Instagram's design system and typography
+   - Added comment input field with emoji icon 
+ - Replaced image tags with inline SVG elements for all icons:
+   - Updated heart, comment, share, bookmark, and emoji icons with actual Instagram SVG paths
+   - Added proper styling for SVG icons including hover and active states
+   - Added SVG currentColor support for better theming capability 
+ - Added Instagram-style previous/next navigation arrows:
+   - Used an icon sheet (`iconsheet.png`) and background positioning
+   - Added button elements to HTML
+   - Styled buttons with CSS to match Instagram appearance
+   - Connected buttons to Swiper navigation 
+ - Improved navigation button behavior to match Instagram UX:
+   - Hide back button on the first slide
+   - Hide next button on the last slide
+   - Added dynamic visibility control during slide changes 
+ - Improved user interface and layout:
+   - Implemented responsive grid layout with left and right panels
+   - Enhanced visual design with consistent spacing and styling
+   - Made more efficient use of screen space
+   - Improved thumbnail appearance with hover effects
+   - Added button styling with hover states
+   - Consolidated controls in the left panel 
+ - Made Instagram post a fixed width (470px) to match typical Instagram dimensions
+ - Added dark mode support:
+   - Implemented CSS variables for all colors
+   - Added theme toggle button with sun/moon icons
+   - Dark theme colors match Instagram's dark mode
+   - Added persistent theme preference using localStorage
+   - Added smooth transitions between light/dark modes 
+ - Improved app header styling:
+   - Added Instagram logo with "Mock" text for better branding
+   - Redesigned header with cleaner layout and better spacing
+ - Added post customization form:
+   - Created input fields for username, location, caption, and likes count
+   - Implemented real-time preview updates as users type
+   - Added styled form with proper responsiveness and dark mode support
+   - Pre-populated fields with default Instagram-like content 
+ - UI Enhancements:
+   - Replaced Instagram logo img tag with inline SVG for better scaling and theme support
+   - Improved form field styling with better spacing, focus states, and hover effects
+   - Added subtle shadows and borders to form elements for improved visual hierarchy
+   - Fixed input field width calculations to prevent overflow
+   - Added proper typography and line height to form elements for better readability
+   - Made form more responsive with better padding and margin distribution 
+ - Implemented PDF Export functionality:
+   - Added jsPDF and html2canvas libraries for PDF generation
+   - Created export logic that captures all carousel images in a single PDF
+   - Included post details (username, location, caption, likes) in the export
+   - Added page handling to accommodate multiple images with proper layout
+   - Added loading indicator to provide feedback during PDF generation
+   - Implemented automatic filename with username and date 
+ - Enhanced PDF Export functionality:
+   - Completely redesigned PDF generation to capture the exact Instagram post appearance
+   - Each page now shows the full Instagram post UI including header, image, likes, and comments
+   - Maintains precise styling and layout matching the on-screen appearance
+   - Exports each carousel image as a separate page while preserving the post context
+   - Added small page indicator to help navigate multi-image exports
+   - Maintains dark/light mode theme in the exported PDF 
+ - UI Streamlining:
+   - Removed the "Preview Post"/"Edit Sequence" toggle button
+   - Made the Instagram post preview always visible
+   - Simplified the UI by relying exclusively on thumbnails for image reordering 
+   - Reduced UI complexity by eliminating mode switching
+   - Images automatically appear in the Instagram post as soon as they are reordered in thumbnails 
+ - Fixed image reordering issue:
+   - Fixed bug where reordering thumbnails was not updating the Instagram post preview
+   - Removed unnecessary conditional check that was preventing preview updates
+   - Ensured that all dragging actions immediately update the carousel view
+   - Improved the connection between the thumbnail grid and the Swiper carousel 
+ - Project maintenance improvements:
+   - Added comprehensive .gitignore file to exclude node_modules and other unnecessary files
+   - Prevents accidentally committing dependencies, logs, and OS/editor files
+   - Includes Electron-specific exclusions for build processes 
+ - Repository maintenance:
+   - Cleaned up repository history to remove large files and node_modules
+   - Created clean-repo.sh script for repository maintenance
+   - Fixed GitHub push errors related to files exceeding size limits
+   - Optimized repository size for better cloning and collaboration 
+ - macOS Application Build Support:
+   - Added electron-builder configuration for creating a native macOS application
+   - Integrated Instagram app logo as the application icon
+   - Created script to generate app icons in multiple sizes
+   - Added native macOS menu with standard options
+   - Improved window configuration with proper title and dimensions
+   - Configured DMG installer with drag-to-Applications folder 