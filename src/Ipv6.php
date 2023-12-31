<link rel="stylesheet" href="styles/styleIp.css">
<?php
//include l'header en affichant le bouton
require("header.php");
accueil(1);
?>
<br>
<br>
<div class="main">
    <h2>Module 2 : IPv6</h2>
    <br>
    <p>Cette page simplifie ou détaille une adresse IPv6. Elle vous donne aussi son type et l’écriture binaire de ses deux bits significatifs.</p>
    <form id="subnet-form">
        <div class="input_form">
            <label for="ip">Adresse (IPv6) :</label>
            <input type="text" id="ip" name="ip" required>
            <input type="submit" value="Envoyer">
        </div>
    </form>
    <div class="tab_val">
        <div>
            <label>Simplification : <textarea disabled id="simp"></textarea></label>
        </div>
        <div>
            <label>Bits de poid fort : <textarea disabled id="binaire"></textarea></label>
        </div>
        <div>
            <label>Son type : <textarea disabled id="type"></textarea></label>
        </div>
    </div>
</div>
<br><br><br><br><br><br><br><br><br><br><br><br><br>

<script src="scripts/scriptIpv6.js"></script>
    <?php
include("footer.php");
?>
