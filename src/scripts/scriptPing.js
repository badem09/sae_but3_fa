
function showImageLoad() {
    document.getElementById("div_load").innerHTML = '<img src="img/loading.webp" alt="Chargement">';
}

function hideImageLoad(){
    document.getElementById("div_load").innerHTML = '';
}

function isValidIPAddress(input) {
    var ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(input);
}

function isURL(str) {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return urlPattern.test(str);
}

function resetTable() {
    document.getElementById("pingTableBody").innerHTML = '';
}

function resetDivResume(){
    document.getElementById("div-resume").innerHTML = "";
}

function resetDivStat(){
    document.getElementById("ping-stats").innerHTML = "";
}

function updatePingStats(data,pingTimes) {

    // Extract time from the data string (you may need to adjust this based on your ping output)
    var timeMatch = data.match(/time=([\d.]+) ms/);
    if (timeMatch) {
        var pingTime = parseFloat(timeMatch[1]);
        pingTimes.push(pingTime);
    
        console.log(pingTimes);
        var maxTime = Math.max(...pingTimes);
        var minTime = Math.min(...pingTimes);
        var avgTime = pingTimes.reduce((sum, time) => sum + time, 0) / pingTimes.length;

        // Update HTML to display max, min, and avg
        var statsDiv = document.getElementById("ping-stats");
        statsDiv.innerHTML = `<p>Temps maximum: ${maxTime.toFixed(3)} ms</p>`;
        statsDiv.innerHTML += `<p>Temps minimum: ${minTime.toFixed(3)} ms</p>`;
        statsDiv.innerHTML += `<p>Temps minimum: ${avgTime.toFixed(3)} ms</p>`;
    }
}


function updatePingTable(data) {
    /**
     * Adds a new td : timestamp, pingResult to the table 'pingTable' and scrolls to the bottom
     */
    var pingTableBody = document.getElementById("pingTableBody");
    var row = document.createElement("tr");
    var timestampCell = document.createElement("td");
    var dataCell = document.createElement("td");
    var timestamp = new Date().toLocaleTimeString();
    timestampCell.textContent = timestamp;
    dataCell.innerHTML = '<pre>' + data + '</pre>';
    row.appendChild(timestampCell);
    row.appendChild(dataCell);
    pingTableBody.appendChild(row);

    var pingResDiv = document.getElementById("ping_res");
    pingResDiv.scrollTop = pingResDiv.scrollHeight; // scroll to the bottom
}

function getNoPing(data){
    var match = data.match(/icmp_seq=(\d+)/);
    return match && parseInt(match[1], 10);
}

function updateDivResume(data, pingCounter) {
    var pingNo = getNoPing(data);
    var divResume = document.getElementById("div-resume");
    var packetLoss = (pingNo - pingCounter) / pingNo * 100;

    divResume.innerHTML = "<p> Nombre ping transmits: " + pingNo + "</p>";
    divResume.innerHTML += "<p> Nombre ping réussi: " + pingCounter + "</p>";
    divResume.innerHTML += "<p> Pourcentage d'echec: " + packetLoss.toFixed(2) + " %</p>";
}

function toggleInputs() {
    var nbPaquetsInput = document.getElementById("input_nb_paquets");
    var continuCheckbox = document.getElementById("input_continu");

    // If "En continu" is checked, disable "Nombre de paquets"
    nbPaquetsInput.disabled = continuCheckbox.checked;

    // If "Nombre de paquets" is filled out, disable "En continu"
    continuCheckbox.disabled = nbPaquetsInput.value !== '';

    // If "Nombre de paquets" is filled out, uncheck "En continu"
    if (nbPaquetsInput.value) {
        continuCheckbox.checked = false;
    }
}


// Vide les inputs
window.onload = function() {
    document.getElementById("input_nb_paquets").value = "";
    document.getElementById("input_continu").checked = false;
};

var eventSource;
var pingStarted;

$('body').on('click', '#btn_adr_ip', function (){
    $adr_ip = document.getElementById("input_adr_ip").value
    $nb_paquets = document.getElementById("input_nb_paquets").value
    var continu_checkbox = document.getElementById("input_continu")

   //Vérifier les champs
    if (!(isValidIPAddress($adr_ip) || isURL($adr_ip))){
        alert("L'adresse n'est pas valide");
    }
    else if (!continu_checkbox.checked && $nb_paquets == ""){
        alert("Veuillez saisir le nombre de paquets ou cocher 'En continu'�");
    }
    else if (pingStarted == true){
        alert("Un ping a deja ete lancé. Veuillez le stopper.");
    }
    else{
        resetTable();
        resetDivResume();
        pingStarted = true;
        var pingCounter = 0;
        var pingTimes = [];
	var url = "ping_action.php?adr_ip=" + $adr_ip;
	if ($nb_paquets !== "") {
	    url += "&nb_paquets=" + $nb_paquets;
	}
	if (continu_checkbox.checked){
	    url += "&continu=True";
	}
	//var url = "ping_action.php?adr_ip="+$adr_ip + "&nb_paquets=" + $nb_paquets;
        //if (continu_checkbox.checked){
        //    url += "&continu=True";
        //}
        showImageLoad();
        eventSource = new EventSource(url);
        eventSource.onmessage = function (event) {
            console.log("ok",event.data);
            hideImageLoad();
            if (event.data.startsWith("data_table:") && event.data.length > 11) { // ping
                pingCounter++;
                updatePingTable(event.data.substring(11));
                updateDivResume(event.data.substring(11), pingCounter);
  		updatePingStats(event.data.substring(11), pingTimes)
            }
            else if (event.data.startsWith("data_unvalid_ip:")  && event.data.length > 16){ // ping infructueux
                alert(event.data.substring(16));
                pingStarted = false;
                eventSource.close();
            }
            else if (event.data.startsWith("data_error:")  && event.data.length > 10){ //erreur lors du ping
                alert(event.data.substring(11));
                pingStarted = false;
                eventSource.close();
            }
            eventSource.onerror = function (error){
                pingStarted = false;
                eventSource.close();
            };
        }
    }
});


$('body').on('click', '#btn_stop_ping', function () {
    if (eventSource) {
        eventSource.close();
        pingStarted = false;
        hideImageLoad();
    }
});
