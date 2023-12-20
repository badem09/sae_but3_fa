<link rel="stylesheet" href="styles/styleIp.css">
<?php
require("header.php");
acceuil(1);
?>
<div class="main">
    <p>Module 3 : Subnet Calculator</p>
    <p>Cette page vous permet de d’obtenir une division de sous-réseaux logiques à partir d’une adresse IPv4 et ub mask avec la notation CIDR.</p>
    <form id="subnet-form">
        <div class="input_form">
            <label for="ip">Adresse IP (IPv4) :</label>
            <input type="text" id="ip" name="ip" required>
        </div>
        <div class="input_form">
            <label for="cidr">Masque CIDR :</label>
            <input type="number" id="cidr" name="cidr" required>
        </div>
        <div class="input_form">
            <label for="nb_sr">Nombre de sous réseaux :</label>
            <input type="number" id="nb_sr" name="nb_sr" required>
        </div>
        <div id="sous_reseaux">
        </div>
        <div class="input_form">
            <input type="submit" value="Envoyer">
        </div>
    </form>
    <p>Resultats :</p>
    <table id="results-table">
        <thead>
        <tr>
            <td>Adresse</td>
            <td>Masque</td>
            <td>CIDR</td>
            <td>Machines</td>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div class="main">
<script src="scripts/scriptIpv4.js"></script>
<?php
include("footer.php");
?>