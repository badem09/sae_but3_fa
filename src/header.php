<!doctype html>
<html lang="fr">
<head>
    <!--donne tous les éléments de base ainsi que l'header de la page-->
    <meta charset="utf-8">
    <title>SAÉ de Noël</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="icon" type="image/x-icon" href="img/logo.png">
    <script src="scripts/script.js"></script>
</head>
<body>
<?php
    function accueil($val){
        // si val = 1 afficher le bouton c'est pour ne pas l'afficher dans les pages inutiles comme index
        if ($val == 1){
            echo "<header>
                  <button id='redirectButton'>Accueil</button>
                  <h1>SAÉ de Noël</h1>
                  </header>";
        }
        else{
            echo "<header>
                  <h1>SAÉ de Noël</h1>
                  </header>";
        }
    }
    ?>

