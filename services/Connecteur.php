<?php

class Connecteur{
    
    private $pdo;
    
    public function __construct(){
        $host = "localhost";
        $dbname = "projet_sid";
        $user = "root";
        $mdp = "";
        
        
        $this->pdo = new PDO('mysql:host='. $host . ';dbname='.$dbname.';charset=utf8', $user, $mdp);
    }
    
    public function getPDO(){
        return $this->pdo;
    }
}

?>