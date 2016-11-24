<?php

include "Connecteur.php";

$connecteur = new Connecteur();
$pdo = $connecteur->getPDO();

////// RECUPERATION DES FILTRES ////////
$ville = null;
$filiere = null;
$annee = null;

if(isset($_GET["ville"]))
    $ville = $_GET["ville"];

if(isset($_GET["filiere"]))
    $filiere = $_GET["filiere"];

if(isset($_GET["annee"]))
    $annee = $_GET["annee"];

///// ECRITURE REQUETE /////////

$requete = ' SELECT nom_etablissement, nom_ville, nom_filiere, session.annee, tx_brut_reussite, tx_acces_seconde, tx_acces_premiere, tx_acces_terminale FROM Session ' .
' INNER JOIN Etablissement on etablissement.id_etablissement = session.id_etablissement' . 
' inner join Filiere  on filiere.id_filiere = session.id_filiere ' . 
' INNER JOIN InfoEtab on session.id_etablissement = InfoEtab.id_etablissement'.
' inner join Ville on etablissement.id_ville = ville.id_ville';

$params = 0;

if($ville != null && $filiere != null && $annee != null){
    $requete .= ' WHERE  ( nom_ville LIKE "%'. strtoupper($ville) .'%" ) ' .
    ' AND nom_filiere = "' . $filiere . '"' .
    ' AND session.annee = ' . $annee;
    
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
    
    
    $liste[$lycee]["tx_acces_seconde"] = $ligne["tx_acces_seconde"];
    $liste[$lycee]["tx_acces_premiere"] = $ligne["tx_acces_premiere"];
    $liste[$lycee]["tx_acces_terminale"] = $ligne["tx_acces_terminale"];
    
    $liste[$lycee]["tx_brut_reussite"] = $ligne["tx_brut_reussite"];
}

$reponse->closeCursor();

$JSON = json_encode($liste);

echo $JSON;

?>