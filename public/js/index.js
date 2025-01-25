let currentLanguage = 'en'; // Langue par défaut

// Écouteur d'événement pour le bouton de basculement
document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en'; // Bascule entre 'en' et 'fr'
    loadLanguage(currentLanguage);
});

function loadLanguage(lang) {
    fetch(`public/lang_${lang}.json`)
        .then(response => response.json())
        .then(data => {
            updateTextContent(data); // Met à jour les éléments HTML
            updateButtonLabel(lang); // Met à jour le texte du bouton
        })
        .catch(error => console.error(`Erreur lors du chargement de la langue: ${error}`));
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

function updateButtonLabel(lang) {
    const toggleButton = document.getElementById('lang-toggle-btn');
    toggleButton.textContent = lang === 'en' ? 'Switch to French' : 'Passer en anglais'; // Change le texte selon la langue
}

// Chargement initial de la langue par défaut
loadLanguage(currentLanguage);
