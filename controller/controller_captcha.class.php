<?php

class ControllerCaptcha extends Controller
{
    /**
     * Constructeur par défaut
     *
     * @param \Twig\Environment $twig Environnement twig
     * @param \Twig\Loader\FilesystemLoader $loader Loader de fichier
     */

    public function __construct(\Twig\Environment $twig, \Twig\Loader\FilesystemLoader $loader)
    {
        parent::__construct($twig, $loader);
    }

    public function jouerAsteroids()
    {
        $this->genererVue('asteroids');
    }


    public function jouerMorpion()
    {
        $this->genererVue('morpion');
    }

    private function genererVue(string $file){
        $template = $this->getTwig()->load($file. '.html.twig');
        echo $template->render(array());
    }
}
