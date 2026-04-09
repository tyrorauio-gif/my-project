/**
 * ============================================
 * ОСНОВНЫЕ ФУНКЦИИ САЙТА
 * ============================================
 */

// ========== КОНСТАНТЫ ==========
const SCROLL_THRESHOLD = 300;
const BUTTON_OFFSETS = { theme: 90, scroll: 30 };
const EASING_FN = function easeInOutCubic(progress) {
    return progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

// ========== КЭШИРОВАННЫЕ ЭЛЕМЕНТЫ ==========
let modal = null;
let modalImg = null;
let scrollToTopBtn = null;
let themeToggle = null;
let footer = null;

// ========== МОДАЛЬНОЕ ОКНО ДЛЯ ИЗОБРАЖЕНИЙ ==========

/**
 * Преобразует background-image URL в обычный URL
 * @param {string} bgImage - строка background-image
 * @returns {string} чистый URL
 */
function getUrlFromBackgroundImage(bgImage) {
    return bgImage.slice(5, -2);
}

/**
 * Открывает модальное окно с изображением
 * @param {string} imgSrc - src изображения для показа
 */
function openModal(imgSrc) {
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = imgSrc;
        document.body.style.overflow = "hidden";
    }
}

/**
 * Закрывает модальное окно
 */
function closeModal() {
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ========== КНОПКА "НАВЕРХ" ==========

/**
 * Проверяет позицию скролла и показывает/скрывает кнопку "наверх"
 */
function checkScrollPosition() {
    if (scrollToTopBtn) {
        const isScrolled = window.pageYOffset > SCROLL_THRESHOLD;
        scrollToTopBtn.classList.toggle('show', isScrolled);
    }
}

/**
 * Плавная прокрутка страницы вверх
 */
function smoothScrollToTop() {
    if (window.pageYOffset === 0) return;
    
    const startPosition = window.pageYOffset;
    const duration = 1200;
    const startTime = performance.now();
    
    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = EASING_FN(progress);
        
        window.scrollTo(0, startPosition * (1 - easeProgress));
        
        if (elapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// ========== КНОПКИ НЕ НАЕЗЖАЮТ НА ПОДВАЛ ==========

/**
 * Обновляет позиции кнопок, чтобы они не наезжали на подвал
 */
function updateButtonPositions() {
    if (!footer) return;
    
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const isFooterVisible = footerRect.top < windowHeight;
    
    if (isFooterVisible) {
        const visibleFooterHeight = Math.min(footer.offsetHeight, windowHeight - footerRect.top);
        
        if (visibleFooterHeight > 0) {
            const liftAmount = visibleFooterHeight + 15;
            
            if (themeToggle) {
                themeToggle.style.bottom = (BUTTON_OFFSETS.theme + liftAmount) + 'px';
            }
            if (scrollToTopBtn && scrollToTopBtn.classList.contains('show')) {
                scrollToTopBtn.style.bottom = (BUTTON_OFFSETS.scroll + liftAmount) + 'px';
            }
            return;
        }
    }
    
    // Сброс позиций, если футер не виден
    if (themeToggle) themeToggle.style.bottom = BUTTON_OFFSETS.theme + 'px';
    if (scrollToTopBtn) scrollToTopBtn.style.bottom = BUTTON_OFFSETS.scroll + 'px';
}

function handleScrollForButtons() {
    checkScrollPosition();
    updateButtonPositions();
}

// ========== ОПРЕДЕЛЕНИЕ АКТИВНОЙ СТРАНИЦЫ В МЕНЮ ==========

/**
 * Устанавливает активный класс в меню навигации в зависимости от текущей страницы
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    const isMainPage = currentPath === '/' || currentPath === '' || currentPath.endsWith('/index.html');
    const isMaterialsPage = currentPath.includes('materials.html');
    const isNewsPage = currentPath.includes('news.html');
    const isNewsArticle = currentPath.includes('/news/');
    const isContactsPage = currentPath.includes('contacts.html');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        
        if (isMainPage && (linkPath === 'index.html' || linkPath === '#')) {
            link.classList.add('active');
        } else if (linkPath === 'materials.html' && isMaterialsPage) {
            link.classList.add('active');
        } else if (linkPath === 'news.html' && (isNewsPage || isNewsArticle)) {
            link.classList.add('active');
        } else if (linkPath === 'contacts.html' && isContactsPage) {
            link.classList.add('active');
        }
    });
}

// ========== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ==========

/**
 * Включает темную тему
 */
function enableDarkTheme() {
    document.body.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
}

/**
 * Выключает темную тему (включает светлую)
 */
function disableDarkTheme() {
    document.body.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
}

/**
 * Устанавливает тему в зависимости от параметра
 * @param {boolean} isDark - true для темной темы, false для светлой
 */
function setTheme(isDark) {
    if (isDark) {
        enableDarkTheme();
    } else {
        disableDarkTheme();
    }
}

// ========== ОБРАБОТЧИКИ ИЗОБРАЖЕНИЙ ==========

/**
 * Назначает обработчики для изображений в карточках
 */
function initImageHandlers() {
    const cardImages = document.querySelectorAll('.card-image img');
    cardImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(img.src);
        });
    });
    
    const newsImages = document.querySelectorAll('.news-image');
    newsImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgUrl = getUrlFromBackgroundImage(img.style.backgroundImage);
            openModal(imgUrl);
        });
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

/**
 * Главная функция инициализации страницы
 */
function initAll() {
    // Кэшируем элементы
    modal = document.querySelector('.modal');
    modalImg = document.getElementById('modalImage');
    scrollToTopBtn = document.getElementById('scrollToTopBtn');
    themeToggle = document.getElementById('themeToggle');
    footer = document.querySelector('.footer');
    
    setActiveNavLink();
    initImageHandlers();
    
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');
    
    // Обработчики событий
    window.addEventListener('scroll', handleScrollForButtons);
    window.addEventListener('resize', updateButtonPositions);
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollToTop();
        });
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTheme(!document.body.classList.contains('dark'));
        });
    }
    
    // Начальная проверка позиции
    checkScrollPosition();
    setTimeout(updateButtonPositions, 100);
}

// Запускаем инициализацию после полной загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}