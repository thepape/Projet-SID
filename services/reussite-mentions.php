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

$requete = ' SELECT nom_etablissement, ville_etablissement, nom_filiere, session.annee, tx_mention_AB, tx_mention_B, tx_mention_TB FROM Session ' .
' INNER JOIN Etablissement on etablissement.id_etablissement = session.id_etablissement' . 
' inner join Filiere  on filiere.id_filiere = session.id_filiere '.
' inner join InfoEtab on etablissement.id_etablissement=infoetab.id_etablissement';

$params = 0;

if($ville != null || $filiere != null || $annee != null){
    $requete .= " WHERE ";
}

if($ville != null){
    $requete .= ' ( ville_etablissement = "'. strtoupper($ville) .'" OR ville_etablissement = "'. strtoupper($ville).' CEDEX" ) ';
    $params++;
}

if($annee != null){
    if($params>0){
        $requete .= " AND ";
    }
    $requete .= 'session.annee = '. $annee;
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

    //le niveau 2 concerne les lycees
    $lycee = $ligne["nom_etablissement"];

    if(!isset($listeFilieres[$f][$lycee])){
        $listeFilieres[$f][$lycee] = array();
    }
    
    //niveau 3 : taux pour chaque année
    $annee = $ligne["annee"];
    
    $listeFilieres[$f][$lycee][$annee][0] = $ligne["tx_mention_AB"];
     $listeFilieres[$f][$lycee][$annee][1] = $ligne["tx_mention_B"];
      $listeFilieres[$f][$lycee][$annee][2] = $ligne["tx_mention_TB"];
    
}

$reponse->closeCursor();

$JSON = json_encode($listeFilieres);

echo $JSON;

?>