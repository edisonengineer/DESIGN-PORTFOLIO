let activeGalleryId = '';
let isGraphicProject = false;
let lightboxImages = [];
let currentLightboxIndex = 0;

function filterCategory(category, event) {
    resetToHome(); 
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    document.querySelectorAll('.software-nav').forEach(nav => nav.classList.add('hidden'));
    document.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    
    if (category === 'engineering') {
        document.getElementById('nav-engineering').classList.remove('hidden');
        document.querySelector('#nav-engineering .software-link').classList.add('active');
    } else if (category === 'graphic') {
        document.getElementById('nav-graphic').classList.remove('hidden');
        document.querySelector('#nav-graphic .software-link').classList.add('active');
    }

    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (category === 'all' || album.classList.contains(category)) {
            album.style.display = 'block';
        } else {
            album.style.display = 'none';
        }
    });
}

function filterSoftware(category, software, event) {
    const currentNav = document.getElementById(`nav-${category}`);
    currentNav.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (software === 'all') {
            album.style.display = album.classList.contains(category) ? 'block' : 'none';
        } else {
            album.style.display = album.classList.contains(software) ? 'block' : 'none';
        }
    });
}

function openHero(title, date, bgImageUrl, galleryId, isGraphic, themeColor) {
    document.getElementById('album-grid').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('hero-cover').classList.add('active');
    
    document.getElementById('hero-title').innerText = title;
    document.getElementById('hero-date').innerText = date;
    document.getElementById('hero-bg').style.backgroundImage = `url('${bgImageUrl}')`;
    
    activeGalleryId = galleryId;
    isGraphicProject = isGraphic;
    document.body.style.backgroundColor = themeColor || '#1a1a1a';
}

function openGallery() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.add('active');
    
    const cadNav = document.getElementById('cad-views-nav');
    if (isGraphicProject) {
        cadNav.classList.add('hidden');
    } else {
        cadNav.classList.remove('hidden');
    }

    document.querySelectorAll('.project-images').forEach(project => {
        project.style.display = 'none';
    });
    
    if (activeGalleryId) {
        document.getElementById(activeGalleryId).style.display = 'block';
        if (!isGraphicProject) {
            filterGallery('isometric', null);
        } else {
            filterGallery('all-views', null);
        }
    }
}

function filterGallery(viewType, event) {
    const subLinks = document.querySelectorAll('.sub-link');
    subLinks.forEach(link => link.classList.remove('active'));
    
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        if (subLinks.length > 0) subLinks[0].classList.add('active');
    }

    if (activeGalleryId) {
        const items = document.querySelectorAll(`#${activeGalleryId} .gallery-item`);
        items.forEach(item => {
            if (viewType === 'all-views' || item.classList.contains(viewType)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

function resetToHome() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('album-grid').classList.add('active');
    document.body.style.backgroundColor = '#1a1a1a';
}

// --- FULLSCREEN LIGHTBOX FUNCTIONS ---

function openLightbox(clickedElement) {
    const gallery = document.getElementById(activeGalleryId);
    
    // Find all images currently visible on the screen based on the active tab (Front, Top, etc.)
    const visibleItems = Array.from(gallery.querySelectorAll('.gallery-item')).filter(item => item.style.display === 'block');
    
    // Map their source URLs into our array
    lightboxImages = visibleItems.map(item => item.querySelector('img').src);
    
    // Find exactly which image was clicked
    currentLightboxIndex = visibleItems.indexOf(clickedElement);
    
    // Display the image and fade in the lightbox
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex];
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

function changeImage(direction, event) {
    // Prevent clicking the arrow from accidentally closing the gallery
    event.stopPropagation();
    
    currentLightboxIndex += direction;
    
    // Loop back to the start or end if they click past the limits
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    } else if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    }
    
    document.getElementById('lightbox-img').src = lightboxImages[currentLightboxIndex];
}
