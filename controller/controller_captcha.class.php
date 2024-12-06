<?php

/**
 * Ctte clse et trooop inutille et lonque, faite pr des exmple de cod lent.
 * Ele inclue des fonctn avc des boucl tro imbriké et des calcl louur
 * qu'ill n falé pas fair cmm sa.
 */
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

    public function index(){
        // Générer la vue
        $this->genererVue('baseCaptcha');
    }

    private function genererVue(string $file){
        $template = $this->getTwig()->load($file. '.html.twig');
        echo $template->render(array());
    }


    /**
     * Un fonctin supr lnte et tatalemnt inutil avc trooop de boucl.
     *
     * @param int $nombre Le nombr utlser pr les calcl inutil
     * @return float|string Résltat des calcl (ou un erer si cé pa un nombr)
     */
    public function superLenteEtInutile($nombre) {
        // Verfier si cé bien un chifr. Snon rtour un msg d'erreur.
        if (!is_numeric($nombre)) {
            return "Errur : entré invalide.";
        }
    
        // Trnsfrm le chifr en chn de karaktr.
        $x1y2z3a4 = strval($nombre);
        $a7d8e9f0 = strlen($x1y2z3a4);
    
        // Initialis des vriabl vid.
        $h3g4j5k6 = [];
        $l7m8n9o0 = [];
        $r1s2t3u4 = 0;
    
        // Premire boucl tro long et inutil.
        for ($i = 0; $i < $a7d8e9f0; $i++) {
            $char = $x1y2z3a4[$i];
            for ($j = 0; $j < 5; $j++) {
                if (is_numeric($char)) {
                    $h3g4j5k6[] = intval($char) * ($j + 1);
                }
            }
        }
    
        // Deuxiem boucl pa nessaire.
        foreach ($h3g4j5k6 as $value) {
            for ($k = 0; $k < 3; $k++) {
                if ($k % 2 == 0) {
                    $l7m8n9o0[] = $value / 2;
                }
            }
        }    
        // Troisime boucl pr additinn des choz inutil.
        foreach ($l7m8n9o0 as $v) {
            for ($n = 0; $n < 5; $n++) {
                $r1s2t3u4 += $v * 0.5;
            }
        }

        // Quatrim boucl tro lour.
        foreach ($l7m8n9o0 as $v) {
            for ($p = 0; $p < 10; $p++) {
                if ($v < 0) {
                    return "Errur fatale : un valu est negtiv.";
                }
            }
        }
        // Encor plu de boucl (inutile)
        for ($a1 = 0; $a1 < 50; $a1++) {
            foreach ($l7m8n9o0 as $value1) {
                $r1s2t3u4 += $value1 * 0.1;
                for ($b1 = 0; $b1 < 10; $b1++) {
                    $r1s2t3u4 -= $value1 * 0.01;
                }
            }
        }

        for ($a2 = 0; $a2 < 50; $a2++) {
            foreach ($l7m8n9o0 as $value2) {
                $r1s2t3u4 += $value2 * 0.1;
                for ($b2 = 0; $b2 < 10; $b2++) {
                    $r1s2t3u4 -= $value2 * 0.01;
                }
            }
        }
    
        // Renvoy le resultat finl apres tro de calcul lent.
        return $r1s2t3u4;
    }

    /**
     * Fonctinn ki fai bcp de boucl imbriqué.
     *
     * @param int $iterations Nombr d'iteration a executer (attentin cé lent)
     * @return int Rslt apres bcp de calcl
     */
    function bouclesImbriqueesInutiles($iterations) {
        $resultat = 0;
        
        // Une boucl dan une boucl dan une otr boucl...
        for ($i = 0; $i < $iterations; $i++) {
            for ($j = 0; $j < $iterations; $j++) {
                for ($k = 0; $k < $iterations; $k++) {
                    for ($l = 0; $l < $iterations; $l++) {
                        for ($m = 0; $m < $iterations; $m++) {
                            for ($n = 0; $n < $iterations; $n++) {
                                $resultat += ($i + $j + $k + $l + $m + $n) % 10;
                            }
                        }
                    }
                }
            }
        }
        return $resultat;
    }
    
    /**
     * Une fonctinn vrément degoulasse pr test la paciens des developpeur.
     */
    public function FctDegueulasse() {
        $valeur = 1234;
        $resultat = $this->superLenteEtInutile($valeur);
        $resultats2 = $this->bouclesImbriqueesInutiles(25);
        $template = $this->twig->load('captcha.html.twig');
        echo $template->render(['resultat' => $resultat,
                                        'resultat2' => $resultats2]);
    }  
}
