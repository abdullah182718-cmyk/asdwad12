/**
 * =====================================================
 * أذكاري - حصنك اليومي
 * سكربت مركزي مشترك للصفحات الداخلية
 * =====================================================
 */

'use strict';

// ============ المفاتيح ============
const FAVORITES_KEY = 'favorites';

// ============ DOM ============
const container = document.getElementById('azkarContainer');
const toast = document.getElementById('toastMsg');

// ============ التهيئة ============
let counts = [];

/**
 * تحميل العدادات من LocalStorage
 * @param {string} storageKey - مفتاح التخزين
 * @param {Array} dataLength - طول مصفوفة البيانات
 * @returns {Array} مصفوفة العدادات
 */
function loadCounts(storageKey, dataLength) {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length === dataLength ? parsed : new Array(dataLength).fill(0);
    }
    return new Array(dataLength).fill(0);
}

/**
 * حفظ العدادات في LocalStorage
 * @param {string} storageKey - مفتاح التخزين
 * @param {Array} countsArray - مصفوفة العدادات
 */
function saveCounts(storageKey, countsArray) {
    localStorage.setItem(storageKey, JSON.stringify(countsArray));
}

// ============ المفضلة ============
function getFavoriteId(pageSlug, index) {
    return `${pageSlug}_${index}`;
}

function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    return favorites.some(item => item.id === id);
}

function addToFavorites(item, id, index, pageCategory, updateCallback) {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push({
            id: id,
            category: pageCategory,
            text: item.text,
            title: item.title || '',
            note: item.note || '',
            maxCount: item.maxCount
        });
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        showToast('✅ تمت الإضافة إلى المفضلة');
        if (updateCallback) updateCallback(index, true);
    } else {
        showToast('⚠️ هذا الذكر موجود بالفعل في المفضلة');
    }
}

function removeFromFavorites(id, index, updateCallback) {
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    favorites = favorites.filter(item => item.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    showToast('🗑️ تم الحذف من المفضلة');
    if (updateCallback) updateCallback(index, false);
}

function toggleFavorite(index, item, pageSlug, pageCategory, updateCallback) {
    const id = getFavoriteId(pageSlug, index);
    if (isFavorite(id)) {
        removeFromFavorites(id, index, updateCallback);
    } else {
        addToFavorites(item, id, index, pageCategory, updateCallback);
    }
}

function updateHeartIcon(selector, index, isActive) {
    const heartIcon = document.querySelector(`${selector}[data-idx="${index}"]`);
    if (heartIcon) {
        heartIcon.classList.toggle('active', isActive);
        heartIcon.classList.toggle('fa-regular', !isActive);
        heartIcon.classList.toggle('fa-solid', isActive);
    }
}

// ============ العداد ============
function incrementCount(index, dataArray, storageKey, renderCallback) {
    const max = dataArray[index].maxCount;
    if (counts[index] < max) {
        counts[index]++;
        saveCounts(storageKey, counts);
        if (renderCallback) renderCallback();
    }
}

function resetCount(index, storageKey, renderCallback) {
    counts[index] = 0;
    saveCounts(storageKey, counts);
    if (renderCallback) renderCallback();
}

// ============ التنبيه ============
function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
}

// ============ التصيير ============
/**
 * تصيير بطاقة الذكر
 * @param {Object} item - بيانات الذكر
 * @param {number} idx - индекс الذكر
 * @param {string} pageSlug - اسم الصفحة
 * @param {Function} onIncrement - دالة عند الضغط
 * @param {Function} onReset - دالة عند إعادة التعيين
 * @param {Function} onFavorite - دالة عند إضافة/حذف المفضلة
 * @returns {string} HTML البطاقة
 */
function renderCard(item, idx, pageSlug, onIncrement, onReset, onFavorite) {
    const current = counts[idx];
    const max = item.maxCount;
    const completed = current >= max;
    const favId = getFavoriteId(pageSlug, idx);
    const isFav = isFavorite(favId);
    
    const buttonContent = completed ? `
        <div class="count-circle" style="background: rgba(255, 255, 255, 0.4);">
            <span>${max}</span>
            <hr>
            <span>${max}</span>
        </div>
        <span class="btn-text">مكتمل</span>
    ` : `
        <div class="count-circle">
            <span>${current}</span>
            <hr>
            <span>${max}</span>
        </div>
        <span class="btn-text">اضغط<br>هنا</span>
    `;

    return `
        <div class="dhikr-card">
            <div class="dhikr-card-body">
                <div class="card-top-bar">
                    <span class="repeat-badge">تكرار: ${max}</span>
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart favorite-icon ${isFav ? 'active' : ''}" 
                       data-idx="${idx}"></i>
                </div>
                <div class="dhikr-text">${item.text}</div>
                ${item.title ? `<div class="dhikr-reference">— ${item.title} —</div>` : ''}
                ${item.note ? `<div class="dhikr-note">${item.note}</div>` : ''}
            </div>
            <div class="card-action-area">
                <div class="action-buttons-wrap">
                    <button class="btn-count ${completed ? 'completed' : ''}" 
                            data-idx="${idx}" 
                            ${completed ? 'disabled' : ''}>
                        ${buttonContent}
                    </button>
                    <button class="reset-btn" data-reset-idx="${idx}" title="إعادة تعيين">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * ربط الأحداث بالأزرار
 * @param {Array} dataArray - مصفوفة البيانات
 * @param {string} pageSlug - اسم الصفحة
 * @param {string} pageCategory - تصنيف الصفحة
 * @param {Function} incrementCallback - دالة الزيادة
 * @param {Function} resetCallback - دالة إعادة التعيين
 */
function bindAzkarEvents(dataArray, pageSlug, pageCategory, incrementCallback, resetCallback) {
    // أزرار العد
    document.querySelectorAll('.btn-count').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            if (!isNaN(idx)) incrementCallback(idx);
        };
    });
    
    // أزرار إعادة التعيين
    document.querySelectorAll('.reset-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.resetIdx);
            if (!isNaN(idx)) resetCallback(idx);
        };
    });
    
    // أيقونات المفضلة
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.onclick = (e) => {
            e.stopPropagation();
            const idx = parseInt(icon.dataset.idx);
            if (!isNaN(idx)) {
                // تحديث الأيقونة فوراً قبل العملية
                const isFav = AzkarApp.isFavorite(`${pageSlug}_${idx}`);
                icon.classList.toggle('active', !isFav);
                icon.classList.toggle('fa-regular', isFav);
                icon.classList.toggle('fa-solid', !isFav);
                
                // تنفيذ العملية
                toggleFavorite(idx, dataArray[idx], pageSlug, pageCategory);
            }
        };
    });
}

// ============ تصدير للاستخدام العام ============
window.AzkarApp = {
    loadCounts,
    saveCounts,
    isFavorite,
    toggleFavorite,
    updateHeartIcon,
    incrementCount,
    resetCount,
    showToast,
    renderCard,
    bindAzkarEvents
};