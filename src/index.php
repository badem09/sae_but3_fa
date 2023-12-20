<?php
//include l'header sans afficher le bouton
include("header.php");
accueil(0);
echo "<div class='Cards'>";
    //Génère les différentes cards du menu
    $module = [
            ["nom" => "Module ping", "img" => "img/Ping.png", "alt" => "Module ping image","lien" => "ping.php"],
            ["nom" => "Module Ipv6", "img" => "img/Ipv6.png", "alt" => "Module ipv6 image","lien" => "Ipv6.php"],
            ["nom" => "Module Ipv4", "img" => "img/Ipv4.png", "alt" => "Module ipv4 image","lien" => "Ipv4.php"],
    ];

    foreach ($module as ["nom" => $nom, "img" => $img,"alt" => $alt,"lien" => $lien]) {
        echo "<a href='$lien' class='Card'><img src=$img alt=$alt><p>$nom</p></a>";
    }

echo "</div>";

include("footer.php");

