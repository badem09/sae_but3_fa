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
        var url = "ping_action.php?adr_ip="+$adr_ip + "&nb_paquets=" + $nb_paquets;
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

