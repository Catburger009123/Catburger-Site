// ================================
// PROJECTS ARCHIVE RENDER
// ================================

const projectsGrid = document.getElementById("projectsGrid");

function renderProjects() {
    if (!projectsGrid || typeof projects === "undefined") return;

    projectsGrid.innerHTML = "";

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "project-card";

        card.innerHTML = `
            <div>
                <div class="project-header">
                    <div class="project-icon">${project.icon || "💾"}</div>
                    <div class="project-title-box">
                        <span class="tiny-label">${project.category || "SOFTWARE"}</span>
                        <h3>${project.title}</h3>
                    </div>
                </div>

                ${project.preview ? `<img class="project-preview" src="${project.preview}" alt="${project.title} preview" onerror="this.style.display='none'">` : ""}

                <p class="project-description">${project.description}</p>
            </div>

            <div class="project-footer">
                <span class="file-size">${project.fileSize || "ZIP"}</span>
                <a href="${project.downloadUrl}" class="aero-button download-btn" download>
                    <span>💾 Download</span>
                </a>
            </div>
        `;

        projectsGrid.appendChild(card);
    });
}

// ================================
// PAGE NAVIGATION
// ================================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll("[data-page]");
const goPageButtons = document.querySelectorAll("[data-go-page]");

function switchPage(pageName) {
    // Скрываем все страницы
    pages.forEach(page => page.classList.remove("active"));
    
    // Показываем нужную страницу (добавляем префикс "page-")
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Обновляем активную кнопку в меню
    navButtons.forEach(btn => {
        if (btn.dataset.page === pageName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Прокручиваем вверх при смене страницы
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Слушатели для бокового меню
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const target = button.dataset.page;
        switchPage(target);
    });
});

// Слушатели для внутренних кнопок
document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-go-page]");
    if (btn) {
        switchPage(btn.dataset.goPage);
    }
});


// ================================
// FEATURED ARTWORKS (RECENT WORK)
// ================================

const featuredGrid = document.getElementById("featuredGrid");

function renderFeatured() {
    if (!featuredGrid || typeof artworks === "undefined" || artworks.length === 0) return;

    featuredGrid.innerHTML = "";
    
    // Берем 3 последних арта из массива и ставим самый свежий на первое место
    const recent = artworks.slice(-3).reverse();

    recent.forEach(artwork => {
        const item = document.createElement("div");
        item.className = "featured-item art-card"; // Добавили art-card для единого стиля
        
        item.innerHTML = `
            <img 
                class="art-card-image" 
                src="${artwork.image}" 
                alt="${artwork.title}" 
                onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'"
            >
            ${
                artwork.nsfw
                ? `
                    <div class="nsfw-cover">
                        <div class="nsfw-content">
                            <span class="nsfw-badge">18+ NSFW</span>
                            <h3>Sensitive Content</h3>
                            <button class="reveal-button">Click to Reveal</button>
                        </div>
                    </div>
                `
                : ""
            }
        `;

        // Открытие модального окна при клике
        item.addEventListener("click", (e) => {
            if (e.target.classList.contains("reveal-button")) {
                e.stopPropagation();
                item.querySelector(".nsfw-cover").style.display = "none";
                return;
            }
            openModal(artwork);
        });

        featuredGrid.appendChild(item);
    });
}


// ================================
// ARTWORK GALLERY RENDER
// ================================

const artGrid = document.getElementById("artGrid");
const artCount = document.getElementById("artCount");

function renderGallery(filterCategory = "all") {
    if (!artGrid || typeof artworks === "undefined") return;

    artGrid.innerHTML = "";

    const targetFilter = filterCategory.toLowerCase();

    const filtered = filterCategory === "all" 
        ? artworks 
        : artworks.filter(item => {
            if (targetFilter === "nsfw") return item.nsfw;

            // Проверка категории
            const matchCategory = item.category && item.category.toLowerCase() === targetFilter;

            // Проверка по тегам
            const matchTags = item.tags && item.tags.some(tag => {
                const normalizedTag = tag.toLowerCase().replace(/\s+/g, '');
                const normalizedFilter = targetFilter.replace(/\s+/g, '');
                return normalizedTag === normalizedFilter;
            });

            return matchCategory || matchTags;
        });

    if (artCount) artCount.textContent = filtered.length;

    if (filtered.length === 0) {
        artGrid.innerHTML = `<div class="empty-gallery">No artworks found in this category.</div>`;
        return;
    }

    filtered.forEach((artwork) => {
        const card = document.createElement("article");
        card.className = "art-card";

        card.innerHTML = `
            <img 
                class="art-card-image" 
                src="${artwork.image}" 
                alt="${artwork.title}"
                onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
            >
            ${
                artwork.nsfw
                ? `
                    <div class="nsfw-cover">
                        <div class="nsfw-content">
                            <span class="nsfw-badge">18+ NSFW</span>
                            <h3>Sensitive Content</h3>
                            <button class="reveal-button">Click to Reveal</button>
                        </div>
                    </div>
                `
                : ""
            }
            <div class="art-card-info">
                <div class="art-card-title">${artwork.title}</div>
            </div>
        `;

        // Открытие модального окна при клике
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("reveal-button")) {
                e.stopPropagation();
                card.querySelector(".nsfw-cover").style.display = "none";
                return;
            }
            openModal(artwork);
        });

        artGrid.appendChild(card);
    });
}


// ================================
// GALLERY FILTERS
// ================================

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGallery(btn.dataset.filter);
    });
});


// ================================
// ARCHIVE FILTERING
// ================================

const archiveButtons = document.querySelectorAll(".archive-entry");

archiveButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const year = btn.dataset.filterYear;
        switchPage("gallery");
        
        filterButtons.forEach(b => {
            if (b.dataset.filter.toLowerCase() === year.toLowerCase()) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });

        renderGallery(year);
    });
});


// ================================
// MODAL WINDOW MECHANICS
// ================================

const modal = document.getElementById("artModal");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.querySelector(".modal-backdrop");

function openModal(artwork) {
    if (!modal) return;
    
    document.getElementById("modalImage").src = artwork.image;
    document.getElementById("modalTitle").textContent = artwork.title;
    document.getElementById("modalCategory").textContent = artwork.category || "ARTWORK";
    document.getElementById("modalDescription").textContent = artwork.description || "";
    
    const tagsContainer = document.getElementById("modalTags");
    tagsContainer.innerHTML = "";
    if (artwork.tags) {
        artwork.tags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.className = "modal-tag";
            tagSpan.textContent = `#${tag}`;
            tagsContainer.appendChild(tagSpan);
        });
    }

    modal.classList.add("open");
}

function closeModal() {
    if (modal) modal.classList.remove("open");
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);


// ================================
// INIT
// ================================

document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderGallery();
    renderProjects(); // <-- Добавили вызов
});