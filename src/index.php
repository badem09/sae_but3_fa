<?php
include("header.php");
acceuil(0);
echo "<div class='Cards'>";
    $module = [
            ["nom" => "Module ping", "img" => "img/Ping.png","lien" => "ping.php"],
            ["nom" => "Module Ipv6", "img" => "img/Ipv6.png","lien" => "Ipv6.php"],
            ["nom" => "Module Ipv4", "img" => "img/Ipv4.png","lien" => "Ipv4.php"],
    ];

    foreach ($module as ["nom" => $nom, "img" => $img,"lien" => $lien]) {
        echo "<a href='$lien' class='Card'><img src=$img alt='Image 1'><p>$nom</p></a>";
    }

echo "</div>";

include("footer.php");

