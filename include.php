<?php

//Ajout de l'autoload de composer
require_once 'vendor/autoload.php';

//Ajout du fichier constantes qui permet de configurer le site
require_once 'config/constantes.php';

//Ajout du code pour initialiser twig 
require_once 'config/twig.php';

//Ajout du modèle qui gère la connexion mysql
require_once 'modeles/bd.class.php';


// Ajout des controleurs
require_once 'controller/controller.class.php';
require_once 'controller/controller_factory.class.php';
require_once 'controller/controller_captcha.class.php';