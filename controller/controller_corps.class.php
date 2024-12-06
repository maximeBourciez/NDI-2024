<?php

class ControllerCorps extends Controller
{
    public function __construct(\Twig\Environment $twig, \Twig\Loader\FilesystemLoader $loader)
    {
        parent::__construct($twig, $loader);
    }

    public function cerveau(): void
    {
        $template = $this->getTwig()->load('cerveau.html.twig');
        echo $template->render(array());
    }

    public function index(): void
    {
        // Passer display_header à false pour ne pas afficher le header
        $template = $this->getTwig()->load('index.html.twig');
        echo $template->render(['display_header' => false]);  // Ici
    }
}
