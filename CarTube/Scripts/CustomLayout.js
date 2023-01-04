// Custom style
let head = document.head;
let css = document.createElement('style');
css.type = "text/css";
css.innerHTML = `
    .ytp-impression-link {
        display: none;
    }
    .ytp-pause-overlay {
        display: none;
    }
    .ytp-right-controls {
        display: none;
    }
    .ytp-ce-element {
        display: none;
    }
    .ytp-large-play-button {
        display: none;
    }
    .ytp-cued-thumbnail-overlay {
        display: none;
    }
`
head.appendChild(css);

if (location.href.toString().includes("youtube.com/embed")) {
    
} else if (location.href.toString().includes("youtube.com")) {
    // Fix for UIScrollView's aggressive scroll button placement
    // Set webView.scrollView.isScrollEnabled = false and use this code
    let isDown = false;
    let startY;
    let didScroll = false;
    window.addEventListener('touchstart', (e) => {
        isDown = true;
        startY = e.touches[0].clientY;
    });
    window.addEventListener('touchend', (e) => {
        isDown = false;
        // prevent unintentional clicking
        if (didScroll) {
            e.preventDefault()
            didScroll = false;
        }
    });
    window.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const y = e.touches[0].clientY;
        const walk = y - startY;
        if (walk > 10) {
            window.scrollBy({
              top: -200,
              behavior: 'smooth'
            })
            didScroll = true;
            isDown = false; // only scroll one at a time
        } else if (walk < -10) {
            window.scrollBy({
              top: 200,
              behavior: 'smooth'
            })
            didScroll = true;
            isDown = false; // only scroll one at a time
        }
    });
    
    // URL change detect
    let previousUrl = '';
    const observer = new MutationObserver(function(mutations) {
        if (location.href !== previousUrl) {
            // Check if we're on a watch page
            const regex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.|www\.|)(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if (regex.test(location.href)) {
                const id = location.href.match(regex)[1]
                window.open("https://www.youtube.com/embed/" + id)
            } else {
                previousUrl = location.href;
            }
        }
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);
}

window.addEventListener("focus", e => {
    if (e.target.tagName === "INPUT") {
        window.webkit.messageHandlers.keyboard.postMessage("show")
    }
}, true)

window.addEventListener("blur", e => {
    if (e.target.tagName === "INPUT") {
        window.webkit.messageHandlers.keyboard.postMessage("hide")
    }
}, true)
