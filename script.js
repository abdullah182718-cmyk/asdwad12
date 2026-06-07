/**
 * =====================================================
 * أذكاري - حصنك اليومي
 * سكربت الصفحة الرئيسية
 * =====================================================
 */

// ============ مصفوفة التصنيفات ============
const azkarCategories = [
    { id: 1, title: "أذكار الصباح", desc: "أذكار تقال في الصباح بعد الفجر", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "sunrise", url: "sabah.html" },
    { id: 2, title: "أذكار المساء", desc: "أذكار تقال في المساء بعد العصر", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "sunset", url: "masaa.html" },
    { id: 3, title: "أذكار بعد الصلاة", desc: "ما يقال عقب الصلوات المكتوبة", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "prayer", url: "after-prayer.html" },
    { id: 4, title: "تسابيح", desc: "سبحان الله والحمد لله والله أكبر", iconBg: "#e9f5f8", iconColor: "#2980b9", iconType: "star", url: "tasabih.html" },
    { id: 5, title: "أذكار النوم", desc: "أذكار تقال عند النوم", iconBg: "#eef1f6", iconColor: "#34495e", iconType: "moon", url: "sleep.html" },
    { id: 6, title: "أذكار الاستيقاظ", desc: "أذكار تقال عند الاستيقاظ من النوم", iconBg: "#fef9e7", iconColor: "#f39c12", iconType: "sun", url: "waking-up.html" },
    { id: 7, title: "جوامع الدعاء", desc: "أدعية جامعة مأثورة عن النبي ﷺ", iconBg: "#fdedec", iconColor: "#e74c3c", iconType: "heart", url: "jawame-alduaa.html" },
    { id: 8, title: "أدعية نبوية", desc: "أدعية واردة عن النبي ﷺ", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "book", url: "prophetic-dua.html" },
    { id: 9, title: "الأدعية القرآنية", desc: "أدعية من كتاب الله العزيز", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "quran", url: "quranic-dua.html" },
    { id: 10, title: "أدعية الأنبياء", desc: "أدعية الأنبياء والمرسلين", iconBg: "#f4f6f6", iconColor: "#16a085", iconType: "sparkles", url: "prophets-dua.html" },
    { id: 11, title: "أذكار الأذان", desc: "ما يقال عند سماع الأذان", iconBg: "#eaeded", iconColor: "#7f8c8d", iconType: "volume", url: "athan.html" },
    { id: 12, title: "أذكار المسجد", desc: "أذكار دخول وخروج المسجد", iconBg: "#edf6f2", iconColor: "#0c5943", iconType: "mosque", url: "mosque.html" },
    { id: 13, title: "أذكار متفرقة", desc: "أذكار لمناسبات متعددة", iconBg: "#f4f6f7", iconColor: "#2c3e50", iconType: "grid", url: "misc.html" },
    { id: 14, title: "أذكار الوضوء", desc: "ما يقال عند الوضوء", iconBg: "#e8f8f5", iconColor: "#1abc9c", iconType: "water", url: "wudu.html" },
    { id: 15, title: "أذكار المنزل", desc: "أذكار الدخول والخروج من المنزل", iconBg: "#f9ebea", iconColor: "#c0392b", iconType: "home", url: "home-azkar.html" },
    { id: 16, title: "أسماء الله الحسنى", desc: "الأسماء الحسنى لله تعالى", iconBg: "#fef5e7", iconColor: "#d35400", iconType: "crown", url: "allah-names.html" },
    { id: 17, title: "فضل الذكر", desc: "أحاديث في فضل ذكر الله", iconBg: "#ebf5fb", iconColor: "#2980b9", iconType: "diamond", url: "dhikr-virtue.html" },
    { id: 18, title: "فضل الدعاء", desc: "أحاديث في فضل الدعاء والتضرع", iconBg: "#efebe9", iconColor: "#5d4037", iconType: "hands", url: "dua-virtue.html" }
];

