// --- Main Navigation ---
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

// --- Software Sub-Navigation Filter ---
function filterProjects(sectionType, softwareClass) {
    const navId = sectionType === 'eng' ? 'eng-nav' : 'gfx-nav';
    const gridId = sectionType === 'eng' ? 'eng-grid' : 'gfx-grid';

    // Update active button state
    const subBtns = document.querySelectorAll(`#${navId} .sub-btn`);
    subBtns.forEach(btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");

    // Filter cards
    const cards = document.querySelectorAll(`#${gridId} .card`);
    cards.forEach(card => {
        if (softwareClass === 'all' || card.classList.contains(softwareClass)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// --- Flipbook Initialization ---
document.addEventListener("DOMContentLoaded", function() {
    if (window.jQuery && $.fn.turn) {
        $("#flipbook").turn({
            width: 800,
            height: 500,
            autoCenter: true,
            display: 'double',
            elevation: 50
        });
    }
});
