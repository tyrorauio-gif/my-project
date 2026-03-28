// ========== ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА ==========
(function () {

    async function fetchPage(url) {
        try {
            const res = await fetch(url);
            return await res.text();
        } catch {
            return null;
        }
    }

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

    async function loadData() {

        // ===== МАТЕРИАЛЫ =====
        const materialsHtml = await fetchPage('./materials.html');
        let materials = [];

        if (materialsHtml) {
            const doc = new DOMParser().parseFromString(materialsHtml, 'text/html');

            materials = [...doc.querySelectorAll('.card')].map(card => ({
                image: card.querySelector('img')?.src || '',
                title: card.querySelector('h3')?.textContent || '',
                description: card.querySelector('p')?.textContent || '',
                link: 'materials.html'
            }));
        }

        // ===== НОВОСТИ =====
        const newsHtml = await fetchPage('./news.html');
        let news = [];

        if (newsHtml) {
            const doc = new DOMParser().parseFromString(newsHtml, 'text/html');

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

        // ===== ВСТАВКА =====
        const matEl = document.getElementById('materials-scroll');
        const newsEl = document.getElementById('news-scroll');

        if (matEl) matEl.innerHTML = materials.map(createCard).join('');
        if (newsEl) newsEl.innerHTML = news.map(createCard).join('');
    }

    document.addEventListener('DOMContentLoaded', loadData);

})();