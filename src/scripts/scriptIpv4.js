// Ajout d'un écouteur d'événements pour gérer la soumission du formulaire.
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    // Empêche le comportement par défaut de soumission du formulaire (rechargement de la page).
    event.preventDefault();

    // Récupération des valeurs des champs IP et CIDR du formulaire.
    let ipAddress = document.getElementById("ip").value;
    let cidrNotation = document.getElementById("cidr").value;

    // Initialisation d'une liste pour stocker les valeurs des sous-réseaux.
    let val_sr_value = [];

    // Boucle pour valider et récupérer les valeurs des champs de sous-réseaux.
    for (let i = 0; i < 50; i++) {
        const val_sr = document.getElementById("val_sr" + i);
        if (val_sr) {
            // Si la valeur du sous-réseau est un nombre valide et supérieur ou égal à 1.
            if (parseInt(val_sr.value) >= 1){
                val_sr_value.push(parseInt(val_sr.value));
            }
            else {
                val_sr.value = "";
            }
        }
    }

    // Validation de l'adresse IP (doit être une IPv4 valide).
    if (isIPv4(ipAddress)) {
        // Validation de la notation CIDR (doit être un nombre entre 1 et 30).
        if (cidrNotation && parseInt(cidrNotation) >= 1 && parseInt(cidrNotation) <= 30) {
            // Calcul des sous-réseaux en utilisant les valeurs récupérées et triées.
            let result = calcSr(ipAddress, cidrNotation, val_sr_value.sort((a, b) => b - a));

            // Si le calcul des sous-réseaux est réussi.
            if (result != null){
                const tbody = document.querySelector("#results-table tbody");

                // Effacement des résultats précédents dans la table.
                tbody.innerHTML = "";

                // Construction du tableau de résultats avec les sous-réseaux calculés.
                for (let i = 0; i < result.length; i++) {
                    const newRow = document.createElement("tr");
                    newRow.appendChild(createCell(result[i].adresse));
                    newRow.appendChild(createCell(result[i].masque));
                    newRow.appendChild(createCell(result[i].cidr));
                    newRow.appendChild(createCell(result[i].machines));
                    newRow.appendChild(createCell(result[i].machinesMax));
                    newRow.appendChild(createCell(result[i].assignableRange));
                    newRow.appendChild(createCell(result[i].broadcast));

                    // Ajout de la nouvelle ligne au corps de la table.
                    tbody.appendChild(newRow);
                }
            }
            else {
                // Affichage d'une alerte en cas de données incorrectes.
                alert("données incorrect");
            }
        }
        else {
            // Affichage d'une alerte en cas de CIDR invalide.
            alert("error cidr");
        }
    } else {
        // Affichage d'une alerte en cas d'adresse IP invalide.
        alert("error ip");
    }
});

// Fonction pour créer une cellule de tableau avec du texte.
function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}


// Ajout d'un gestionnaire d'événement 'input' à un élément avec l'ID 'nb_sr'.
document.getElementById("nb_sr").addEventListener('input', function() {
    // Récupère et convertit la valeur saisie par l'utilisateur en un nombre entier.
    const valeur_nb_reseaux = parseInt(document.getElementById("nb_sr").value);

    // Vérifie si la valeur saisie est dans l'intervalle [1, 50] et est un nombre.
    if (valeur_nb_reseaux >= 1 && valeur_nb_reseaux <= 50 && typeof valeur_nb_reseaux === 'number'){
        // Récupère l'élément avec l'ID 'sous_reseaux' pour y afficher le contenu.
        const nb_reseaux_div = document.getElementById("sous_reseaux");
        nb_reseaux_div.innerHTML = ""; // Efface le contenu actuel de l'élément.

        // Boucle pour générer des champs de saisie pour chaque sous-réseau.
        for (let i = 1; i <= valeur_nb_reseaux; i++){
            // Ajoute des champs de saisie pour le nombre de machines par sous-réseau.
            nb_reseaux_div.innerHTML +=
                `<div class="input_form">
                <label for="val_sr${i}">Machines par sous réseaux n°${i} :</label>
                <input type="number" id="val_sr${i}" name="val_sr${i}" required>
                </div>`;
        }
    }
    else {
        // Si la valeur saisie est incorrecte, affiche un message d'erreur.
        const nb_reseaux_div = document.getElementById("sous_reseaux");
        nb_reseaux_div.innerHTML = "<p style='color: red'>Saisie incorrecte</p>";
    }
});

