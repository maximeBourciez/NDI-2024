<?php

require_once 'include.php';

try  {
    if (isset($_GET['controller'])){
        $controllerName=$_GET['controller'];
    }else{
        $controllerName='';
    }

    if (isset($_GET['methode'])){
        $methode=$_GET['methode'];
    }else{
        $methode='';
    }

    //Gestion de la page d'accueil par défaut
    if ($controllerName == '' && $methode ==''){
        // $template = $twig->load('captcha.html.twig');
        // echo $template->render(array('etat' => 'connecte',));
        $controllerName = 'captcha';
        $methode = 'FctDegueulasse';
    }
    else if ($controllerName == '' ){
        throw new Exception('Le controleur n\'est pas défini');
    }
    else if ($methode == '' ){
        throw new Exception('La méthode n\'est pas définie');
    }
    else {
        try {
            $controller = ControllerFactory::getController($controllerName, $loader, $twig);
            if (!$controller) {
                throw new Exception("Erreur : Aucun contrôleur trouvé pour '$controllerName'.");
            }
        
            if (!method_exists($controller, $methode)) {
                throw new Exception("Erreur : La méthode '$methode' n'existe pas dans le contrôleur '$controllerName'.");
            }
        
            $controller->call($methode);
        } 
        catch (Exception $e) {
            die('Erreur : ' . $e->getMessage());
        }
}
}
catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}