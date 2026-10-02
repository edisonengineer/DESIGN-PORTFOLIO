// --- 1. Main Navigation Tabs ---
function openMainTab(evt, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Remove active class from all main navigation buttons
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    // Show the specific tab and mark the button as active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// --- 2. Software Sub-Navigation Filter ---
function filterSoftware(softwareClass) {
    // Update active state on sub-buttons
    const subBtns = document.getElementsByClassName("sub-btn");
    for (let i = 0; i < subBtns.length; i++) {
        subBtns[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

    // Filter the project cards in the engineering section
    const cards = document.querySelectorAll("#engineering .card");
    cards.forEach(card => {
        if (softwareClass === 'all') {
            card.style.display = "block";
        } else {
            // Check if the card has the specific software class (e.g., 'solidworks')
            if (card.classList.contains(softwareClass)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
}

// --- 3. Lightbox / Image Viewer Logic ---
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // In a real scenario, you'd pass the actual image URL. 
    // For now, we will just show the lightbox container.
    lightboxImg.src = imageSrc; 
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

// Close lightbox if user clicks anywhere outside the image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target !== document.getElementById('lightbox-img')) {
        closeLightbox();
    }
});

// --- 4. Flipbook Initialization (Requires turn.js to be downloaded) ---
// This runs when the document is fully loaded. It assumes you have added turn.js to your repo.
document.addEventListener("DOMContentLoaded", function() {
    // Check if the jQuery turn plugin is available
    if (window.jQuery && $.fn.turn) {
        $("#flipbook").turn({
            width: 800,
            height: 500,
            autoCenter: true,
            display: 'double',
            elevation: 50
        });
    } else {
        console.log("Turn.js library not detected. Please link turn.min.js in your HTML to enable the flipbook.");
    }
});
