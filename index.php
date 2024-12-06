<?php


<<<<<<< HEAD
try {
    if (isset($_GET['controleur'])) {
        $controllerName = $_GET['controleur'];
    } else {
        $controllerName = '';
=======
// Inclure tous les modèles & contrôleurs
require_once "include.php";

// Créer le contrôleur demandé
try  {
    if(isset($_GET['controller'])){
        $controllerName=$_GET['controller'];
    }else{
        $controllerName='';
>>>>>>> JeuOuiCaptcha
    }

    if (isset($_GET['methode'])) {
        $methode = $_GET['methode'];
    } else {
        $methode = '';
    }

    //Gestion de la page d'accueil par défaut
<<<<<<< HEAD
    if ($controllerName == '' && $methode == '') {
        $template = $twig->load('index.html.twig');
        echo $template->render(array('etat' => 'connecte',));
    } else if ($controllerName == '') {
        throw new Exception('Le controleur n\'est pas défini');
    } else if ($methode == '') {
        throw new Exception('La méthode n\'est pas définie');
    } else {
        $controller = ControllerFactory::getController($controllerName, $loader, $twig);

        $controller->call($methode);
    }
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
=======
    if ($controllerName == '' && $methode ==''){
        $controllerName='captcha';
        $methode='index';
        
    }

    // Générer les erreurs au besoin
    if ($controllerName == '' ){
        throw new Exception('Le controleur n\'est pas défini');
    }

    if ($methode == '' ){
        throw new Exception('La méthode n\'est pas définie');
    }

    
    // Générer le controleur
    $controller = ControllerFactory::getController($controllerName, $loader, $twig);
    $controller->call($methode);
}catch (Exception $e) {
   die('Erreur : ' . $e->getMessage());
}
>>>>>>> JeuOuiCaptcha
