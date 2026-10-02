let activeGalleryId = '';
let isGraphicProject = false;

// --- LEVEL 1: FILTER MAIN CATEGORIES ---
function filterCategory(category, event) {
    resetToHome(); 
    
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    // Hide sub-navs
    document.querySelectorAll('.software-nav').forEach(nav => nav.classList.add('hidden'));
    document.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    
    // Show specific sub-nav
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
    // Update active software link
    const currentNav = document.getElementById(`nav-${category}`);
    currentNav.querySelectorAll('.software-link').forEach(link => link.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');

    // Filter grid items
    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (software === 'all') {
            album.style.display = album.classList.contains(category) ? 'block' : 'none';
        } else {
            album.style.display = album.classList.contains(software) ? 'block' : 'none';
        }
    });
}

// --- HERO COVER TRANSITION & DYNAMIC BACKGROUND ---
function openHero(title, date, bgImageUrl, galleryId, isGraphic, themeColor) {
    document.getElementById('album-grid').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('hero-cover').classList.add('active');
    
    document.getElementById('hero-title').innerText = title;
    document.getElementById('hero-date').innerText = date;
    document.getElementById('hero-bg').style.backgroundImage = `url('${bgImageUrl}')`;
    
    activeGalleryId = galleryId;
    isGraphicProject = isGraphic;

    // Apply the custom theme color (or default back to dark charcoal if none is provided)
    document.body.style.backgroundColor = themeColor || '#1a1a1a';
}

// --- OPEN INTERNAL GALLERY ---
function openGallery() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.add('active');
    
    // Toggle CAD tabs based on project type
    const cadNav = document.getElementById('cad-views-nav');
    if (isGraphicProject) {
        cadNav.classList.add('hidden');
    } else {
        cadNav.classList.remove('hidden');
    }

    // Hide all project images
    document.querySelectorAll('.project-images').forEach(project => {
        project.style.display = 'none';
    });
    
    // Show only the clicked project's images
    if (activeGalleryId) {
        document.getElementById(activeGalleryId).style.display = 'block';
        
        // Auto-select correct view
        if (!isGraphicProject) {
            filterGallery('isometric', null);
        } else {
            filterGallery('all-views', null);
        }
    }
}

// --- FILTER INTERNAL CAD VIEWS ---
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

// --- RESET TO MAIN GRID ---
function resetToHome() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('album-grid').classList.add('active');
    
    // Reset background color to the default theme
    document.body.style.backgroundColor = '#1a1a1a';
}
