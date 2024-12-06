let fauxBtn = document.getElementById('btnOfficieux');
let vraiBtn = document.getElementById('btnOfficiel');

// Compteur clic Btn à la con
let compteurClick = 0;
const compteurClickMax = 10;

// Récupérer les dimensions de la fenêtre
const width = window.innerWidth;
const height = window.innerHeight;

// Fonction pour le bouton officieux
function btnOfficieux() {
    // Changer la position du bouton en absolue
    fauxBtn.style.position = 'absolute';

    compteurClick++;

    // Générer une nouvelle position
    const { x: nvX, y: nvY } = nouvellePosition();

    // Mettre le bouton à la nouvelle position
    fauxBtn.style.left = nvX + 'px';
    fauxBtn.style.top = nvY + 'px';

    // Si le compteur est atteint, remplacer les boutons
    if (compteurClick >= compteurClickMax) {
        fauxBtn.classList.add('d-none');
        vraiBtn.classList.remove('d-none');
        console.log('Bravo, vous avez réussi le captcha !');
    }
}


// Événements pour les boutons
fauxBtn.addEventListener('click', btnOfficieux);


// Fonction pour générer une nouvelle position
function nouvellePosition() {
    const x = Math.floor(Math.random() * (0.6*width - 200)- 0.25*width);
    const y = Math.floor(Math.random() * (0.6*height - 300)- (Math.random()*(0.5-0.25))*height);

    console.log('Dimensions de la fenêtre :', width, height);

    console.log('Nouvelles coordonnées :', x, y);
    return { x, y };
}
