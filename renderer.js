// This file will handle the renderer process logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Renderer process started');

    const dropZone = document.getElementById('drop-zone');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const thumbnailsGrid = document.querySelector('.thumbnails-grid');
    const previewArea = document.getElementById('preview-area');
    const exportButton = document.getElementById('export-pdf');
    const imageCarousel = previewArea.querySelector('.image-carousel');
    const dotsContainer = previewArea.querySelector('.dots-container');
    const themeToggle = document.getElementById('theme-toggle');
    const themeText = themeToggle.querySelector('.theme-text');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    // Form input elements
    const usernameInput = document.getElementById('username-input');
    const locationInput = document.getElementById('location-input');
    const captionInput = document.getElementById('caption-input');
    const likesInput = document.getElementById('likes-input');
    
    // Preview elements that will be updated
    const previewUsername = previewArea.querySelectorAll('.username');
    const previewLocation = previewArea.querySelector('.location');
    const previewCaption = previewArea.querySelector('.post-footer p');
    const previewLikes = previewArea.querySelector('.likes b');
    
    // Always in preview mode
    previewArea.classList.add('preview-active');
    let currentImageIndex = 0;
    let swiper = null; // Will hold the Swiper instance
    let isDarkMode = false; // Track current theme
    
    let draggedThumbnail = null;
    let draggedSlide = null; // Track the dragged slide for Swiper
    
    let imageDataArray = []; // Array to store image data for both thumbnails and slides

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        // Update icon and text
        if (isDarkMode) {
            themeText.textContent = 'Light Mode';
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            themeText.textContent = 'Dark Mode';
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        
        // Store preference in local storage
        localStorage.setItem('darkMode', isDarkMode);
        
        // If Swiper is initialized, update it to reflect theme changes
        if (swiper) {
            setTimeout(() => swiper.update(), 100);
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeText.textContent = 'Light Mode';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    // Function to add drag event listeners to a thumbnail
    function addThumbnailDragListeners(thumbnail, index) {
        thumbnail.setAttribute('draggable', 'true');
        
        thumbnail.addEventListener('dragstart', (e) => {
            draggedThumbnail = thumbnail;
            thumbnail.classList.add('dragging');
            e.dataTransfer.setData('text/plain', index.toString());
            console.log('Thumbnail drag start:', index);
        });

        thumbnail.addEventListener('dragend', () => {
            if (draggedThumbnail) {
                draggedThumbnail.classList.remove('dragging');
                draggedThumbnail = null;
            }
            
            // After reordering, update the image data array to match current order
            updateImageOrderFromDOM();
            
            // Reinitialize the Swiper to reflect the new order
            rebuildSwiperFromImageData();
            
            // Update thumbnail numbers
            updateThumbnailNumbers();
            
            console.log('Thumbnail drag end, new order:', imageDataArray.map(item => item.name));
        });
    }
    
    // Handle dragover in the thumbnails grid
    thumbnailsGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
        
        // Find the thumbnail being dragged over
        const overElement = e.target.closest('.thumbnail');
        if (!overElement || overElement === draggedThumbnail) return;
        
        // Get the rectangle for position calculation
        const rect = overElement.getBoundingClientRect();
        const mouseX = e.clientX;
        
        // Determine if we're on the left or right half of the element
        const isOnLeftHalf = mouseX < rect.left + rect.width / 2;
        
        if (isOnLeftHalf) {
            thumbnailsGrid.insertBefore(draggedThumbnail, overElement);
        } else {
            const nextSibling = overElement.nextElementSibling;
            if (nextSibling) {
                thumbnailsGrid.insertBefore(draggedThumbnail, nextSibling);
            } else {
                thumbnailsGrid.appendChild(draggedThumbnail);
            }
        }
    });
    
    // Function to update the image data array based on current DOM order
    function updateImageOrderFromDOM() {
        const thumbnails = thumbnailsGrid.querySelectorAll('.thumbnail');
        const newOrder = [];
        
        thumbnails.forEach(thumbnail => {
            const index = parseInt(thumbnail.dataset.index, 10);
            if (!isNaN(index) && index >= 0 && index < imageDataArray.length) {
                newOrder.push(imageDataArray[index]);
            }
        });
        
        if (newOrder.length === imageDataArray.length) {
            imageDataArray = newOrder;
        } else {
            console.error('Error reordering: thumbnail count mismatch');
        }
    }
    
    // Function to update thumbnail numbers based on current order
    function updateThumbnailNumbers() {
        const thumbnails = thumbnailsGrid.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, i) => {
            const numberElement = thumbnail.querySelector('.number');
            if (numberElement) {
                numberElement.textContent = (i + 1).toString();
            }
            
            // Update the data-index attribute
            thumbnail.dataset.index = i.toString();
        });
    }
    
    // Function to rebuild Swiper slides from current image data
    function rebuildSwiperFromImageData() {
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
        
        // Clear the carousel
        imageCarousel.innerHTML = '';
        
        // Rebuild slides from the image data array
        imageDataArray.forEach(imageData => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const img = document.createElement('img');
            img.src = imageData.src;
            img.draggable = false;
            if (imageData.filePath) {
                img.dataset.filePath = imageData.filePath;
            }
            
            slide.appendChild(img);
            imageCarousel.appendChild(slide);
        });
        
        // Initialize Swiper with the new slides
        initSwiper();
    }

    // Function to initialize Swiper
    function initSwiper() {
        // Destroy existing Swiper if it exists
        if (swiper) {
            swiper.destroy(true, true);
        }

        // Log the contents of the carousel before initializing Swiper
        console.log('Carousel HTML before init:', imageCarousel.innerHTML);
        console.log('Number of slides:', imageCarousel.querySelectorAll('.swiper-slide').length);
        console.log('Number of images:', imageCarousel.querySelectorAll('img').length);
        
        // Debug each slide's content
        Array.from(imageCarousel.querySelectorAll('.swiper-slide')).forEach((slide, index) => {
            console.log(`Slide ${index} contains:`, slide.innerHTML);
        });
        
        // Initialize new Swiper
        swiper = new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 10,
            effect: 'slide',
            centeredSlides: true,
            autoHeight: true,
            loop: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active'
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                hideOnClick: false,
                disabledClass: 'swiper-button-disabled',
            },
            initialSlide: currentImageIndex,
            on: {
                slideChange: function() {
                    currentImageIndex = swiper.activeIndex;
                    console.log('Slide changed to:', currentImageIndex);
                    
                    // Hide/show navigation buttons based on slide position
                    updateNavigationButtons();
                },
                init: function() {
                    console.log('Swiper initialized fully, active slide:', this.activeIndex);
                    console.log('Total slides in Swiper:', this.slides.length);
                    
                    // Initial update of navigation buttons
                    updateNavigationButtons();
                    
                    // Force update to ensure proper render
                    setTimeout(() => {
                        this.update();
                        console.log('Swiper updated after timeout');
                    }, 100);
                },
                imagesReady: function() {
                    console.log('Swiper images ready');
                    this.update();
                    updateNavigationButtons();
                }
            }
        });

        console.log('Swiper initialized with', swiper.slides.length, 'slides');
    }
    
    // Function to update navigation buttons visibility
    function updateNavigationButtons() {
        if (!swiper) return;
        
        const prevButton = document.querySelector('.swiper-button-prev');
        const nextButton = document.querySelector('.swiper-button-next');
        
        if (!prevButton || !nextButton) return;
        
        // Hide prev button on first slide
        if (swiper.activeIndex === 0) {
            prevButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
        }
        
        // Hide next button on last slide
        if (swiper.activeIndex === swiper.slides.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }
    }

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    // Make the drop handler async to use await
    dropZone.addEventListener('drop', async (event) => {
        event.preventDefault();
        dropZone.classList.remove('drag-over');
        
        // Clear existing content
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
        
        imageCarousel.innerHTML = '';
        thumbnailsGrid.innerHTML = '';
        imageDataArray = [];
        
        // Always in preview mode
        previewArea.classList.add('preview-active');
        currentImageIndex = 0;

        const files = event.dataTransfer.files;
        console.log('Files dropped:', files);

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            // Handle no valid files
            thumbnailsContainer.style.display = 'none';
            
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = 'No valid image files dropped.';
            slide.style.color = '#ccc';
            slide.style.fontStyle = 'italic';
            imageCarousel.appendChild(slide);
            
            initSwiper();
            return;
        }

        // Create promises for reading each file
        const fileReadPromises = imageFiles.map((file, index) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (e) => {
                    const imageData = {
                        src: e.target.result,
                        name: file.name,
                        filePath: file.path,
                        index: index
                    };
                    
                    // Store the image data
                    imageDataArray.push(imageData);
                    
                    // Create a slide for this image
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    
                    // Create the image for the slide
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.draggable = false;
                    img.dataset.filePath = file.path;
                    
                    // Create a thumbnail
                    const thumbnail = document.createElement('div');
                    thumbnail.className = 'thumbnail';
                    thumbnail.dataset.index = index.toString();
                    
                    const thumbImg = document.createElement('img');
                    thumbImg.src = e.target.result;
                    thumbImg.draggable = false;
                    
                    const numberBadge = document.createElement('div');
                    numberBadge.className = 'number';
                    numberBadge.textContent = (index + 1).toString();
                    
                    // Ensure images are loaded before adding to DOM
                    img.onload = function() {
                        console.log('Image loaded successfully:', img.src.substring(0, 30) + '...');
                    };
                    
                    img.onerror = function() {
                        console.error('Failed to load image:', file.name);
                    };
                    
                    // Add elements to their containers
                    slide.appendChild(img);
                    imageCarousel.appendChild(slide);
                    
                    thumbnail.appendChild(thumbImg);
                    thumbnail.appendChild(numberBadge);
                    thumbnailsGrid.appendChild(thumbnail);
                    
                    // Add drag listeners to the thumbnail
                    addThumbnailDragListeners(thumbnail, index);
                    
                    resolve();
                };

                reader.onerror = (error) => {
                    console.error('Error reading file:', file.name, error);
                    reject(error);
                };

                reader.readAsDataURL(file);
            });
        });

        try {
            // Wait for all file reads and image appends to complete
            await Promise.all(fileReadPromises);

            console.log(`Appended ${imageCarousel.children.length} slides to the carousel.`);
            
            // Check if slides contain multiple images (debug)
            const slidesWithMultipleImages = Array.from(imageCarousel.querySelectorAll('.swiper-slide')).filter(
                slide => slide.querySelectorAll('img').length > 1
            );
            
            if (slidesWithMultipleImages.length > 0) {
                console.error('Found slides with multiple images:', slidesWithMultipleImages);
            }

            // Show the thumbnails container
            thumbnailsContainer.style.display = 'block';
            
            // Initialize Swiper
            initSwiper();

        } catch (error) {
            console.error('Failed to load one or more images:', error);
            // Handle error state
        }
    });

    // PDF Export Functionality
    const exportPdfBtn = document.getElementById('export-pdf');

    exportPdfBtn.addEventListener('click', async () => {
        // Access jsPDF from the global window object
        const { jsPDF } = window.jspdf;
        
        // Get the post container element
        const postContainer = document.querySelector('.post-container');
        
        if (!postContainer) {
            alert('Post container not found. Cannot generate PDF.');
            return;
        }
        
        // Extract all images from the carousel
        const slides = document.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
        
        if (slides.length === 0) {
            alert('No images to export. Please add images first.');
            return;
        }
        
        // Get username for the filename
        const username = document.getElementById('username-input').value || 'daisugano';
        
        // Show loading indicator
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = 'Generating PDF...';
        loadingMsg.style.position = 'fixed';
        loadingMsg.style.top = '50%';
        loadingMsg.style.left = '50%';
        loadingMsg.style.transform = 'translate(-50%, -50%)';
        loadingMsg.style.padding = '20px';
        loadingMsg.style.background = 'rgba(0,0,0,0.8)';
        loadingMsg.style.color = 'white';
        loadingMsg.style.borderRadius = '10px';
        loadingMsg.style.zIndex = '9999';
        document.body.appendChild(loadingMsg);
        
        try {
            // Store the current active slide index
            const currentSlideIndex = swiper.activeIndex;
            
            // Create a new PDF document with dimensions matching the post
            // Get the post dimensions
            const postRect = postContainer.getBoundingClientRect();
            const width = postRect.width;
            const height = postRect.height;
            
            // Create PDF with aspect ratio matching the post
            const doc = new jsPDF({
                orientation: width > height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [width, height]
            });
            
            const footer = document.querySelector('.post-footer');
            const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
            
            // Process each slide
            for (let i = 0; i < slides.length; i++) {
                // Navigate to this slide
                swiper.slideTo(i, 0);
                
                // Wait for the transition to complete and the slide to be fully visible
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Use html2canvas to capture the post exactly as it appears
                const canvas = await html2canvas(postContainer, {
                    scale: 2, // Higher resolution
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#000' : '#fff',
                    logging: false,
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight
                });
                
                // Add new page for slides after the first one
                if (i > 0) {
                    doc.addPage([width, height]);
                }
                
                // Convert canvas to image and add to PDF
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 0, 0, width, height);
                
                // Add slide indicator at the bottom
                if (slides.length > 1) {
                    doc.setFillColor(255, 255, 255);
                    doc.setDrawColor(0, 0, 0);
                    doc.setTextColor(0, 0, 0);
                    
                    // Position indicator at the bottom center
                    doc.setFontSize(10);
                    const indicatorText = `${i + 1} / ${slides.length}`;
                    const textWidth = doc.getStringUnitWidth(indicatorText) * 10 / doc.internal.scaleFactor;
                    const x = (width - textWidth) / 2;
                    
                    // Draw a small background for the text
                    const padding = 5;
                    doc.roundedRect(x - padding, height - 20, textWidth + (padding * 2), 15, 3, 3, 'FD');
                    doc.text(indicatorText, x, height - 10);
                }
            }
            
            // Restore the original slide
            swiper.slideTo(currentSlideIndex, 0);
            
            // Save the PDF
            doc.save(`instagram_post_${username}_${new Date().toISOString().slice(0, 10)}.pdf`);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Check console for details.');
        } finally {
            // Remove loading indicator
            document.body.removeChild(loadingMsg);
        }
    });

    // Update preview with form inputs
    function updatePreview() {
        // Update all username instances (there are multiple)
        previewUsername.forEach(el => {
            el.textContent = usernameInput.value || 'username';
        });
        
        // Update location
        previewLocation.textContent = locationInput.value || '';
        
        // Update caption
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'username';
        usernameSpan.textContent = usernameInput.value || 'username';
        
        previewCaption.innerHTML = ''; // Clear existing content
        previewCaption.appendChild(usernameSpan);
        previewCaption.appendChild(document.createTextNode(' ' + (captionInput.value || '')));
        
        // Update likes count
        previewLikes.textContent = `${likesInput.value || '0'} likes`;
    }
    
    // Form input event listeners
    usernameInput.addEventListener('input', updatePreview);
    locationInput.addEventListener('input', updatePreview);
    captionInput.addEventListener('input', updatePreview);
    likesInput.addEventListener('input', updatePreview);
    
    // Initial update based on default values
    updatePreview();

}); // End DOMContentLoaded