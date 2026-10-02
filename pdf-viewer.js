/* =========================================================================
   PDF WORKS: flipbook viewer (PDF.js + StPageFlip)
   ========================================================================= */

// 1. We declare this globally first so the button click NEVER fails
window.showPdfWorks = function (event) {
    if (typeof window.resetToHome === 'function') window.resetToHome();
    
    document.getElementById('album-grid').classList.remove('active');
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    
    document.querySelectorAll('.software-nav').forEach((n) => n.classList.add('hidden'));
    document.querySelectorAll('.software-link').forEach((l) => l.classList.remove('active'));
    
    document.getElementById('pdf-works').classList.add('active');
};

(function () {
    'use strict';

    /* ---------- HERE IS YOUR PDF FILE SECURELY LINKED ---------- */
    const PDF_WORKS = [
        { 
            title: 'Simba Corp Prep Guide', 
            subtitle: 'Preparation Document', 
            file: 'simba-corp-prep-guide.pdf' 
        }
    ];

    const $ = (id) => document.getElementById(id);
    const section = $('pdf-works'), grid = $('pdf-grid'), viewer = $('pdf-viewer'), stage = $('pdf-stage');
    
    if (!section || !viewer) return;

    const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;

    let pdfDoc = null, flip = null, pageEls = [], current = null, token = 0, ratio = 1.414;
    const rendered = new Set(), rendering = new Set();

    /* ---------- Build the PDF Thumbnail Card ---------- */
    function buildGrid() {
        if (!PDF_WORKS.length) {
            grid.innerHTML = '<p class="pdf-empty" style="color: white;">PDF works coming soon.</p>';
            return;
        }
        
        const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                io.unobserve(en.target);
                loadThumb(en.target._item, en.target.querySelector('.pdf-thumb'));
            });
        }, { rootMargin: '200px' }) : null;

        PDF_WORKS.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'pdf-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.innerHTML = '<div class="pdf-thumb"></div><div class="pdf-card-title"></div><div class="pdf-card-sub"></div>';
            card.querySelector('.pdf-card-title').textContent = item.title || 'Untitled';
            card.querySelector('.pdf-card-sub').textContent = item.subtitle || '';
            card._item = item;
            
            card.addEventListener('click', () => openPdf(item));
            grid.appendChild(card);
            io ? io.observe(card) : loadThumb(item, card.querySelector('.pdf-thumb'));
        });
    }

    async function loadThumb(item, el) {
        try {
            if (item.cover) {
                const img = new Image();
                img.src = item.cover;
                el.appendChild(img);
            } else {
                const doc = await pdfjsLib.getDocument(item.file).promise;
                const page = await doc.getPage(1);
                const base = page.getViewport({ scale: 1 });
                const vp = page.getViewport({ scale: 520 / base.width });
                const c = document.createElement('canvas');
                c.width = vp.width; c.height = vp.height;
                await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
                el.appendChild(c);
                doc.destroy();
            }
            el.classList.add('loaded');
        } catch (e) {
            el.textContent = 'Preview unavailable';
        }
    }

    /* ---------- Viewer Logic ---------- */
    function setLoading(show, text, isError) {
        const box = $('pdf-loading');
        if(box) {
            box.classList.toggle('show', !!show);
            box.classList.toggle('error', !!isError);
            const textEl = $('pdf-loading-text');
            if(textEl) textEl.textContent = text || '';
        }
    }

    function teardown() {
        try { if (flip) flip.destroy(); } catch (e) {}
        flip = null;
        stage.innerHTML = '';
        pageEls = [];
        rendered.clear(); rendering.clear();
        if (pdfDoc) { pdfDoc.destroy(); pdfDoc = null; }
    }

    async function openPdf(item) {
        if (!window.pdfjsLib || !window.St) { alert('PDF viewer is still loading, please wait a second and try again.'); return; }
        teardown();
        const my = ++token;
        current = item;
        
        const titleEl = $('pdf-title');
        if(titleEl) titleEl.textContent = item.title || '';
        
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        setLoading(true, 'Loading...');
        
        try {
            const task = pdfjsLib.getDocument(item.file);
            task.onProgress = (p) => {
                if (my === token && p.total) setLoading(true, 'Loading ' + Math.round((p.loaded / p.total) * 100) + '%');
            };
            const doc = await task.promise;
            if (my !== token) { doc.destroy(); return; }
            pdfDoc = doc;
            const first = await doc.getPage(1);
            const vp = first.getViewport({ scale: 1 });
            ratio = vp.height / vp.width;
            buildBook(doc.numPages);
            setLoading(false);
        } catch (e) {
            if (my === token) setLoading(true, 'Could not load this PDF.', true);
        }
    }

    function buildBook(n) {
        const book = document.createElement('div');
        book.className = 'pdf-book';
        stage.appendChild(book);

        pageEls = [];
        for (let i = 0; i < n; i++) {
            const p = document.createElement('div');
            p.className = 'pdf-page';
            if (i === 0 || i === n - 1) p.dataset.density = 'hard';
            pageEls.push(p);
        }

        flip = new St.PageFlip(book, {
            width: 400, height: Math.round(400 * ratio),
            size: 'stretch',
            minWidth: 240, maxWidth: 1100,
            minHeight: Math.round(240 * ratio), maxHeight: Math.round(1100 * ratio),
            showCover: true, usePortrait: true,
            drawShadow: true, maxShadowOpacity: 0.45,
            flippingTime: 700, mobileScrollSupport: false
        });
        flip.loadFromHTML(pageEls);

        const slider = $('pdf-slider');
        if(slider) { slider.max = n; slider.value = 1; }

        flip.on('flip', (e) => sync(e.data));
        flip.on('changeOrientation', () => sync(flip.getCurrentPageIndex()));
        sync(0);
    }

    function sync(idx) {
        if (!pdfDoc || !flip) return;
        const n = pdfDoc.numPages;
        const spread = flip.getOrientation() === 'landscape' && idx > 0 && idx < n - 1;
        
        const counter = $('pdf-counter');
        if(counter) counter.textContent = (spread ? (idx + 1) + '-' + (idx + 2) : (idx + 1)) + ' / ' + n;
        
        const slider = $('pdf-slider');
        if(slider) slider.value = idx + 1;
        
        [0, 1, 2, -1, 3, 4, -2, 5].forEach((o) => renderPage(idx + o));
        rendered.forEach((r) => { if (Math.abs(r - idx) > 14) freePage(r); });
    }

    async function renderPage(j) {
        if (!pdfDoc || j < 0 || j >= pdfDoc.numPages || rendered.has(j) || rendering.has(j)) return;
        rendering.add(j);
        const doc = pdfDoc;
        try {
            const page = await doc.getPage(j + 1);
            const base = page.getViewport({ scale: 1 });
            const vp = page.getViewport({ scale: Math.min(2.5, 1200 / base.width) });
            const c = document.createElement('canvas');
            c.width = vp.width; c.height = vp.height;
            await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
            if (doc !== pdfDoc) return;
            pageEls[j].replaceChildren(c);
            rendered.add(j);
        } catch (e) {}
        finally { rendering.delete(j); }
    }

    function freePage(j) {
        const c = pageEls[j] && pageEls[j].firstChild;
        if (c) { c.width = 0; c.height = 0; }
        if (pageEls[j]) pageEls[j].replaceChildren();
        rendered.delete(j);
    }

    function closePdf() {
        if (!viewer.classList.contains('active')) return;
        const d = document;
        if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
        token++;
        const t = token;
        viewer.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { if (t === token) teardown(); }, 350);
    }

    /* ---------- Button Listeners ---------- */
    const closeBtn = $('pdf-close');
    if(closeBtn) closeBtn.addEventListener('click', closePdf);

    const prevBtn = $('pdf-prev');
    if(prevBtn) prevBtn.addEventListener('click', () => flip && flip.flipPrev());

    const nextBtn = $('pdf-next');
    if(nextBtn) nextBtn.addEventListener('click', () => flip && flip.flipNext());

    const sliderEl = $('pdf-slider');
    if(sliderEl) sliderEl.addEventListener('input', (e) => {
        if (!flip) return;
        flip.turnToPage(parseInt(e.target.value, 10) - 1);
        sync(flip.getCurrentPageIndex());
    });

    // Make the existing navigation safely close the PDF viewer
    if (typeof window.resetToHome === 'function') {
        const original = window.resetToHome;
        window.resetToHome = function () {
            closePdf();
            section.classList.remove('active');
            return original.apply(this, arguments);
        };
    }

    // Finally, build the grid!
    buildGrid();

})();
