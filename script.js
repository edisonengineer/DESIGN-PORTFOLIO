let activeGalleryId = '';
let isGraphicProject = false;

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

// FIX: Added 'isGraphic' as a direct parameter so it never fails
function openHero(title, date, bgImageUrl, galleryId, isGraphic) {
    document.getElementById('album-grid').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('hero-cover').classList.add('active');
    
    document.getElementById('hero-title').innerText = title;
    document.getElementById('hero-date').innerText = date;
    document.getElementById('hero-bg').style.backgroundImage = `url('${bgImageUrl}')`;
    
    activeGalleryId = galleryId;
    isGraphicProject = isGraphic;
}

function openGallery() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.add('active');
    
    const cadNav = document.getElementById('cad-views-nav');
    if (isGraphicProject) {
        cadNav.classList.add('hidden'); // Hides isometric/top tabs for Photoshop
    } else {
        cadNav.classList.remove('hidden'); // Shows them for SolidWorks
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
}
