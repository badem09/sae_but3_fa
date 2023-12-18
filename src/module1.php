<!doctype html>
<html lang="fr">

	<?php require("header.html");?>
	
	<div class="content">
	<h2> Module 1 : Ping d'une adresse Ipv4 </h2>
	<label for='adr_ip'> Adresse Ip à ping : </label>
	<input type="text" id="adr_ip" required/>
	<button onclick="ping()"> Envoyer </button>
	</div>
	
	<?php require("footer.html");?>
<script> 
	//to do:
	/*
	get the adr_ip 
	get the required to work
	*/
    function ping() {
      // Make a fetch request to a server-side script (e.g., runCommand.php)
      fetch('runCommand.php?adr_ip='+) // Adjust the URL to your server-side script
        .then(response => response.json())
        .then(data => {
          console.log('Command output:', data.output);
          // Handle the output as needed
        })
        .catch(error => console.error('Error:', error));
    }
    
</script>
</html>
