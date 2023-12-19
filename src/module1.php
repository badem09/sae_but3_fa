<!doctype html>
<html lang="fr">
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

	<?php require("header.php");?>
	
	<div class="content">
	<h2> Module 1 : Ping d'une adresse Ipv4 </h2>
		<label for='adr_ip'> Adresse Ip à ping : </label>
		<input type="text" id="input_adr_ip" required/>
		<br>
		<label for='adr_ip'> Nombre de paquets à envoyer </label>
		<input id="input_nb_paquets" type="number" min="1" max="100"/> 
		<br>
		<button id='btn_adr_ip'> Envoyer </button>
		<div id='ping_res'></div>
	</div>
	
	<?php require("footer.php");?>
<script> 
    function showImage() {
            var imageContainer = document.getElementById("ping_res");
            imageContainer.innerHTML = '<img src="img/loading.webp" alt="Chargement">';
        }
    function isValidIPAddress(input) {
		var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
		return ipRegex.test(input);
	}

    $('body').on('click', '#btn_adr_ip', function (){
    	showImage();
    	$adr_ip = document.getElementById("input_adr_ip").value
    	$nb_paquets = document.getElementById("input_nb_paquets").value
    	if (isValidIPAddress($adr_ip)){
			$("#ping_res").load(("module1_ping.php?adr_ip="+$adr_ip + "&nb_paquets=" + $nb_paquets ) , function(a,b,c) {});
		}
		else {
			alert('Ip not valid');
		}

	});
    
    
</script>
</html>
