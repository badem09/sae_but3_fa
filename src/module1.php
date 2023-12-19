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
		<label for='input_continu'> En continu  </label>
		<input id="input_continu" type="checkbox"/> 
		<br>
		<button id='btn_adr_ip'> Envoyer </button>
		
		<div id='ping_res'>
			 <table id="pingTable">
				<thead>
				    <tr>
				        <th>Timestamp</th>
				        <th>Result</th>
				    </tr>
				</thead>
				<tbody id="pingTableBody"></tbody>
			</table>
		</div>
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
	function updatePingTable(result) {
            var pingTableBody = document.getElementById("pingTableBody");

            // Create a new table row
            var row = document.createElement("tr");

            // Create table cells for timestamp and result
            var timestampCell = document.createElement("td");
            var resultCell = document.createElement("td");

            // Set the timestamp cell content to the current time
            var timestamp = new Date().toLocaleTimeString();
            timestampCell.textContent = timestamp;

            // Set the result cell content to the ping result
            resultCell.innerHTML = '<pre>' + result + '</pre>';

            // Append cells to the row
            row.appendChild(timestampCell);
            row.appendChild(resultCell);

            // Append the row to the table body
            pingTableBody.appendChild(row);
        }
    function resetTable() {
        var pingTableBody = document.getElementById("pingTableBody");
        pingTableBody.innerHTML = ''; // Clear the content of the table body
    }

    $('body').on('click', '#btn_adr_ip', function (){
		resetTable();
    	$adr_ip = document.getElementById("input_adr_ip").value
    	$nb_paquets = document.getElementById("input_nb_paquets").value
    	var continu_checkbox = document.getElementById("input_continu")

    	if (isValidIPAddress($adr_ip)){
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
