let activeGalleryId = '';
let isGraphicProject = false;

// --- LEVEL 1: FILTER MAIN CATEGORIES ---
function filterCategory(category, event) {
    resetToHome(); 
    
    // Manage active state on Top Nav
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    // Hide all Sub-Navs and reset their buttons
    document.querySelectorAll('.software-nav').forEach(nav => nav.classList.add('hidden'));
    document.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    
    // Show corresponding Sub-Nav
    if (category === 'engineering') {
        document.getElementById('nav-engineering').classList.remove('hidden');
        document.querySelector('#nav-engineering .software-link').classList.add('active');
    } else if (category === 'graphic') {
        document.getElementById('nav-graphic').classList.remove('hidden');
        document.querySelector('#nav-graphic .software-link').classList.add('active');
    }

    // Filter main grid
    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (category === 'all' || album.classList.contains(category)) {
            album.style.display = 'block';
        } else {
            album.style.display = 'none';
        }
    });
}

// --- LEVEL 2: FILTER SPECIFIC SOFTWARE ---
function filterSoftware(category, software, event) {
    // Manage active state on Sub Nav
    const currentNav = document.getElementById(`nav-${category}`);
    currentNav.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    // Filter main grid by software
    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (software === 'all') {
            album.style.display = album.classList.contains(category) ? 'block' : 'none';
        } else {
            album.style.display = album.classList.contains(software) ? 'block' : 'none';
        }
    });
}

// --- HERO COVER TRANSITION ---
function openHero(title, date, bgImageUrl, galleryId) {
    document.getElementById('album-grid').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('hero-cover').classList.add('active');
    
    document.getElementById('hero-title').innerText = title;
    document.getElementById('hero-date').innerText = date;
    document.getElementById('hero-bg').style.backgroundImage = `url('${bgImageUrl}')`;
    
    activeGalleryId = galleryId;
    
    // Determine if it's a graphic project so we can hide CAD views (Isometric, Top, etc.)
    const clickedCard = event.currentTarget;
    isGraphicProject = clickedCard.classList.contains('graphic');
}

// --- OPEN INTERNAL GALLERY ---
function openGallery() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.add('active');
    
    // Show/Hide the CAD view navigation based on project type
    const cadNav = document.getElementById('cad-views-nav');
    if (isGraphicProject) {
        cadNav.classList.add('hidden');
    } else {
        cadNav.classList.remove('hidden');
    }

    // Hide all project galleries, show only the active one
    document.querySelectorAll('.project-images').forEach(project => {
        project.style.display = 'none';
    });
    
    if (activeGalleryId) {
        document.getElementById(activeGalleryId).style.display = 'block';
        
        // Default to isometric for CAD, or show all for graphics
        if (!isGraphicProject) {
            filterGallery('isometric', null);
        } else {
            filterGallery('all-views', null);
        }
    }
}

// --- FILTER CAD VIEWS INSIDE GALLERY ---
function filterGallery(viewType, event) {
    // Update active sub-link
    const subLinks = document.querySelectorAll('.sub-link');
    subLinks.forEach(link => link.classList.remove('active'));
    
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        // Fallback active state for initialization
        if (subLinks.length > 0) subLinks[0].classList.add('active');
    }

    // Only filter images INSIDE the currently active project
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

// --- RESET TO MAIN GRID ---
function resetToHome() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('album-grid').classList.add('active');
}
