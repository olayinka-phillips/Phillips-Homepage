const API_BASE = "http://127.0.0.1:8080";

async function loadNavLinks() {
    try {
        const res = await fetch(`${API_BASE}/api/homepage`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const links = await res.json();

        const navContainer = document.getElementById("nav-links");
        if (!navContainer) return;

        const fragment = document.createDocumentFragment();

        links.forEach(({ name, url, button }) => {
            const a = document.createElement("a");
            a.href = url;
            a.textContent = name;

            if (button) a.className = "nav-btn";

            fragment.appendChild(a);
        });

        navContainer.replaceChildren(fragment);

    } catch (error) {
        console.error("Error loading navigation:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    // load navigation
    loadNavLinks();

    // reveal animation
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));

});