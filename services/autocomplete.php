<?php

include "Connecteur.php";

$connecteur = new Connecteur();
$pdo = $connecteur->getPDO();

////// RECUPERATION DES FILTRES ////////
$ville = "";

if(isset($_GET["term"]))
    $ville = $_GET["term"];


///// ECRITURE REQUETE /////////

$requete = " SELECT DISTINCT ville_etablissement FROM Etablissement where ville_etablissement LIKE '%" . $ville . "%' ";



////// ENVOI REQUETE ///////

$reponse = $pdo->query($requete);



////// manipulations ///////
$liste = array();
$inc = 0;


while($ligne = $reponse->fetch()){

    $liste[$inc]= $ligne["ville_etablissement"];
    $inc++;
}

$reponse->closeCursor();

$JSON = json_encode($liste);

echo $JSON;

?>