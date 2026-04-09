/**
 * ============================================
 * ПОПУЛЯРНЫЕ СТАТЬИ (САЙДБАР)
 * ============================================
 */

const popularPosts = [
    {
        date: "25 марта 2026",
        title: "С днем рождения! 🎂",
        url: "news/article1.html",
        isInternal: true
    },
    {
        date: "20 марта 2026",
        title: "Обновление материалов для подготовки к ЕГЭ",
        url: "news/article2.html",
        isInternal: true
    },
    {
        date: "15 марта 2026",
        title: "Победа на городской олимпиаде! 🏆",
        url: "news/article3.html",
        isInternal: true
    },
    {
        date: "10 апреля 2026",
        title: "Новый видеоурок по интегралам",
        url: "news/article4.html",
        isInternal: true
    },
    {
        date: "28 марта 2026",
        title: "Почему репетитор по математике — это инвестиция в будущее",
        url: "news/article5.html",
        isInternal: true
    },
    {
        date: "24 декабря 2024",
        title: "Что ждёт онлайн-образование в России в 2025 году",
        url: "https://example.com/online-education-2025",
        isInternal: false
    },
    {
        date: "14 января 2025",
        title: "Как онлайн-школе или эксперту получать бесплатный трафик в 2025 году",
        url: "https://example.com/free-traffic",
        isInternal: false
    },
    {
        date: "10 февраля 2025",
        title: "Методология обучения: подходы и примеры",
        url: "https://example.com/teaching-methodology",
        isInternal: false
    },
    {
        date: "5 марта 2026",
        title: "Топ-10 ошибок на ЕГЭ по математике",
        url: "#",
        isInternal: false
    }
];

const SHOW_TOP_POSTS = 9;

function renderPopularPosts() {
    const containers = document.querySelectorAll('.popular-container');
    
    if (containers.length === 0) {
        console.warn('⚠️ Не найдено контейнеров с классом popular-container');
        return;
    }
    
    let html = '<h3 class="sidebar-title">Популярное</h3>\n<ul class="popular-list">\n';
    
    const postsToShow = popularPosts.slice(0, SHOW_TOP_POSTS);
    
    postsToShow.forEach(post => {
        let targetUrl = post.url;

        // 🔥 фикс для вложенной папки /news/
        if (post.isInternal && window.location.pathname.includes('/news/')) {
            targetUrl = '../' + post.url;
        }

        const targetAttr = post.isInternal ? '' : 'target="_blank" rel="noopener noreferrer"';
        
        html += `    <li>\n`;
        html += `        <span class="popular-date">${post.date}</span>\n`;
        html += `        <a href="${targetUrl}" class="popular-title" ${targetAttr}>${post.title}</a>\n`;
        html += `    </li>\n`;
    });
    
    html += '</ul>';
    
    containers.forEach(container => {
        container.innerHTML = html;
    });
    
    console.log(`✅ Популярные статьи загружены`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPopularPosts);
} else {
    renderPopularPosts();
}