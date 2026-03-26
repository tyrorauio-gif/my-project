// ========== МОДАЛЬНОЕ ОКНО ==========
function openModal(imgElement) {
    var modal = document.getElementById('photoModal');
    var modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imgElement.src;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById('photoModal').style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ========== КНОПКА "НАВЕРХ" ==========
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function checkScrollPosition() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}

window.addEventListener('scroll', checkScrollPosition);
checkScrollPosition();

function smoothScrollToTop() {
    if (window.pageYOffset > 0) {
        const startPosition = window.pageYOffset;
        const duration = 1200;
        const startTime = performance.now();
        
        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition * (1 - easeInOutCubic));
            
            if (elapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
}

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScrollToTop();
    });
}

// ========== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ==========
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

function enableDarkTheme() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/dark-theme.css';
    link.id = 'darkTheme';
    document.head.appendChild(link);
}

function disableDarkTheme() {
    const darkTheme = document.getElementById('darkTheme');
    if (darkTheme) {
        darkTheme.remove();
    }
}

if (savedTheme === 'dark') {
    enableDarkTheme();
    if (themeToggle) themeToggle.textContent = '☀️';
} else {
    if (themeToggle) themeToggle.textContent = '🌙';
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        if (document.querySelector('link[href="css/dark-theme.css"]')) {
            disableDarkTheme();
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            enableDarkTheme();
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });
}