/**
 * Vérifie si une chaîne de caractères est une adresse IPv4 valide.
 * @param {string} str - La chaîne de caractères à vérifier.
 * @returns {boolean} Retourne true si la chaîne est une adresse IPv4 valide, sinon false.
 */
function isIPv4(str) {
    // Utilisation d'une expression régulière pour définir le format d'une adresse IPv4 valide.
    // Une adresse IPv4 valide est composée de quatre octets, chacun allant de 0 à 255, séparés par des points.
    // Chaque octet est défini par les parties suivantes de l'expression régulière :
    // - 25[0-5] : permet les nombres de 250 à 255
    // - 2[0-4][0-9] : permet les nombres de 200 à 249
    // - [01]?[0-9][0-9]? : permet les nombres de 0 à 199 (incluant les zéros non significatifs)
    // Chaque octet est séparé par un point ('\.').
    const ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Teste si la chaîne de caractères donnée correspond au format IPv4 défini par l'expression régulière.
    return ipv4.test(str);
}

/**
 * Calcule les sous-réseaux basés sur une adresse IP, un CIDR, et des indices de machines.
 * @param {string} ip - Adresse IP de départ pour la création des sous-réseaux.
 * @param {string} CIDR - Valeur CIDR qui détermine la taille du sous-réseau.
 * @param {Array<number>} indicesMachines - Nombre de machines nécessaires dans chaque sous-réseau.
 * @returns {Array<object> | null} - Tableau contenant les détails des sous-réseaux calculés.
 */
function calcSr(ip, CIDR, indicesMachines) {
    // Convertit le CIDR en un nombre entier pour les calculs.
    const cidr = parseInt(CIDR);

    // Vérifie la validité de la valeur CIDR.
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return null; // Retourne null si la valeur CIDR est invalide.
    }

    // Calcule le nombre total d'adresses disponibles basé sur le CIDR.
    const adressesPossibles = Math.pow(2, 32 - cidr);
    const sousReseaux = []; // Tableau pour stocker les détails des sous-réseaux.
    let currentIP = ipToDecimal(mettreAZeroSousCIDR(ip,cidr)); // Convertit l'adresse IP de départ en format décimal.

    // Boucle sur chaque indice de machine pour créer un sous-réseau.
    for (const indiceMachines of indicesMachines) {
        // Vérifie si le nombre de machines demandé est possible dans le sous-réseau.
        if (indiceMachines <= 0 || indiceMachines > adressesPossibles) {
            return null; // Retourne null si le nombre de machines est impossible.
        }

        let masqueOptimal = cidr; // Détermine le masque de sous-réseau optimal.
        let adressesDisponibles = adressesPossibles; // Nombre d'adresses disponibles dans le sous-réseau.

        // Calcule le masque optimal pour accommoder le nombre de machines demandé.
        while (adressesDisponibles / 2 >= indiceMachines) {
            masqueOptimal++;
            if (masqueOptimal >= 30) {
                masqueOptimal = 30; // Limite le masque à 30 pour éviter les erreurs.
                break;
            }
            adressesDisponibles /= 2; // Divise les adresses disponibles pour trouver le masque optimal.
        }

        // Convertit le masque optimal en format binaire, puis en format décimal.
        const masqueBinaire = '1'.repeat(masqueOptimal).padEnd(32, '0');
        const masqueDecimal = masqueBinaire.match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');

        // Calcule l'adresse de sous-réseau actuelle et la dernière adresse IP pour le sous-réseau.
        let sousReseauIP = decimalToIp(currentIP); // Convertit l'adresse actuelle en format IP.
        let lastIP = getLastIPAddress(sousReseauIP, masqueOptimal); // Calcule la dernière adresse IP.
        currentIP = ipToDecimal(lastIP) + 1; // Prépare l'adresse IP pour le prochain sous-réseau.

        // Ajoute les détails du sous-réseau calculé au tableau.
        sousReseaux.push({
            adresse: sousReseauIP,
            masque: masqueDecimal,
            cidr: masqueOptimal,
            machines: indiceMachines,
            machinesMax: adressesDisponibles - 2, // Nombre maximal de machines (-2 pour réseau et broadcast).
            assignableRange: `${incrementIp(sousReseauIP,1)} - ${getPenultimateIPAddress(lastIP)}`, // Plage d'adresses assignable.
            broadcast: lastIP // Adresse de broadcast.
        });
    }

    return sousReseaux; // Retourne le tableau des sous-réseaux.
}

