// Global for projects
let currentProjects = [];

// Load projects saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    // Modal close
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
    
    // Smooth scroll untuk nav links
    document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
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
            const response = await fetch('project.json');
            projects = await response.json().projects || [];
            localStorage.setItem('projects', JSON.stringify(projects));
        }
        
        currentProjects = projects;
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
        grid.innerHTML = '<p style="text-align:center;color:#666;">Belum ada projects.</p>';
        return;
    }
    
    grid.innerHTML = projects.map((project, index) => `
        <div class="project-card" onclick="openProjectDetail(${index})">
            <div class="project-logo">
                <img src="${project.logo || ''}" alt="${project.title} logo" onerror="this.parentElement.style.display='none'">
            </div>
            <h3>${project.title}</h3>
            <button class="btn-detail">View Details</button>
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

function openProjectDetail(index) {
    const project = currentProjects[index];
    if (!project) return;
    
    // Fill modal
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDesc').textContent = project.desc || 'No description.';
    document.getElementById('modalScreenshot').src = project.img || 'https://via.placeholder.com/600x400?text=No+Image';
    document.getElementById('modalScreenshot').onerror = function() {
        this.src = 'https://via.placeholder.com/600x400?text=No+Image';
    };
    
    const techHtml = project.tech ? project.tech.map(t => `<span class="tech">${t.trim()}</span>`).join('') : '<p>No tech stack.</p>';
    document.getElementById('modalTech').innerHTML = techHtml;
    
    const actions = document.getElementById('modalActions');
    let actionsHtml = '';
    if (project.downloadUrl) {
      actionsHtml = `<a href="${project.downloadUrl}" class="btn-download" download>📱 Download APK</a>`;
    } else if (project.link) {
      actionsHtml = `<a href="${project.link}" class="btn-web" target="_blank">🌐 Open Website</a>`;
    }
    actions.innerHTML = actionsHtml;
    
    document.getElementById('projectModal').style.display = 'block';
  } 
