function openMainTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    const tabBtns = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function filterProjects(sectionType, softwareClass) {
    // Determine which section's buttons and grid we are interacting with
    const navId = sectionType === 'eng' ? 'eng-nav' : 'gfx-nav';
    const gridId = sectionType === 'eng' ? 'eng-grid' : 'gfx-grid';

    // Update active state on sub-buttons for that specific section
    const subBtns = document.querySelectorAll(`#${navId} .sub-btn`);
    subBtns.forEach(btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");

    // Filter the project cards in that specific section
    const cards = document.querySelectorAll(`#${gridId} .card`);
    cards.forEach(card => {
        if (softwareClass === 'all' || card.classList.contains(softwareClass)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc; 
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}
