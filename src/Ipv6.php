<link rel="stylesheet" href="styles/styleIpv4.css">
<link rel="stylesheet" href="styles/styleIpv6.css">
<?php
require("header.php");
acceuil(1);
?>
<div class="main">
    <p>Module 2 : IPv6</p>
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
            <label>Simplification :</label>
            <label>
                <textarea disabled id="simp"></textarea>
            </label>
        </div>
        <div>
            <label>Bits de poid fort :</label>
            <label>
                <textarea disabled id="binaire"></textarea>
            </label>
        </div>
        <div>
            <label>Son type :</label>
            <label>
                <textarea disabled id="type"></textarea>
            </label>
        </div>
    </div>
</div>
<script src="scripts/scriptIpv6.js"></script>
    <?php
include("footer.php");
?>
