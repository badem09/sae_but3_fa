<link rel="stylesheet" href="styles/styleIp.css">
<?php
require("header.php");
accueil(1);
?>

<h1 class='title'> Module 1 : Ping d'une adresse Ipv4 ou URL </h1>

<div class="vert-cont">
    <div id="ping-main">
        <div id="subnet-form">
            <div class="input_form">
                <label for='adr_ip'> Adresse à ping : </label>
                <input type="text" id="input_adr_ip" required>
            </div>
            <div class="input_form">
                <label for='adr_ip'> Nombre de paquets à envoyer : </label>
                <input id="input_nb_paquets" type="number" min="1" max="100" onchange="toggleInputs()">
            </div>
            <div class="input_form">
                <label for='input_continu'> En continu  </label>
                <input id="input_continu" type="checkbox" onchange="toggleInputs()">
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
        </div>

    <p> Output du Ping : </p>
    <div id="div-resume"></div>
</div>

<script src="scripts/scriptPing.js"></script>
</body>
</html>
<?php
include("footer.php");
?>
