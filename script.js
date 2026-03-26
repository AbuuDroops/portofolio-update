// Load projects saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    // Smooth scroll untuk nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

async function loadProjects() {
    try {
        // Prioritas: localStorage > projects.json
        let projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        if (projects.length === 0) {
            // Fallback ke projects.json kalau kosong
            const response = await fetch('projects.json');
            projects = await response.json().projects || [];
            localStorage.setItem('projects', JSON.stringify(projects));
        }
        
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = 
            '<p style="text-align:center;color:#666;">Loading projects...</p>';
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#666;">Belum ada projects.</a></p>';
        return;
    }
    
    grid.innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.img || 'https://via.placeholder.com/400x200?text=No+Image'}" 
                 alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <h3>${project.title}</h3>
            <p>${project.desc}</p>
            <div class="tech-stack">
                ${project.tech.map(t => `<span class="tech">${t.trim()}</span>`).join('')}
            </div>
            ${project.link ? `<a href="${project.link}" target="_blank" class="btn-small">View Project</a>` : ''}
        </div>
    `).join('');
    
    // Animasi fade-in
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}
