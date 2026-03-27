// ========== ПОПУЛЯРНЫЕ СТАТЬИ ==========
// Единый источник данных для всех страниц
const popularPosts = [
    {
        date: "25 марта 2026",
        title: "С днем рождения! 🎂",
        url: "article1.html",
        isInternal: true,
        description: "Праздничная лекция и приятные сюрпризы для учеников"
    },
    {
        date: "20 марта 2026",
        title: "Обновление материалов для подготовки к ЕГЭ",
        url: "article2.html",
        isInternal: true,
        description: "Новые задания, видеоуроки и чек-листы уже доступны"
    },
    {
        date: "15 марта 2026",
        title: "Победа на городской олимпиаде! 🏆",
        url: "article3.html",
        isInternal: true,
        description: "Наши ученики показали блестящие результаты"
    },
    {
        date: "10 апреля 2026",
        title: "Новый видеоурок по интегралам",
        url: "article4.html",
        isInternal: true,
        description: "Разбор методов интегрирования и решение задач из ЕГЭ"
    },
    {
        date: "24 декабря 2024",
        title: "Что ждёт онлайн-образование в России в 2025 году",
        url: "https://example.com/online-education-2025",
        isInternal: false,
        description: "Анализ трендов и прогнозы развития"
    },
    {
        date: "14 января 2025",
        title: "Как онлайн-школе или эксперту получать бесплатный трафик в 2025 году",
        url: "https://example.com/free-traffic",
        isInternal: false,
        description: "Стратегии продвижения в новых реалиях"
    },
    {
        date: "10 февраля 2025",
        title: "Методология обучения: подходы и примеры",
        url: "https://example.com/teaching-methodology",
        isInternal: false,
        description: "Современные методы преподавания"
    },
    {
        date: "5 марта 2026",
        title: "Топ-10 ошибок на ЕГЭ по математике",
        url: "#",
        isInternal: false,
        description: "Как не потерять баллы на экзамене"
    },
    {
        date: "15 марта 2026",
        title: "Как подготовиться к олимпиаде за месяц",
        url: "#",
        isInternal: false,
        description: "Эффективная стратегия подготовки"
    }
];

// Настройка: сколько статей показывать (можно менять)
const SHOW_TOP_POSTS = 9;  // 9 статей (можно изменить на любое число, например 5, 10, 20)

// Единая функция для отображения популярных статей
function renderPopularPosts() {
    // Находим все контейнеры с классом popular-container
    const containers = document.querySelectorAll('.popular-container');
    
    if (containers.length === 0) {
        console.warn('⚠️ Не найдено контейнеров с классом popular-container');
        return;
    }
    
    // Создаем HTML для популярных статей
    let html = '<h3 class="sidebar-title">Популярное</h3>\n<ul class="popular-list">\n';
    
    // Берем нужное количество статей
    const postsToShow = popularPosts.slice(0, SHOW_TOP_POSTS);
    
    postsToShow.forEach(post => {
        const targetUrl = post.isInternal ? post.url : post.url;
        const targetAttr = post.isInternal ? '' : 'target="_blank" rel="noopener noreferrer"';
        
        html += `    <li>\n`;
        html += `        <span class="popular-date">${post.date}</span>\n`;
        html += `        <a href="${targetUrl}" class="popular-title" ${targetAttr}>${post.title}</a>\n`;
        html += `    </li>\n`;
    });
    
    html += '</ul>';
    
    // Вставляем одинаковый HTML во все контейнеры
    containers.forEach(container => {
        container.innerHTML = html;
    });
    
    console.log(`✅ Популярные статьи загружены (${containers.length} контейнеров, показано ${postsToShow.length} статей)`);
}

// Автоматическая загрузка при готовности DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPopularPosts);
} else {
    renderPopularPosts();
}