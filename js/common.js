// ========== МОДАЛЬНОЕ ОКНО ==========
function openModal(imgElement) {
    var modal = document.getElementById('photoModal');
    var modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = imgElement.src;
        document.body.style.overflow = "hidden";
    }
}

function closeModal() {
    var modal = document.getElementById('photoModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ========== КНОПКА "НАВЕРХ" ==========
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function checkScrollPosition() {
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
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

// ========== КНОПКИ НЕ НАЕЗЖАЮТ НА ПОДВАЛ ==========
const themeBtn = document.getElementById('themeToggle');
const scrollBtn = document.getElementById('scrollToTopBtn');
const footer = document.querySelector('.footer');

let originalThemeBottom = 90;
let originalScrollBottom = 30;

function updateButtonPositions() {
    if (!footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (footerRect.top < windowHeight) {
        const visibleFooterHeight = Math.min(footer.offsetHeight, windowHeight - footerRect.top);
        
        if (visibleFooterHeight > 0) {
            const liftAmount = visibleFooterHeight + 15;
            
            if (themeBtn) {
                themeBtn.style.bottom = (originalThemeBottom + liftAmount) + 'px';
            }
            if (scrollBtn && scrollBtn.classList.contains('show')) {
                scrollBtn.style.bottom = (originalScrollBottom + liftAmount) + 'px';
            }
        } else {
            if (themeBtn) themeBtn.style.bottom = originalThemeBottom + 'px';
            if (scrollBtn) scrollBtn.style.bottom = originalScrollBottom + 'px';
        }
    } else {
        if (themeBtn) themeBtn.style.bottom = originalThemeBottom + 'px';
        if (scrollBtn) scrollBtn.style.bottom = originalScrollBottom + 'px';
    }
}

function handleScrollForButtons() {
    checkScrollPosition();
    updateButtonPositions();
}

window.addEventListener('scroll', handleScrollForButtons);
window.addEventListener('resize', updateButtonPositions);
setTimeout(() => {
    updateButtonPositions();
}, 100);

// ========== ОПРЕДЕЛЕНИЕ АКТИВНОЙ СТРАНИЦЫ ==========
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPath = link.getAttribute('href');
        
        if ((currentPath === '/' || currentPath === '' || currentPath.endsWith('/index.html')) && 
            (linkPath === 'index.html' || linkPath === '#')) {
            link.classList.add('active');
        }
        else if (linkPath === 'materials.html' && currentPath.includes('materials.html')) {
            link.classList.add('active');
        }
        else if (linkPath === 'news.html' && currentPath.includes('news.html')) {
            link.classList.add('active');
        }
        else if (currentPath.includes('/news/') && linkPath === 'news.html') {
            link.classList.add('active');
        }
        else if (linkPath === 'contacts.html' && currentPath.includes('contacts.html')) {
            link.classList.add('active');
        }
    });
}

// ========== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ==========
const themeToggle = document.getElementById('themeToggle');

function getDarkThemePath() {
    if (window.location.pathname.includes('/news/')) {
        return '../css/dark-theme.css';
    }
    return 'css/dark-theme.css';
}

function enableDarkTheme() {
    if (document.getElementById('darkTheme')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getDarkThemePath();
    link.id = 'darkTheme';
    document.head.appendChild(link);
    document.body.classList.add('dark');
}

function disableDarkTheme() {
    const darkTheme = document.getElementById('darkTheme');
    if (darkTheme) {
        darkTheme.remove();
    }
    document.body.classList.remove('dark');
}

function setTheme(isDark) {
    if (isDark) {
        enableDarkTheme();
        if (themeToggle) themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        disableDarkTheme();
        if (themeToggle) themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setTheme(true);
} else {
    setTheme(false);
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark');
        setTheme(!isDark);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
    
    // Добавляем обработчики для изображений с классом card-image
    const cardImages = document.querySelectorAll('.card-image img');
    cardImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openModal(this);
        });
    });
    
    // Добавляем обработчики для новостных изображений
    const newsImages = document.querySelectorAll('.news-image');
    newsImages.forEach(img => {
        img.addEventListener('click', function() {
            const modalImg = document.getElementById('modalImage');
            if (modalImg) {
                modalImg.src = this.style.backgroundImage.slice(5, -2);
                openModal(modalImg);
            }
        });
    });
});