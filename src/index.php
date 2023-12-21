<?php
//include l'header sans afficher le bouton
include("header.php");

accueil(0);
echo "<div class='Cards'>";
    //Génère les différentes cards du menu
    $module = [
            ["nom" => "Module ping", "img" => "img/Ping.png", "alt" => "Image_représentation_module_Ping","lien" => "ping.php"],
            ["nom" => "Module Ipv6", "img" => "img/Ipv6.png", "alt" => "Image_représentation_module_IPv6","lien" => "Ipv6.php"],
            ["nom" => "Module Ipv4", "img" => "img/Ipv4.png", "alt" => "Image_représentation_module_IPv4","lien" => "Ipv4.php"],
    ];

    foreach ($module as ["nom" => $nom, "img" => $img,"alt" => $alt,"lien" => $lien]) {
        echo "<a href='$lien' class='Card'><img src=$img alt=$alt><p>$nom</p></a>";
    }

echo "</div>";

include("footer.php");

