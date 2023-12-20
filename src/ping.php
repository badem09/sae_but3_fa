<!doctype html>
<html lang="fr">
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<link rel="stylesheet" href="styles/styleIp.css">
<?php
require("header.php");
accueil(1);
?>
<div class="main">
	<p> Module 1 : Ping d'une adresse Ipv4 ou URL </p>
        <div id="subnet-form">
            <div class="input_form">
                <label for='adr_ip'> Adresse à ping : </label>
        	<input type="text" id="input_adr_ip" required>
	    </div>
            <div class="input_form">
                <label for='adr_ip'> Nombre de paquets à envoyer : </label>
                <input id="input_nb_paquets" type="number" min="1" max="100">
            </div>
            <div class="input_form">
                <label for='input_continu'> En continu  </label>
                <input id="input_continu" type="checkbox">
            </div>
            <div class="input_form">
                <button id='btn_adr_ip'> Ping ! </button>
                <button id='btn_stop_ping'> Stop </button>
	    </div>
        </div>
	<div id='div_load'></div>
  	<div id='ping_res'>
		 <table id="pingTable">
			<thead>
			    <tr>
			        <td>Timestamp</td>
			        <td>Result</td>
			    </tr>
			</thead>
			<tbody id="pingTableBody"></tbody>
		</table>
	</div>
	<p> Output du Ping : </p>
	<div id="div-resume"> </div>
</div>
<script src="scripts/scriptPing.js"></script>
<?php
include("footer.php");
?>
