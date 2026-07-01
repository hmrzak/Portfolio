document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch and render projects from projects.json
    const projectsGrid = document.getElementById("projects-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    let projectsData = [];

    // Load projects
    async function loadProjects() {
        try {
            const response = await fetch("projects.json");
            projectsData = await response.json();
            renderProjects(projectsData);
        } catch (e) {
            console.error("Failed to load projects:", e);
            projectsGrid.innerHTML = `<p class="error-msg">Impossible de charger les projets pour le moment.</p>`;
        }
    }

    // Render projects list in DOM
    function renderProjects(projects) {
        projectsGrid.innerHTML = "";
        projects.forEach(project => {
            const card = document.createElement("div");
            card.className = "glass-card project-card";
            card.setAttribute("data-category", project.category);
            
            const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join("");
            
            card.innerHTML = `
                <span class="project-category">${project.category}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">${tagsHTML}</div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="project-link">Voir sur GitHub &rarr;</a>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Category filtering
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            const filterValue = button.getAttribute("data-filter");
            if (filterValue === "all") {
                renderProjects(projectsData);
            } else {
                const filtered = projectsData.filter(p => p.category === filterValue);
                renderProjects(filtered);
            }
        });
    });

    // 2. Email copy-to-clipboard functionality
    const btnCopyEmail = document.getElementById("btn-copy-email");
    const emailValue = "haitam.marzak@epitech.eu";

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener("click", () => {
            navigator.clipboard.writeText(emailValue).then(() => {
                // Temporary visual feedback
                const originalHTML = btnCopyEmail.innerHTML;
                btnCopyEmail.innerHTML = `<span style="font-size: 12px; color: var(--secondary-color); font-weight: bold; margin-left: 4px;">Copié !</span>`;
                btnCopyEmail.style.pointerEvents = "none";
                
                setTimeout(() => {
                    btnCopyEmail.innerHTML = originalHTML;
                    btnCopyEmail.style.pointerEvents = "auto";
                }, 2000);
            }).catch(err => {
                console.error("Could not copy text: ", err);
            });
        });
    }

    // 3. Smooth fade-in scroll reveal
    const revealElements = document.querySelectorAll(".timeline-item, .skill-card, .project-card");
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };

    // Initialize animation properties
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    });

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Start loading projects
    loadProjects();
});
