<?php
require_once 'include.php';
class CaptchaDAO
{
    // Attributs
    private ?PDO $bd;

    public function __construct()
    {
        $this->bd = BD::getInstance();
    }

    public function getQuestion()
    {
        $fichierCrypter = 'encrypted_requete.txt';
        $fichierDecrypter = 'requete.txt';
        if (file_exists($fichierDecrypter)) {
            file_put_contents($fichierDecrypter, '');
        }
        function affineDecryptFile($inputFilePath, $outputFilePath) {
            $a = 5; // Clé multiplicative utilisée pour le chiffrement
            $b = 8; // Clé additive utilisée pour le chiffrement
            $m = 26; // Taille de l'alphabet (A-Z)
            
            // Vérifie si le fichier d'entrée existe
            if (!file_exists($inputFilePath)) {
                die("Erreur : Le fichier chiffré spécifié n'existe pas.");
            }
        
            // Lire le contenu du fichier chiffré
            $encryptedText = file_get_contents($inputFilePath);
            $decryptedText = "";
        
            // Trouver l'inverse modulaire de 'a' modulo 26
            $aInverse = -1;
            for ($i = 0; $i < $m; $i++) {
                if (($a * $i) % $m == 1) {
                    $aInverse = $i;
                    break;
                }
            }
            
            if ($aInverse == -1) {
                die("Erreur : 'a' n'a pas d'inverse modulaire dans Z26.");
            }
            
            // Parcourir chaque caractère du texte
            for ($i = 0; $i < strlen($encryptedText); $i++) {
                $char = $encryptedText[$i];
                
                if (ctype_alpha($char)) {
                    $base = ctype_upper($char) ? ord('A') : ord('a');
                    $decryptedChar = chr(($aInverse * ((ord($char) - $base) - $b) % $m + $m) % $m + $base);
                } else {
                    $decryptedChar = $char; // Garder les caractères non alphabétiques inchangés
                }
                
                $decryptedText .= $decryptedChar;
            }
            
            // Écrire le texte déchiffré dans le fichier de sortie
            file_put_contents($outputFilePath, $decryptedText);
            echo "Texte déchiffré écrit dans le fichier : " . $outputFilePath;
        }
        
        affineDecryptFile($fichierCrypter, $fichierDecrypter);

        // Vérifie si le fichier existe avant de le lire
        if (file_exists($fichierDecrypter)) {
            // Lis le contenu du fichier et le stocke dans $sql
            $sql = file_get_contents($fichierDecrypter);

            // Vérifie si la requête a été correctement chargée
            if ($sql !== false) {
                echo "Requête SQL chargée avec succès :\n";
                echo $sql;
            } else {
                echo "Erreur lors de la lecture du fichier SQL.";
            }
        } else {
            echo "Le fichier spécifié 'requete.txt' n'existe pas.";
        }

        $pdoStatement = $this->bd->prepare($sql);
        $pdoStatement->execute(NULL);
    }
}
