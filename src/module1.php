<!doctype html>
<html lang="fr">
<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<link rel="stylesheet" href="styles/styleIpv4.css">

	<?php require("header.php");?>
	
	<div class="main">
	<p> Module 1 : Ping d'une adresse Ipv4 </p>
        <div id="subnet-form">
            <div class="input_form">
                <label for='adr_ip'> Adresse Ip à ping : </label>
                <input type="text" id="input_adr_ip" required>
            </div>
            <div class="input_form">
                <label for='adr_ip'> Nombre de paquets à envoyer </label>
                <input id="input_nb_paquets" type="number" min="1" max="100">
            </div>
            <div class="input_form">
                <label for='input_continu'> En continu  </label>
                <input id="input_continu" type="checkbox">
            </div>
            <div class="input_form">
                <button id='btn_adr_ip'> Envoyer </button>
            </div>
        </div>
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

<script> 
    function showImage() {
        var imageContainer = document.getElementById("ping_res");
        imageContainer.innerHTML = '<img src="img/loading.webp" alt="Chargement">';
    }
    
    function isValidIPAddress(input) {
		var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
		return ipRegex.test(input);
	}
	
	function updatePingTable(result) {
        var pingTableBody = document.getElementById("pingTableBody");
        var row = document.createElement("tr");
        var timestampCell = document.createElement("td");
        var resultCell = document.createElement("td");
        var timestamp = new Date().toLocaleTimeString();
        timestampCell.textContent = timestamp;
        resultCell.innerHTML = '<pre>' + result + '</pre>';
        row.appendChild(timestampCell);
        row.appendChild(resultCell);
        pingTableBody.appendChild(row);
    }
    
    function resetTable() {
        var pingTableBody = document.getElementById("pingTableBody");
        pingTableBody.innerHTML = ''; // Clear the content of the table body
    }

    function isURL(str) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

        return urlPattern.test(str);
    }


    $('body').on('click', '#btn_adr_ip', function (){
		resetTable();
    	$adr_ip = document.getElementById("input_adr_ip").value
    	$nb_paquets = document.getElementById("input_nb_paquets").value
    	var continu_checkbox = document.getElementById("input_continu")
    	if (isValidIPAddress($adr_ip) || isURL($adr_ip)){
	    	var url = "module1_ping.php?adr_ip="+$adr_ip + "&nb_paquets=" + $nb_paquets;
	    	if (continu_checkbox.checked){
				url += "&continu=True";
			}
			//$("#ping_res").load((url) , function(a,b,c) {});
        	var eventSource = new EventSource(url);
            eventSource.onmessage = function (event) {
                if (event.data != ""){
                	updatePingTable(event.data);
                }
            };
            eventSource.onerror = function (error) {
                console.error('EventSource failed:', error);
                eventSource.close();
            };
		}
		else {
			alert('Ip not valid');
		}
	});
    
    
</script>
</html>
