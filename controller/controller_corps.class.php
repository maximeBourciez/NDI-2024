<?php

class ControllerCorps extends Controller
{
    public function __construct(\Twig\Environment $twig, \Twig\Loader\FilesystemLoader $loader) {
        parent::__construct($twig, $loader);
    }
    
    public function cerveau() : void {
        $template = $this->getTwig()->load('cerveau.html.twig');
        echo $template->render(array());
    }
    public function index() : void {
        $template = $this->getTwig()->load('index.html.twig');
        echo $template->render(array());
    }
}