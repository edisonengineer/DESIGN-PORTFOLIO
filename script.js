// Function to handle the Top Navigation (Software Categories)
function filterMain(category) {
    resetToHome(); // Ensure we are on the grid view
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Filter albums
    const albums = document.querySelectorAll('.album-card');
    albums.forEach(album => {
        if (category === 'all' || album.classList.contains(category)) {
            album.style.display = 'block';
        } else {
            album.style.display = 'none';
        }
    });
}

// Function to Open the Hero Cover (Like clicking "Daisy")
function openHero(title, date, bgImageUrl) {
    // Hide the grid, show the hero
    document.getElementById('album-grid').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    
    const heroCover = document.getElementById('hero-cover');
    heroCover.classList.add('active');
    
    // Populate Hero Data
    document.getElementById('hero-title').innerText = title;
    document.getElementById('hero-date').innerText = date;
    document.getElementById('hero-bg').style.backgroundImage = `url('${bgImageUrl}')`;
}

// Function to transition from Hero Cover to the actual Gallery Grid
function openGallery() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.add('active');
    
    // Default to Isometric view when opening a CAD gallery
    filterGallery('isometric'); 
}

// Function to filter internal views (Isometric, Front, Top, etc.)
function filterGallery(viewType) {
    // Update active sub-link
    const subLinks = document.querySelectorAll('.sub-link');
    subLinks.forEach(link => link.classList.remove('active'));
    
    // Use the event target if it exists, otherwise default to the first link (Isometric)
    if(event) {
        event.currentTarget.classList.add('active');
    } else {
        document.querySelector('.sub-link').classList.add('active');
    }

    // Filter images
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (item.classList.contains(viewType)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Function to go back to the main grid (Clicking the Logo)
function resetToHome() {
    document.getElementById('hero-cover').classList.remove('active');
    document.getElementById('internal-gallery').classList.remove('active');
    document.getElementById('album-grid').classList.add('active');
}