// ============ خريطة الأيقونات ============
const iconMap = {
    sunrise: "fa-solid fa-cloud-sun",
    sunset: "fa-solid fa-cloud-moon",
    prayer: "fa-solid fa-hand-holding-heart",
    star: "fa-solid fa-star",
    moon: "fa-solid fa-moon",
    sun: "fa-solid fa-sun",
    heart: "fa-solid fa-heart",
    book: "fa-solid fa-book",
    quran: "fa-solid fa-book-open",
    sparkles: "fa-solid fa-wand-magic-sparkles",
    volume: "fa-solid fa-volume-high",
    mosque: "fa-solid fa-mosque",
    grid: "fa-solid fa-table-cells",
    water: "fa-solid fa-droplet",
    home: "fa-solid fa-house",
    crown: "fa-solid fa-crown",
    diamond: "fa-solid fa-gem",
    hands: "fa-solid fa-hands-praying"
};

// ============ عناصر DOM ============
const categoriesGrid = document.getElementById('categoriesGrid');
const menuToggleBtn = document.getElementById('menuToggleBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const searchSection = document.getElementById('searchSection');
const homeContent = document.getElementById('homeContent');
const searchInput = document.getElementById('searchInput');

// ============ تهيئة التطبيق ============
document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    initSidebar();
    initSearch();
});

// ============ عرض التصنيفات ============
function displayCategories() {
    if (!categoriesGrid) return;
    
    categoriesGrid.innerHTML = azkarCategories.map(category => {
        const iconClass = iconMap[category.iconType] || "fa-solid fa-bookmark";
        return `
            <a href="posts/${category.url}" class="category-card">
                <div class="card-content">
                    <h4>${category.title}</h4>
                    <p>${category.desc}</p>
                </div>
                <div class="card-icon" style="background-color: ${category.iconBg}; color: ${category.iconColor};">
                    <i class="${iconClass}"></i>
                </div>
            </a>
        `;
    }).join('');
}

// ============ التحكم في القائمة الجانبية ============
function initSidebar() {
    if (!menuToggleBtn || !sidebar) return;
    
    menuToggleBtn.addEventListener('click', toggleSidebar);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// ============ البحث ============
function initSearch() {
    if (!searchToggleBtn || !searchSection) return;
    
    searchToggleBtn.addEventListener('click', toggleSearch);
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function toggleSearch() {
    if (searchSection.classList.contains('hidden')) {
        searchSection.classList.remove('hidden');
        homeContent.classList.add('hidden');
        searchToggleBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        if (searchInput) searchInput.focus();
    } else {
        closeSearch();
    }
}

function closeSearch() {
    searchSection.classList.add('hidden');
    homeContent.classList.remove('hidden');
    searchToggleBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    if (searchInput) searchInput.value = '';
}

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    if (query.length < 2) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <i class="fa-solid fa-magnifying-glass-chart"></i>
                <p>اكتب أي كلمة للبحث في مكتبة الأذكار والأدعية.</p>
            </div>
        `;
        return;
    }
    
    // البحث في التصنيفات
    const matchedCategories = azkarCategories.filter(cat => 
        cat.title.toLowerCase().includes(query) || 
        cat.desc.toLowerCase().includes(query)
    );
    
    if (matchedCategories.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <i class="fa-solid fa-circle-question"></i>
                <p>لم يتم العثور على نتائج لـ "${query}"</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = matchedCategories.map(cat => {
        const iconClass = iconMap[cat.iconType] || "fa-solid fa-bookmark";
        return `
            <a href="posts/${cat.url}" class="category-card">
                <div class="card-content">
                    <h4>${cat.title}</h4>
                    <p>${cat.desc}</p>
                </div>
                <div class="card-icon" style="background-color: ${cat.iconBg}; color: ${cat.iconColor};">
                    <i class="${iconClass}"></i>
                </div>
            </a>
        `;
    }).join('');
}
