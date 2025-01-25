document.getElementById('fr-btn').addEventListener('click', () => {
    loadLanguage('fr');
});

document.getElementById('en-btn').addEventListener('click', () => {
    loadLanguage('en');
});

function loadLanguage(lang) {
    fetch(`public/lang_${lang}.json`)
        .then(response => response.json())
        .then(data => updateTextContent(data));
}

function loadLanguage(lang) {
    fetch(`public/lang_${lang}.json`)
        .then(response => response.json())
        .then(data => {
            updateTextContent(data);
            updateButtonLabels(lang); // Update button labels after loading language data
        });
}

function updateTextContent(data) {
    // Mise à jour du menu de navigation
    document.getElementById('nav-skills').textContent = data.nav.skills;
    document.getElementById('nav-projects').textContent = data.nav.projects;
    document.getElementById('nav-education').textContent = data.nav.education;
    document.getElementById('nav-contact').textContent = data.nav.contact;

    // Mise à jour de l'en-tête
    document.getElementById('header-subtitle').textContent = data.header.subtitle;
    document.getElementById('header-description').textContent = data.header.description;

    // Mise à jour des compétences
    document.getElementById('competences-title').textContent = data.competences.title;
    document.querySelector('.skills-design').textContent = data.competences.design;
    document.querySelector('.skills-technologies').textContent = data.competences.technologies;
    document.querySelector('.skills-others').textContent = data.competences.others;

    // Mise à jour des projets
    document.getElementById('projects-title').textContent = data.projects.title;
    document.querySelector('.project-etalent-description').textContent = data.projects.etalent.description;
    document.querySelector('.project-taskMaster-description').textContent = data.projects.taskMaster.description;
    document.querySelector('.project-travelBlog-description').textContent = data.projects.travelBlog.description;
    document.querySelector('.project-flashnet75-description').textContent = data.projects.flashnet75.description;
    document.querySelector('.project-adei-description').textContent = data.projects.adei.description;
    document.querySelector('.project-weCare-description').textContent = data.projects.weCare.description;

    // Mise à jour des formations
    document.getElementById('formations-title').textContent = data.formations.title;
    document.querySelectorAll('.certifications p span').forEach((element, index) => {
        element.textContent = data.formations.certifications[index];
    });
    document.getElementById('cv-download').textContent = data.formations.cv;

    // Mise à jour du contact
    document.getElementById('contact-description').textContent = data.contact.description;
}


// Génération des étoiles
const starContainer = document.querySelector('body');
const starCount = 100;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 2}s`;
    starContainer.appendChild(star);
}


