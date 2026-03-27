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

// ========== УНИВЕРСАЛЬНЫЕ КНОПКИ ОТКРЫТИЯ PDF ==========
function openPDFInNewWindow(url) {
    console.log('📄 Открываю PDF:', url);
    // Открываем PDF в новой вкладке/окне
    window.open(url, '_blank');
}

function checkLocalFileAndOpen(localPath, onlineUrl) {
    console.log('🔍 Проверка локального файла:', localPath);
    
    // Получаем полный URL относительно текущей страницы
    let fullLocalPath = localPath;
    
    // Если путь начинается с /, убираем его для относительного пути
    if (fullLocalPath.startsWith('/')) {
        fullLocalPath = fullLocalPath.substring(1);
    }
    
    console.log('📁 Полный путь для проверки:', fullLocalPath);
    
    // Добавляем случайный параметр, чтобы избежать кэширования при проверке
    const checkUrl = fullLocalPath + '?t=' + Date.now();
    
    fetch(checkUrl, { 
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors' // Добавляем no-cors для обхода CORS
    })
    .then(response => {
        console.log('✅ Статус ответа:', response.status);
        // При no-cors response.status всегда 0, но это нормально
        // Мы не можем точно определить статус, но если fetch выполнился без ошибки,
        // значит файл существует (или сервер вернул что-то)
        console.log('✅ Локальный файл, вероятно, существует! Открываю:', fullLocalPath);
        openPDFInNewWindow(fullLocalPath);
    })
    .catch(error => {
        console.error('❌ Ошибка при проверке локального файла:', error);
        // Если произошла ошибка, файл скорее всего не существует
        console.log('❌ Локальный файл не найден, использую онлайн-ссылку');
        useOnlineFallback(onlineUrl, localPath);
    });
    
    // Устанавливаем таймаут на случай, если fetch зависнет
    setTimeout(() => {
        console.log('⏰ Таймаут проверки локального файла');
        useOnlineFallback(onlineUrl, localPath);
    }, 3000);
}

function useOnlineFallback(onlineUrl, localPath) {
    if (onlineUrl && onlineUrl !== '' && onlineUrl !== '#' && onlineUrl !== '.pdf') {
        console.log('🌐 Использую онлайн-ссылку:', onlineUrl);
        openPDFInNewWindow(onlineUrl);
    } else {
        console.error('❌ Нет доступной онлайн-ссылки для:', localPath);
        alert('Файл временно недоступен. Пожалуйста, попробуйте позже или обратитесь к администратору.');
    }
}

function initDownloadLinks() {
    console.log('🚀 Инициализация PDF-кнопок...');
    const downloadLinks = document.querySelectorAll('.download-link');
    console.log('📊 Найдено кнопок:', downloadLinks.length);
    
    if (downloadLinks.length === 0) {
        console.warn('⚠️ Не найдено кнопок с классом .download-link');
        return;
    }
    
    downloadLinks.forEach((link, index) => {
        // Убираем старые обработчики, клонируя элемент
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const localPath = this.getAttribute('data-local');
            const onlineUrl = this.getAttribute('data-online');
            
            console.log(`\n=== Обработка клика (кнопка ${index + 1}) ===`);
            console.log('📁 Локальный путь:', localPath);
            console.log('🌐 Онлайн ссылка:', onlineUrl);
            
            // Если нет data-local и data-online, значит это обычная ссылка
            if (!localPath && (!onlineUrl || onlineUrl === '#')) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
                return;
            }
            
            // Проверяем локальный файл (если указан)
            if (localPath && localPath !== '' && localPath !== '#') {
                checkLocalFileAndOpen(localPath, onlineUrl);
            } 
            // Если только онлайн-ссылка
            else if (onlineUrl && onlineUrl !== '' && onlineUrl !== '#' && onlineUrl !== '.pdf') {
                console.log('🌐 Только онлайн-ссылка, открываем...');
                openPDFInNewWindow(onlineUrl);
            } 
            else {
                alert('Нет доступного источника для открытия файла');
            }
        });
    });
    
    console.log('✅ Инициализация PDF-кнопок завершена');
}

// ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ==========
function initAll() {
    console.log('🚀 Инициализация страницы...');
    setActiveNavLink();
    initDownloadLinks();
    
    // Обработчики для изображений в карточках
    const cardImages = document.querySelectorAll('.card-image img');
    console.log('🖼️ Найдено изображений в карточках:', cardImages.length);
    cardImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openModal(this);
        });
    });
    
    // Обработчики для новостных изображений
    const newsImages = document.querySelectorAll('.news-image');
    console.log('📰 Найдено новостных изображений:', newsImages.length);
    newsImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const modalImg = document.getElementById('modalImage');
            if (modalImg) {
                modalImg.src = this.style.backgroundImage.slice(5, -2);
                openModal(modalImg);
            }
        });
    });
    
    console.log('✅ Инициализация страницы завершена');
}

// Запускаем инициализацию после полной загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}