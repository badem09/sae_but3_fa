<?php

$adr_ip =  $_GET['adr_ip'] ;
$nb_paquets =  $_GET['nb_paquets'] ;
exec("ping -c ". $nb_paquets . " " . $adr_ip, $output, $status);
echo "Ping to $target was successful:<br>";
echo "<pre>" . implode("\n", $output) . "</pre>";

?>
