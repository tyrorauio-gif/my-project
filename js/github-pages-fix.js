// ========== ФИКС ДЛЯ GITHUB PAGES ==========
// Этот скрипт работает только на GitHub Pages и заменяет стандартную логику открытия PDF
// На локальном сервере и обычном хостинге используется основной скрипт

(function() {
    // Проверяем, находимся ли мы на GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (!isGitHubPages) {
        console.log('🌍 Обычный хостинг или локальный сервер - используем основной скрипт');
        return;
    }
    
    console.log('🐙 Обнаружен GitHub Pages - активируем специальный обработчик PDF');
    
    // Ждем полной загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGitHubPagesFix);
    } else {
        initGitHubPagesFix();
    }
    
    function initGitHubPagesFix() {
        console.log('🔧 Инициализация фикса для GitHub Pages...');
        
        // Находим все кнопки с классом download-link
        const downloadLinks = document.querySelectorAll('.download-link');
        console.log(`📊 Найдено кнопок PDF: ${downloadLinks.length}`);
        
        if (downloadLinks.length === 0) {
            console.warn('⚠️ Не найдено кнопок .download-link');
            return;
        }
        
        // Отключаем стандартные обработчики и добавляем свои
        downloadLinks.forEach((link, index) => {
            // Сохраняем оригинальные атрибуты
            const localPath = link.getAttribute('data-local');
            const onlineUrl = link.getAttribute('data-online');
            
            if (!localPath && !onlineUrl) return;
            
            console.log(`🔧 Настраиваю кнопку ${index + 1}: local="${localPath}", online="${onlineUrl}"`);
            
            // Создаем новый обработчик
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const localFile = this.getAttribute('data-local');
                const onlineFile = this.getAttribute('data-online');
                
                console.log(`\n=== GitHub Pages: клик по кнопке ${index + 1} ===`);
                console.log(`📁 Локальный файл: ${localFile}`);
                console.log(`🌐 Онлайн файл: ${onlineFile}`);
                
                // На GitHub Pages просто пытаемся открыть локальный файл
                // Если его нет - браузер покажет ошибку, тогда открываем онлайн
                if (localFile && localFile !== '' && localFile !== '#') {
                    console.log(`📄 Пробую открыть локальный файл: ${localFile}`);
                    
                    // Создаем скрытый iframe для проверки
                    const testFrame = document.createElement('iframe');
                    testFrame.style.display = 'none';
                    testFrame.style.position = 'absolute';
                    testFrame.style.width = '0';
                    testFrame.style.height = '0';
                    testFrame.style.border = 'none';
                    
                    let timeoutId;
                    let isOpened = false;
                    
                    const openOnline = () => {
                        if (isOpened) return;
                        isOpened = true;
                        if (timeoutId) clearTimeout(timeoutId);
                        document.body.removeChild(testFrame);
                        
                        if (onlineFile && onlineFile !== '' && onlineFile !== '#' && onlineFile !== '.pdf') {
                            console.log(`🌐 Открываю онлайн ссылку: ${onlineFile}`);
                            window.open(onlineFile, '_blank');
                        } else {
                            console.error('❌ Нет онлайн ссылки');
                            // Если нет онлайн ссылки, все равно пробуем открыть локальный
                            window.open(localFile, '_blank');
                        }
                    };
                    
                    testFrame.onload = function() {
                        if (isOpened) return;
                        
                        try {
                            // Пытаемся получить доступ к содержимому
                            const doc = testFrame.contentDocument || testFrame.contentWindow.document;
                            const bodyText = doc.body ? doc.body.innerText : '';
                            
                            // Проверяем, не страница ли это 404
                            if (bodyText.includes('404') || bodyText.includes('Not Found') || bodyText.includes('File not found')) {
                                console.log('❌ Получена страница 404');
                                openOnline();
                            } else {
                                console.log(`✅ Файл найден! Открываю: ${localFile}`);
                                isOpened = true;
                                if (timeoutId) clearTimeout(timeoutId);
                                document.body.removeChild(testFrame);
                                window.open(localFile, '_blank');
                            }
                        } catch(e) {
                            // Если CORS блокирует, пробуем открыть локальный
                            console.log(`⚠️ CORS блокирует проверку, пробую открыть: ${localFile}`);
                            isOpened = true;
                            if (timeoutId) clearTimeout(timeoutId);
                            document.body.removeChild(testFrame);
                            window.open(localFile, '_blank');
                        }
                    };
                    
                    testFrame.onerror = function() {
                        console.log('❌ Ошибка загрузки iframe');
                        openOnline();
                    };
                    
                    timeoutId = setTimeout(() => {
                        if (!isOpened) {
                            console.log('⏰ Таймаут, открываю онлайн ссылку');
                            openOnline();
                        }
                    }, 2000);
                    
                    testFrame.src = localFile + '?t=' + Date.now();
                    document.body.appendChild(testFrame);
                    
                } else if (onlineFile && onlineFile !== '' && onlineFile !== '#' && onlineFile !== '.pdf') {
                    console.log(`🌐 Открываю онлайн ссылку: ${onlineFile}`);
                    window.open(onlineFile, '_blank');
                } else {
                    alert('Файл временно недоступен');
                }
            });
        });
        
        console.log('✅ Фикс для GitHub Pages активирован');
    }
})();