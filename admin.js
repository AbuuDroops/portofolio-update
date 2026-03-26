const PASSWORD = 'admin123'; // GANTI INI!

function login() {
    const pass = document.getElementById('password').value;
    if (pass === PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadProjects();
    } else {
        alert('❌ Password salah!');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
}

function logout() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

// Enter key untuk login
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const list = document.getElementById('projectList');
    const count = document.getElementById('count');
    
    count.textContent = projects.length;
    
    if (projects.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#666;">Belum ada projects</p>';
        return;
    }
    
    list.innerHTML = projects.map((project, index) => `
        <div class="project-item">
            <div>
                <h4>${project.title}</h4>
                <p>${project.desc}</p>
                <small>Tech: ${project.tech ? project.tech.join(', ') : 'N/A'}</small>
            </div>
            <div>
                <a href="${project.link || '#'}" target="_blank" style="color:#667eea;">🔗</a>
                <button class="btn-delete" onclick="deleteProject(${index})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>
    `).join('');
}

document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const project = {
        title: document.getElementById('title').value,
        desc: document.getElementById('desc').value,
        img: document.getElementById('img').value || '',
        tech: document.getElementById('tech').value.split(',').map(t => t.trim()).filter(t => t),
        link: document.getElementById('link').value || ''
    };
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Reset form
    e.target.reset();
    
    // Refresh list
    loadProjects();
    
    alert('✅ Project berhasil ditambahkan!');
});

function deleteProject(index) {
    if (confirm('Hapus project ini?')) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
    }
}
