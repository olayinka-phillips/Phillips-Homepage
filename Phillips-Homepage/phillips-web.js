const API_BASE = "http://127.0.0.1:8080";

const ICONS = {
    shield: `
        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
    `,
    bolt: `
        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    `,
    users: `
        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    `,
    briefcase: `
        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
    `
};

async function loadHomepage() {
    try {
        const res = await fetch(`${API_BASE}/api/homepage`);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        

        renderNavigation(data.navigation || []);
        renderHero(data.hero || null);
        renderStats(data.stats || []);
        renderstatsEyebrow(data.statsEyebrow || null);
        renderHeroStrip(data.heroStrip || []);
        
    } catch (error) {
        console.error("Error loading homepage:", error);
    }
}

function renderNavigation(links) {
    const navContainer = document.getElementById("nav-links");
    if (!navContainer) return;

    const sorted = [...links].sort((a, b) => a.order - b.order);

    const fragment = document.createDocumentFragment();

    sorted.forEach(link => {
        const a = document.createElement("a");
        a.href = link.url || "#";
        a.textContent = link.name || "";
        if (link.button) a.classList.add("nav-btn");
        fragment.appendChild(a);
    });

    navContainer.replaceChildren(fragment);
}

function renderHero(hero) {
  if (!hero) return;

  const eyebrow = document.querySelector(".hero-eyebrow .eyebrow");
  const description = document.querySelector(".hero-p");
  const primaryBtn = document.querySelector(".btn-gold");
  const secondaryBtn = document.querySelector(".btn-outline");

  if (eyebrow) eyebrow.textContent = hero.eyebrow || "";
  if (description) description.textContent = hero.description || "";

  if (primaryBtn) {
    const svg = primaryBtn.querySelector("svg");
    primaryBtn.textContent = hero.primary_btn_text || "";
    if (svg) primaryBtn.appendChild(svg);
    primaryBtn.href = hero.primary_btn_url || "#";
  }

  if (secondaryBtn) {
    secondaryBtn.textContent = hero.secondary_btn_text || "Learn More"; // fallback added
    secondaryBtn.href = hero.secondary_btn_url || "#";
  }
}

function renderstatsEyebrow(statsEyebrow) {
    const container = document.querySelector(".stats_eyebrow");
    if (!container || !statsEyebrow ) return;
     
    container.textContent = statsEyebrow.eyebrow || "";
}

function renderStats(stats) {
    const container = document.querySelector(".stats-quad");
    if (!container) return;

    const sorted = [...stats].sort((a, b) => a.order - b.order);

    const fragment = document.createDocumentFragment();

    sorted.forEach(stat => {
        const box = document.createElement("div");
        box.className = "stat-box";

        box.innerHTML = `
            <div class="stat-n">${stat.value}<sup>${stat.suffix}</sup></div>
            <div class="stat-l">${stat.label}</div>
        `;

        fragment.appendChild(box);
    });

    container.replaceChildren(fragment);
}

function renderHeroStrip(heroStrip) {
    const container = document.querySelector(".hero-strip");
    if (!container) return;

    if (!heroStrip || heroStrip.length === 0) {
        container.replaceChildren();
        return;
    }
    
    const sorted = [...heroStrip].sort((a, b) => a.order - b.order);
    const fragment = document.createDocumentFragment();
    
    sorted.forEach(item => {
        const div = document.createElement("div");
        div.className = "hstrip-item";
        
        div.innerHTML = `
            <div class="hstrip-icon">
                ${ICONS[item.icon] || ""}
            </div>
            <div>
                <div class="hstrip-title">${item.title}</div>
                <div class="hstrip-sub">${item.subtitle}</div>
            </div>
        `;
        
        fragment.appendChild(div);
    });
    
    container.replaceChildren(fragment);
}

function setRandomHeroHeadline() {
    const headlineEl = document.querySelector(".hero-h1");
    if (!headlineEl) return;

    const options = [
        `Powering Business<br>Growth Across<br><em>Africa.</em>`,
        `Number 1<br>Outsourcing Firm`,
        `We provide great<br>HR solutions`,
    ];

    const pick = options[Math.floor(Math.random() * options.length)];
    headlineEl.innerHTML = pick;
}

document.addEventListener("DOMContentLoaded", () => {

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

    setRandomHeroHeadline();
    loadHomepage();
});