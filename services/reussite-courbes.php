<?php

include "Connecteur.php";

$connecteur = new Connecteur();
$pdo = $connecteur->getPDO();

////// RECUPERATION DES FILTRES ////////
$ville = null;
$filiere = null;

if(isset($_GET["ville"]))
    $ville = $_GET["ville"];
if(isset($_GET["filiere"]))
    $filiere = $_GET["filiere"];

///// ECRITURE REQUETE /////////

$requete = ' SELECT nom_etablissement, ville_etablissement, nom_filiere, annee, tx_brut_reussite FROM Session ' .
' INNER JOIN Etablissement on etablissement.id_etablissement = session.id_etablissement' . 
' inner join Filiere  on filiere.id_filiere = session.id_filiere ';

$params = 0;

if($ville != null || $filiere != null){
    $requete .= " WHERE ";
}

if($ville != null){
    $requete .= ' ( ville_etablissement = "'. strtoupper($ville) .'" OR ville_etablissement = "'. strtoupper($ville).' CEDEX" ) ';
    $params++;
}

if($filiere != null){
    if($params>0){
        $requete .= " AND ";
    }
    
    $requete .= ' nom_filiere = "'. $filiere.'"';
}

////// ENVOI REQUETE ///////

$reponse = $pdo->query($requete);


////// manipulations ///////
$listeFilieres = array();


while($ligne = $reponse->fetch()){

    //le niveau 1 concerne les filieres
    $f = $ligne["nom_filiere"];

    if(!isset($listeFilieres[$f])){
        $listeFilieres[$f] = array();
    }
    
    $annee = $ligne["annee"];
    
    if(!isset($listeFilieres[$f][$annee])){
        $listeFilieres[$f][$annee] = array();
    }
    
    $lycee = $ligne["nom_etablissement"];
    
    $listeFilieres[$f][$annee][$lycee] = $ligne["tx_brut_reussite"];
    
}

$reponse->closeCursor();

$JSON = json_encode($listeFilieres);

echo $JSON;

?>