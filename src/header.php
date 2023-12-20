<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>SAÉ de Noël</title>
    <link rel="stylesheet" href="styles/style.css">
    <link rel="icon" type="image/x-icon" href="img/logo.png">
    <script src="scripts/script.js"></script>
</head>
<body>
<?php
    function acceuil($val){
        if ($val == 1){
            echo "<header>
                  <button id='redirectButton'>Acceuil</button>
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

