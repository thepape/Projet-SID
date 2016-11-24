<?php

include "Connecteur.php";

$connecteur = new Connecteur();
$pdo = $connecteur->getPDO();

////// RECUPERATION DES FILTRES ////////
$ville = null;
$filiere = null;

if(isset($_GET["ville"]))
    $ville = $_GET["ville"];

///// ECRITURE REQUETE /////////



$requete = ' SELECT nom_etablissement, nom_ville, annee, tx_acces_seconde, tx_acces_premiere, tx_acces_terminale FROM InfoEtab ' .
' INNER JOIN Etablissement on etablissement.id_etablissement = InfoEtab.id_etablissement'. 
' inner join Ville on etablissement.id_ville = ville.id_ville';

$params = 0;

if($ville != null || $filiere != null){
    $requete .= " WHERE ";
}

if($ville != null){
    $requete .= ' ( nom_ville = "'. strtoupper($ville) .'" OR nom_ville = "'. strtoupper($ville).' CEDEX" ) ';
    $params++;
}


////// ENVOI REQUETE ///////

$reponse = $pdo->query($requete);


////// manipulations ///////
$liste = array();


while($ligne = $reponse->fetch()){

   

    //le niveau 1 concerne les lycees
    $lycee = $ligne["nom_etablissement"];

    if(!isset($liste[$lycee])){
        $liste[$lycee] = array();
    }
    
    //niveau 2 : taux pour chaque année
    $annee = $ligne["annee"];
    
    $liste[$lycee][$annee]["tx_acces_seconde"] = $ligne["tx_acces_seconde"];
    $liste[$lycee][$annee]["tx_acces_premiere"] = $ligne["tx_acces_premiere"];
    $liste[$lycee][$annee]["tx_acces_terminale"] = $ligne["tx_acces_terminale"];
    
}

$reponse->closeCursor();

$JSON = json_encode($liste);

echo $JSON;

?>