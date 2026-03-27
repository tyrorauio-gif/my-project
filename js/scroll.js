// ========== ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ==========
(function () {

    // ===== FALLBACK ДАННЫЕ =====
    const fallbackMaterials = [
        {
            image: "images/ege.jpg",
            title: "Подготовка к ЕГЭ",
            description: "Сборник заданий, разбор сложных тем, рекомендации по подготовке к экзамену.",
            link: "materials.html"
        },
        {
            image: "images/math.jpg",
            title: "Высшая математика. 5-9 класс",
            description: "Правила, упражнения, тесты для закрепления материала.",
            link: "materials.html"
        },
        {
            image: "images/tests.jpg",
            title: "Курсы. Список тестов",
            description: "Список заданий для внеклассной работы по классам.",
            link: "materials.html"
        },
        {
            image: "images/video.jpg",
            title: "Видеоуроки",
            description: "Подборка лучших видеоуроков для самостоятельного изучения.",
            link: "materials.html"
        }
    ];

    const fallbackNews = [
        {
            image: "images/news-birthday.jpg",
            title: "26 марта",
            description: "Сегодня замечательный праздник и лучший день на свете!",
            link: "news/article1.html"
        },
        {
            image: "images/news-exam.jpg",
            title: "20 марта",
            description: "Обновлен список материалов для подготовки к ЕГЭ.",
            link: "news/article2.html"
        },
        {
            image: "images/news-olympiad.jpg",
            title: "15 марта",
            description: "Поздравляем призеров городской олимпиады!",
            link: "news/article3.html"
        },
        {
            image: "images/news-video.jpg",
            title: "10 апреля",
            description: "Новый видеоурок по интегралам.",
            link: "news/article4.html"
        }
    ];

    // ===== ЗАГРУЗКА HTML =====
    async function fetchPage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error();
            return await response.text();
        } catch (e) {
            console.warn(`⚠️ Не удалось загрузить ${url}`);
            return null;
        }
    }

    // ===== СОЗДАНИЕ КАРТОЧКИ =====
    function createCard(item) {
        return `
            <div class="card-horizontal">
                <div class="card-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.link}" class="card-link">Подробнее →</a>
            </div>
        `;
    }

    // ===== ПАРСИНГ МАТЕРИАЛОВ =====
    function parseMaterials(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        return [...doc.querySelectorAll('[data-material-id]')].map(card => ({
            image: card.querySelector('[data-material-image]')?.src || '',
            title: card.querySelector('[data-material-title]')?.textContent.trim() || '',
            description: card.querySelector('[data-material-desc]')?.textContent.trim() || '',
            link: "materials.html"
        }));
    }

    // ===== ПАРСИНГ НОВОСТЕЙ =====
    function parseNews(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        return [...doc.querySelectorAll('[data-news-id]')].map(item => {
            const bg = item.querySelector('[data-news-image]')?.style.backgroundImage;
            const image = bg ? bg.slice(5, -2) : '';

            return {
                image,
                title: item.querySelector('[data-news-title]')?.textContent.trim() || '',
                description: item.querySelector('[data-news-desc]')?.textContent.trim() || '',
                link: item.querySelector('[data-news-link]')?.getAttribute('href') || '#'
            };
        });
    }

    // ===== ОСНОВНАЯ ФУНКЦИЯ =====
    async function init() {
        console.log("🚀 Загрузка данных...");

        let materials = [];
        let news = [];

        // --- МАТЕРИАЛЫ ---
        const materialsHtml = await fetchPage('materials.html');
        if (materialsHtml) {
            materials = parseMaterials(materialsHtml);
        }
        if (!materials.length) {
            console.warn("⚠️ Используем fallback материалы");
            materials = fallbackMaterials;
        }

        // --- НОВОСТИ ---
        const newsHtml = await fetchPage('news.html');
        if (newsHtml) {
            news = parseNews(newsHtml);
        }
        if (!news.length) {
            console.warn("⚠️ Используем fallback новости");
            news = fallbackNews;
        }

        // --- ВСТАВКА ---
        const materialsContainer = document.getElementById('materials-scroll');
        const newsContainer = document.getElementById('news-scroll');

        if (materialsContainer) {
            materialsContainer.innerHTML = materials.map(createCard).join('');
            console.log("📚 Материалы загружены");
        } else {
            console.error("❌ materials-scroll не найден");
        }

        if (newsContainer) {
            newsContainer.innerHTML = news.map(createCard).join('');
            console.log("📰 Новости загружены");
        } else {
            console.error("❌ news-scroll не найден");
        }
    }

    // ===== ЗАПУСК =====
    document.addEventListener('DOMContentLoaded', init);

})();