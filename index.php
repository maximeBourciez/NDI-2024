<?php


// Inclure tous les modèles & contrôleurs
require_once "include.php";

// Créer le contrôleur demandé
try  {
    if(isset($_GET['controller'])){
        $controllerName=$_GET['controller'];
    }else{
        $controllerName='';
    }

    if (isset($_GET['methode'])) {
        $methode = $_GET['methode'];
    } else {
        $methode = '';
    }

    //Gestion de la page d'accueil par défaut
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
