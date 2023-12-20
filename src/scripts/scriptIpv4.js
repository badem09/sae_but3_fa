// ajoute un événement lorsque le bouton est cliqué
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // recupere les valeurs de l'ip et du cidr
    let ipAddress = document.getElementById("ip").value;
    let cidrNotation = document.getElementById("cidr").value;

    // liste des valeurs des sous reseaux
    let val_sr_value = [];

    // verifie que les valeurs des sous reseaux sont valide
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

    // si l'ip est bien une ipv4
    if (isIPv4(ipAddress)) {
        // verifie que le cidr est valide
        if (cidrNotation && parseInt(cidrNotation) >= 1 && parseInt(cidrNotation) <= 30) {
            // retourne dans result les valeur pour l'ip le cird et les valeur de sous reseaux
            let result = calcSr(ipAddress, cidrNotation, val_sr_value);
            // si le calcule a marché
            if (result != null){
                const tbody = document.querySelector("#results-table tbody");

                tbody.innerHTML = "";
                    //fabrique le tableau grace au resultat
                    for (let i = 0; i < result.length; i++) {
                        const newRow = document.createElement("tr");
                        const adresse = document.createElement("td");
                        adresse.textContent = result[i].adresse;
                        const masque = document.createElement("td");
                        masque.textContent = result[i].masque;
                        const cidr = document.createElement("td");
                        cidr.textContent = result[i].cidr;
                        const machines = document.createElement("td");
                        machines.textContent = result[i].machines;

                        newRow.appendChild(adresse);
                        newRow.appendChild(masque);
                        newRow.appendChild(cidr);
                        newRow.appendChild(machines);

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


// retroune true si le champ est une ipv6 et false si ce n'est pas le cas
function isIPv4(str) {
    // ceci est le pattern d'une ipv4
    const ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // vérification du match entre l'ip est le pattern
    return ipv4.test(str);
}

// fonction de calcule
function calcSr(ip, CIDR, indicesMachines) {
    // recupere le cidr en int
    const cidr = parseInt(CIDR);

    // verifie le cidr
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return null;
    }

    // calcule toutes les adresse possible
    const adressesPossibles = Math.pow(2, 32 - cidr);
    const sousReseaux = [];

    // verifie cela ne depasse pas les adresses possible
    for (const indiceMachines of indicesMachines) {
        if (indiceMachines <= 0 || indiceMachines > adressesPossibles) {
            return null;
        }


        let masqueOptimal = cidr;
        let adressesDisponibles = adressesPossibles;

        // calcule de masque optimal
        while (adressesDisponibles / 2 >= indiceMachines) {
            masqueOptimal++;
            // si le masque optimal est superieur a 30 alors return 30 evite des erreurs
            if (masqueOptimal >=30){
                masqueOptimal = 30;
                break;
            }
            adressesDisponibles /= 2;
        }

        // convretie le masque optmal en binaire
        const masqueBinaire = '1'.repeat(masqueOptimal).padEnd(32, '0');
        const masqueDecimal = masqueBinaire.match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');

        // renvoi dans une liste les valeurs suivante
        sousReseaux.push({
            adresse: ip,
            masque: masqueDecimal,
            cidr: masqueOptimal,
            machines: indiceMachines
        });

        // donne l'ip en binaire
        const ipBinaire = ip.split('.').map(segment => parseInt(segment).toString(2).padStart(8, '0'));
        const ipDecimale = parseInt(ipBinaire.join(''), 2) + indiceMachines;
        // donne l'ip de depart pour le prochain sous reseaux
        ip = ipDecimale.toString(2).padStart(32, '0').match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');
    }

    return sousReseaux;
}