/**
 * Convertit une adresse IP en format décimal.
 * @param {string} ip - Adresse IP à convertir.
 * @returns {number} - Adresse IP en format décimal.
 */
function ipToDecimal(ip) {
    // Convertit chaque octet en décimal et les combine en un seul nombre.
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

/**
 * Convertit un nombre décimal en adresse IP.
 * @param {number} num - Nombre décimal à convertir.
 * @returns {string} - Adresse IP convertie.
 */
function decimalToIp(num) {
    // Convertit le nombre décimal en 4 octets et les assemble en une adresse IP.
    return [(num >> 24) & 255, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.');
}

/**
 * Incremente une adresse IP d'un certain numéro.
 * @param {string} ip - Adresse IP a incrémenter.
 * @param {number} num - nombre a incrémenter.
 * @returns {string} - Adresse IP incrémenté.
 */
function incrementIp(ip, num) {
    // Convertir l'adresse IP en format décimal.
    let decimalIp = ipToDecimal(ip);

    // Ajouter le nombre num au nombre décimal.
    decimalIp += num;

    // Convertir le nouveau nombre décimal en adresse IP au format IPv4.
    return decimalToIp(decimalIp);
}

/**
 * Applique un masque de sous-réseau à une adresse IP basé sur un nombre CIDR.
 * @param {string} ip - L'adresse IP en format IPv4.
 * @param {number} cidr - Le nombre CIDR indiquant le masque de sous-réseau.
 * @returns {string} - L'adresse IP avec les bits sous le CIDR mis à zéro.
 */
function mettreAZeroSousCIDR(ip, cidr) {
    // Divise l'adresse IP en octets en utilisant le point comme séparateur.
    const octets = ip.split(".");

    // Vérifie que l'adresse IP est constituée de quatre octets.
    if (octets.length !== 4) {
        return "Adresse IP invalide";
    }

    // Convertit le CIDR en nombre de bits à mettre à zéro.
    const bitsAZero = 32 - cidr;

    // Crée un masque de sous-réseau en positionnant les premiers bits à 1 et les bits restants à 0.
    const masque = (0xFFFFFFFF << bitsAZero) >>> 0;

    // Applique le masque à chaque octet de l'adresse IP.
    for (let i = 0; i < 4; i++) {
        // Utilise un ET logique pour appliquer le masque à chaque octet.
        octets[i] = (octets[i] & (masque >> (8 * (3 - i)))) >>> 0;
    }

    // Reconstitue l'adresse IP à partir des octets modifiés.
    return octets.join(".");
}

/**
 * Calcule l'avant-dernière adresse IP dans un sous-réseau.
 * @param {string} ip - Adresse IP de broadcast du sous-réseau.
 * @returns {string} - L'avant-dernière adresse IP du sous-réseau.
 */
function getPenultimateIPAddress(ip) {
    // Diminue la dernière partie de l'adresse IP de 1 pour obtenir l'adresse avant le broadcast.
    const octets = ip.split('.').map(Number);
    octets[3] -= 1;
    return octets.join('.');
}

/**
 * Calcule la dernière adresse IP dans un sous-réseau.
 * @param {string} ip - Adresse IP de départ du sous-réseau.
 * @param {number} cidr - Notation CIDR indiquant le nombre de bits pour l'adresse réseau.
 * @returns {string} - Dernière adresse IP possible dans le sous-réseau.
 */
function getLastIPAddress(ip, cidr) {
    // Convertit l'adresse IP en décimal et calcule la dernière adresse IP en fonction du CIDR.
    const octets = ip.split('.');
    const decimalIP = (parseInt(octets[0]) << 24) | (parseInt(octets[1]) << 16) | (parseInt(octets[2]) << 8) | parseInt(octets[3]);
    const numAddresses = 2 ** (32 - cidr);
    const lastIPAddress = decimalIP + numAddresses - 1;

    // Convertit la dernière adresse IP en décimal en 4 octets séparés.
    return [(lastIPAddress >> 24) & 0xff, (lastIPAddress >> 16) & 0xff, (lastIPAddress >> 8) & 0xff, lastIPAddress & 0xff].join('.');
}


/**
 * Teste la fonction isIPv4 avec différents cas d'adresses IPv6.
 */
function testIsIPv4() {
    // Ensemble de cas de test, chaque cas comprend une adresse IP et le résultat attendu (true ou false).
    const testCases = [
        { ip: "192.168.1.1", expected: true },
        { ip: "255.255.255.255", expected: true },
        { ip: "0.0.0.0", expected: true },
        { ip: "256.0.0.1", expected: false }, // 256 est hors de portée
        { ip: "-1.0.0.0", expected: false }, // Les nombres négatifs ne sont pas valides
        { ip: "192.168.1", expected: false }, // Pas assez de segments
        { ip: "192.168.1.1.1", expected: false }, // Trop de segments
        { ip: "abc.def.ghi.jkl", expected: false }, // Non numérique
        { ip: "192.168.1.1a", expected: false } // Caractère non numérique
    ];

    // Parcourt chaque cas de test
    testCases.forEach(test => {
        // Appelle la fonction isIPv4 avec l'adresse IP du cas de test
        const result = isIPv4(test.ip);

        // Compare le résultat obtenu avec le résultat attendu et affiche 'PASS' ou 'FAIL'
        console.log(`Test ${test.ip}: ${result === test.expected ? 'PASS' : 'FAIL'}`);
    });
}

/**
 * Teste la fonction calcSr avec différents cas.
 */
function testCalcSr() {
    const tests = [
        {
            input: {
                ip: "192.168.1.0",
                CIDR: "24",
                indicesMachines: [60, 30]
            },
            expected: [
                {
                    adresse: "192.168.1.0",
                    masque: "255.255.255.192",
                    cidr: 26,
                    machines: 60,
                    machinesMax: 62,
                    assignableRange: "192.168.1.1 - 192.168.1.62",
                    broadcast: "192.168.1.63"
                },
                {
                    adresse: "192.168.1.64",
                    masque: "255.255.255.224",
                    cidr: 27,
                    machines: 30,
                    machinesMax: 30,
                    assignableRange: "192.168.1.65 - 192.168.1.94",
                    broadcast: "192.168.1.95"
                }
            ]
        },
        {
            input: {
                ip: "192.168.1.0",
                CIDR: "8",
                indicesMachines: [234,100,30,6]
            },
            expected: [
                {
                    adresse: "192.0.0.0",
                    masque: "255.255.255.0",
                    cidr: 24,
                    machines: 234,
                    machinesMax: 254,
                    assignableRange: "192.0.0.1 - 192.0.0.254",
                    broadcast: "192.0.0.255"
                },
                {
                    adresse: "192.0.1.0",
                    masque: "255.255.255.128",
                    cidr: 25,
                    machines: 100,
                    machinesMax: 126,
                    assignableRange: "192.0.1.1 - 192.0.1.126",
                    broadcast: "192.0.1.127"
                },
                {
                    adresse: "192.0.1.128",
                    masque: "255.255.255.224",
                    cidr: 27,
                    machines: 30,
                    machinesMax: 30,
                    assignableRange: "192.0.1.129 - 192.0.1.158",
                    broadcast: "192.0.1.159"
                },
                {
                    adresse: "192.0.1.160",
                    masque: "255.255.255.248",
                    cidr: 29,
                    machines: 6,
                    machinesMax: 6,
                    assignableRange: "192.0.1.161 - 192.0.1.166",
                    broadcast: "192.0.1.167"
                }
            ]
        },
    ];

    tests.forEach((test, index) => {
        const result = calcSr(test.input.ip, test.input.CIDR, test.input.indicesMachines);

        const testPassed = result && result.every((sr, i) =>
            sr.adresse === test.expected[i].adresse &&
            sr.masque === test.expected[i].masque &&
            sr.cidr === test.expected[i].cidr &&
            sr.machines === test.expected[i].machines &&
            sr.machinesMax === test.expected[i].machinesMax &&
            sr.assignableRange === test.expected[i].assignableRange &&
            sr.broadcast === test.expected[i].broadcast
        );

        console.log(`Test ${test.input.ip}: ${testPassed ? "Pass" : "Fail"}`);
    });
}