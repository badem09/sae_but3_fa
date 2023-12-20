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
    pingTableBody.innerHTML = '';
}

function resetDivResume(){
    document.getElementById("div-resume").innerHTML = "";
}

function isURL(str) {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return urlPattern.test(str);
}

function updateDivResume(data) {
    console.log('updatesummary');
    var summaryDiv = document.getElementById("div-resume");
    summaryDiv.innerHTML += "<p>" + data + "</p><br>";
}


var eventSource;
var pingStarted;

$('body').on('click', '#btn_adr_ip', function (){
    console.log(pingStarted);
    $adr_ip = document.getElementById("input_adr_ip").value
    $nb_paquets = document.getElementById("input_nb_paquets").value
    var continu_checkbox = document.getElementById("input_continu")
    if (!(isValidIPAddress($adr_ip) || isURL($adr_ip))){
        alert("L'adresse n'est pas valide");
    }
    if (pingStarted == true){
        alert("Un ping a deja ete lancé. Veuillez le stopper.");
    }
    else{
        resetTable();
        resetDivResume();
        pingStarted = true;
        var url = "ping_action.php?adr_ip="+$adr_ip + "&nb_paquets=" + $nb_paquets;
        if (continu_checkbox.checked){
            url += "&continu=True";
        }
        eventSource = new EventSource(url);
        eventSource.onmessage = function (event) {
            //console.log(event.data)
            if (event.data.startsWith("data_table:") && event.data.length > 11) {
                updatePingTable(event.data.substring(11));
            } 
            else if (event.data.startsWith("data_resume:")  && event.data.length > 11) {
                updateDivResume(event.data.substring(12));
            }
            else if (event.data.startsWith("data_unvalid_ip:")  && event.data.length > 16){
                updateDivResume(event.data.substring(16));
                pingStarted = false;
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
    }
});
