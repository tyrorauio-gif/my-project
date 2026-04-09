/**
 * ============================================
 * ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ДЛЯ КАРТОЧЕК
 * ============================================
 */

/**
 * Асинхронно загружает HTML страницы
 * @param {string} url - URL страницы для загрузки
 * @returns {Promise<string|null>} HTML содержимое страницы или null при ошибке
 */
async function fetchPage(url) {
    try {
        const res = await fetch(url);
        return await res.text();
    } catch {
        return null;
    }
}

/**
 * Создает HTML карточки для горизонтального скролла
 * @param {Object} item - объект с данными карточки
 * @returns {string} HTML разметка карточки
 */
function createCard(item) {
    return `
        <div class="card-horizontal">
            <div class="card-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${item.link}" class="card-link">Открыть</a>
        </div>
    `;
}

/**
 * Загружает данные о материалах и новостях со страниц materials.html и news.html
 * и вставляет их в горизонтальные скроллы на главной странице
 */
async function loadData() {

    // ===== ЗАГРУЗКА МАТЕРИАЛОВ =====
    const materialsHtml = await fetchPage('./materials.html');
    let materials = [];

    if (materialsHtml) {
        const doc = new DOMParser().parseFromString(materialsHtml, 'text/html');
        // Извлекаем данные из карточек на странице материалов
        materials = [...doc.querySelectorAll('.card')].map(card => ({
            image: card.querySelector('img')?.src || '',
            title: card.querySelector('h3')?.textContent || '',
            description: card.querySelector('p')?.textContent || '',
            link: 'materials.html'
        }));
    }

    // ===== ЗАГРУЗКА НОВОСТЕЙ =====
    const newsHtml = await fetchPage('./news.html');
    let news = [];

    if (newsHtml) {
        const doc = new DOMParser().parseFromString(newsHtml, 'text/html');
        // Извлекаем данные из новостей на странице новостей
        news = [...doc.querySelectorAll('.news-item-main')].map(item => {
            const style = item.querySelector('.news-image')?.style.backgroundImage;
            return {
                image: style?.slice(5, -2) || '',
                title: item.querySelector('.news-title-main')?.textContent || '',
                description: item.querySelector('.news-excerpt')?.textContent || '',
                link: item.querySelector('a')?.href || '#'
            };
        });
    }

    // ===== ВСТАВКА В ГОРИЗОНТАЛЬНЫЕ СКРОЛЛЫ =====
    const matEl = document.getElementById('materials-scroll');
    const newsEl = document.getElementById('news-scroll');

    if (matEl) matEl.innerHTML = materials.map(createCard).join('');
    if (newsEl) newsEl.innerHTML = news.map(createCard).join('');
}

// Загружаем данные после загрузки DOM
document.addEventListener('DOMContentLoaded', loadData);