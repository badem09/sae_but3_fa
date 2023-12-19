document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let ipAddress = document.getElementById("ip").value;
    let cidrNotation = document.getElementById("cidr").value;

    let val_sr_value = [];

    for (let i = 0; i < 50; i++) {
        const val_sr = document.getElementById("val_sr" + i);
        if (val_sr) {
            if (parseInt(val_sr.value) >= 1){
                val_sr_value.push(parseInt(val_sr.value));
            }
            else {
                val_sr.value = "";
            }
        }
    }

    if (isIPv4(ipAddress)) {
        if (cidrNotation && parseInt(cidrNotation) >= 1 && parseInt(cidrNotation) <= 30) {
            let result = calcSr(ipAddress, cidrNotation, val_sr_value);
            if (result != null){
                const tbody = document.querySelector("#results-table tbody");

                tbody.innerHTML = "";

                    for (let i = 0; i < result.length; i++) {
                        const newRow = document.createElement("tr");
                        const adresseCell = document.createElement("td");
                        adresseCell.textContent = result[i].adresse;
                        const masqueCell = document.createElement("td");
                        masqueCell.textContent = result[i].masque;
                        const cidrCell = document.createElement("td");
                        cidrCell.textContent = result[i].cidr;
                        const machinesCell = document.createElement("td");
                        machinesCell.textContent = result[i].machines;

                        newRow.appendChild(adresseCell);
                        newRow.appendChild(masqueCell);
                        newRow.appendChild(cidrCell);
                        newRow.appendChild(machinesCell);

                        tbody.appendChild(newRow);
                }

            }
            else {
                alert("données incorrect");
            }
        }

        else {
            alert("error cidr");
        }
    } else {
        alert("error ip");
    }
});

document.getElementById("nb_sr").addEventListener('input', function() {
    const valeur_nb_reseaux = parseInt(document.getElementById("nb_sr").value);
    if (valeur_nb_reseaux >= 1 && valeur_nb_reseaux <= 50 && typeof valeur_nb_reseaux == 'number'){
        const  nb_reseaux_div = document.getElementById("sous_reseaux");
        nb_reseaux_div.innerHTML = "";
        for (let i = 1; i <= valeur_nb_reseaux; i++){
            nb_reseaux_div.innerHTML += "" +
                "<div class=\"input_form\">" +
                "<label for=\"val_sr\">Machines par sous réseaux n°"+i+" :</label>\n" +
                "<input type=\"number\" id=\"val_sr"+i+"\" name=\"val_sr"+i+"\" required>"+
                "</div>";
        }
    }
    else {
        const nb_reseaux_div = document.getElementById("sous_reseaux");
        nb_reseaux_div.innerHTML = "";
        nb_reseaux_div.innerHTML = "<p style='color: red'>Saisie incorrecte</p>";
    }
});


function isIPv4(str) {
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return ipv4Pattern.test(str);
}

function calcSr(ip, CIDR, indicesMachines) {
    const cidr = parseInt(CIDR);

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return null;
    }

    const adressesPossibles = Math.pow(2, 32 - cidr);
    const sousReseaux = [];

    for (const indiceMachines of indicesMachines) {
        if (indiceMachines <= 0 || indiceMachines > adressesPossibles) {
            return null;
        }

        let masqueOptimal = cidr;
        let adressesDisponibles = adressesPossibles;

        while (adressesDisponibles / 2 >= indiceMachines) {
            masqueOptimal++;
            if (masqueOptimal >=30){
                masqueOptimal = 30;
                break;
            }
            adressesDisponibles /= 2;
        }

        const masqueBinaire = '1'.repeat(masqueOptimal).padEnd(32, '0');
        const masqueDecimal = masqueBinaire.match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');


        sousReseaux.push({
            adresse: ip,
            masque: masqueDecimal,
            cidr: masqueOptimal,
            machines: indiceMachines
        });

        const ipBinaire = ip.split('.').map(segment => parseInt(segment).toString(2).padStart(8, '0'));
        const ipDecimale = parseInt(ipBinaire.join(''), 2) + indiceMachines;
        ip = ipDecimale.toString(2).padStart(32, '0').match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');
    }

    return sousReseaux;
}