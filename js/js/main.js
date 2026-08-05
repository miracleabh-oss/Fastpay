/* ===========================================================
   FASTPAY — LOGIQUE & INTERACTIONS
   =========================================================== */

const SERVICES_DATA = [
    { id: '1', name: 'Netflix Premium 4K', category: 'streaming', price: 3500, icon: '🎬', badge: '🔥 Bestseller' },
    { id: '2', name: 'ChatGPT Plus (GPT-4o)', category: 'ia', price: 13500, icon: '🤖', badge: 'Populaire' },
    { id: '3', name: 'Spotify Individual 1 Mois', category: 'streaming', price: 2500, icon: '🎵', badge: '' },
    { id: '4', name: 'PlayStation Plus', category: 'gaming', price: 8000, icon: '🎮', badge: '' },
    { id: '5', name: 'Canal+ Evasion', category: 'streaming', price: 10000, icon: '📺', badge: '' },
    { id: '6', name: 'Claude Pro (Anthropic)', category: 'ia', price: 13500, icon: '🧠', badge: 'Nouveau' },
    { id: '7', name: 'Carte Gift App Store $10', category: 'cadeaux', price: 7000, icon: '🍏', badge: '' },
    { id: '8', name: 'Xbox Game Pass', category: 'gaming', price: 6500, icon: '🟢', badge: '' },
    { id: '9', name: 'Canva Pro 1 An', category: 'ia', price: 5000, icon: '🎨', badge: 'Promo' }
];

const COUNTRIES = [
    { name: "Bénin 🇧🇯", dial: "+229", placeholder: "97 00 00 00" },
    { name: "Côte d'Ivoire 🇨🇮", dial: "+225", placeholder: "07 00 00 00" },
    { name: "Sénégal 🇸🇳", dial: "+221", placeholder: "77 00 00 00" },
    { name: "Togo 🇹🇬", dial: "+228", placeholder: "90 00 00 00" }
];

let currentLang = 'fr';
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initI18n();
    initServices();
    initFilters();
    initSearch();
    initPhoneDemo();
    initFaqAccordion();
});

/* ---------- 1. TOGGLE THÈME (DARK / LIGHT) ---------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;
    
    const savedTheme = localStorage.getItem('fastpay_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('fastpay_theme', newTheme);
        themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
}

/* ---------- 2. TRADUCTIONS (i18n) ---------- */
function initI18n() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;

    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateTranslations();
    });
    updateTranslations();
}

function updateTranslations() {
    if (typeof TRANSLATIONS === 'undefined') return;
    const dict = TRANSLATIONS[currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict && dict[key]) el.textContent = dict[key];
    });

    renderServices();
}

/* ---------- 3. RENDU DES SERVICES ---------- */
function renderServices() {
    const grid = document.getElementById('service-grid');
    if (!grid) return;

    const searchInput = document.getElementById('search-input');
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = SERVICES_DATA.filter(item => {
        const matchesCat = (activeCategory === 'all' || item.category === activeCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchVal);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Aucun service trouvé.</p>`;
        return;
    }

    const buyText = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[currentLang]) ? TRANSLATIONS[currentLang].btn_buy : 'Acheter';

    grid.innerHTML = filtered.map(item => `
        <article class="service-card">
            ${item.badge ? `<span class="service-badge">${item.badge}</span>` : ''}
            <div class="service-icon">${item.icon}</div>
            <h4>${item.name}</h4>
            <div class="service-cat">${item.category.toUpperCase()}</div>
            <div class="service-price">
                <b>${item.price.toLocaleString()} XOF</b>
                <button type="button">${buyText}</button>
            </div>
        </article>
    `).join('');
}

function initServices() {
    renderServices();
}

/* ---------- 4. FILTRES & RECHERCHE ---------- */
function initFilters() {
    const buttons = document.querySelectorAll('#category-filters .tab');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-cat');
            renderServices();
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', renderServices);
    }
}

/* ---------- 5. DÉMO PAIMENT / INDICATIFS ---------- */
function initPhoneDemo() {
    const select = document.getElementById('country-select');
    const input = document.getElementById('phone-input');
    const preview = document.getElementById('phone-preview');

    if (!select || !input || !preview) return;

    select.innerHTML = COUNTRIES.map(c => 
        `<option value="${c.dial}" data-placeholder="${c.placeholder}">${c.name} (${c.dial})</option>`
    ).join('');

    function updatePreview() {
        const selectedOpt = select.options[select.selectedIndex];
        const dial = select.value;
        const val = input.value || selectedOpt.getAttribute('data-placeholder');
        preview.textContent = `${dial} ${val}`;
    }

    select.addEventListener('change', () => {
        const selectedOpt = select.options[select.selectedIndex];
        input.placeholder = selectedOpt.getAttribute('data-placeholder');
        updatePreview();
    });

    input.addEventListener('input', updatePreview);
}

/* ---------- 6. ACCORDÉON FAQ ---------- */
function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });
}