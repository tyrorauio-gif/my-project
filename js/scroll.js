// ========== ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ==========
(function() {
    // Встроенные данные (всегда работают)
    const materialsData = [
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

    const newsData = [
        {
            image: "images/news-birthday.jpg",
            title: "26 марта",
            description: "Сегодня замечательный праздник и лучший день на свете, а именно мой день рождения! Приходите с коньяком и конфетами на мои лекции...",
            link: "news/article1.html"
        },
        {
            image: "images/news-exam.jpg",
            title: "20 марта",
            description: "Обновлен список материалов для подготовки к ЕГЭ. Новые задания и видеоуроки уже доступны в разделе 'Полезные материалы'.",
            link: "news/article2.html"
        },
        {
            image: "images/news-olympiad.jpg",
            title: "15 марта",
            description: "Поздравляем призеров городской олимпиады по высшей математике! Молодцы! Так держать!",
            link: "news/article3.html"
        },
        {
            image: "images/news-video.jpg",
            title: "10 апреля",
            description: "Вышел новый видеоурок, в котором подробно разбираются методы интегрирования и решение задач из ЕГЭ...",
            link: "news/article4.html"
        }
    ];

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

    function loadAndDisplay() {
        console.log('🚀 Загрузка данных...');
        
        // Материалы
        const materialsScroll = document.getElementById('materials-scroll');
        if (materialsScroll) {
            materialsScroll.innerHTML = materialsData.slice(0, 3).map(createCard).join('');
            console.log('📚 Материалы отображены');
        } else {
            console.error('❌ Контейнер materials-scroll не найден');
        }
        
        // Новости
        const newsScroll = document.getElementById('news-scroll');
        if (newsScroll) {
            newsScroll.innerHTML = newsData.slice(0, 3).map(createCard).join('');
            console.log('📰 Новости отображены');
        } else {
            console.error('❌ Контейнер news-scroll не найден');
        }
    }

    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAndDisplay);
    } else {
        loadAndDisplay();
    }
})();