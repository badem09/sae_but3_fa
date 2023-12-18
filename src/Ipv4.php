<link rel="stylesheet" href="styles/styleIpv4.css">
<?php
include("header.php");
?>
<div class="main">
    <p>Module 3 : Subnet Calculator</p>
    <p>Cette page vous permet de d’obtenir une division de sous-réseaux logiques à partir d’une adresse IPv4 et ub mask avec la notation CIDR.</p>
    <form action="traitement.php" method="post">
        <div class="input_form">
            <label for="ip">Adresse IP (IPv4) :</label>
            <input type="text" id="ip" name="ip" required>
        </div>
        <div class="input_form">
            <label for="nb_sr">Nombre de sous-réseaux :</label>
            <input type="number" id="nb_sr" name="nb_sr" required>
        </div>
        <div class="input_form">
            <label for="nb_ip">Nombre d’adresse IP par sous-réseaux :</label>
            <input type="number" id="nb_sr" name="nb_ip" required>
        </div>
        <div class="input_form">
            <input type="submit" value="Envoyer">
        </div>
    </form>
    <p>Resultats :</p>
    <table>
        <thead>
            <td>Sous-réseaux</td>
            <td>Adresse</td>
            <td>Masque</td>
            <td>Plage</td>
            <td>Broadcast</td>
        </thead>
    </table>
</div class="main">
<?php
include("footer.php");
?>