// ajout d'un événements pour le formulaire
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // recupere les valeurs de  IP et CIDR
    let ipAddress = document.getElementById("ip").value;
    let cidrNotation = document.getElementById("cidr").value;

    let val_sr_value = [];

    // boucle for pour valider et recuperer les valeur des sous reseaux
    for (let i = 0; i < 50; i++) {
        const val_sr = document.getElementById("val_sr" + i);
        if (val_sr) {
            // Si la valeur du sous reseau est nombre valide et > ou = 1
            if (parseInt(val_sr.value) >= 1){
                val_sr_value.push(parseInt(val_sr.value));
            }
            else {
                val_sr.value = "";
            }
        }
    }

    // valide l'adresse IP
    if (isIPv4(ipAddress)) {
        // valide le CIDR (1 >= cidr >= 30)
        if (cidrNotation && parseInt(cidrNotation) >= 1 && parseInt(cidrNotation) <= 30) {
            // calcule des sous reseaux
            let result = calcSr(ipAddress, cidrNotation, val_sr_value.sort((a, b) => b - a));

            // Si le calcul des sous reseau est bon
            if (result != null){
                const tbody = document.querySelector("#results-table tbody");

                // clear le tableau
                tbody.innerHTML = "";

                // construction du tableau avec les valeurs obtenu
                for (let i = 0; i < result.length; i++) {
                    const newRow = document.createElement("tr");
                    newRow.appendChild(newCellule(result[i].adresse));
                    newRow.appendChild(newCellule(result[i].masque));
                    newRow.appendChild(newCellule(result[i].cidr));
                    newRow.appendChild(newCellule(result[i].machines));
                    newRow.appendChild(newCellule(result[i].machinesMax));
                    newRow.appendChild(newCellule(result[i].assignableRange));
                    newRow.appendChild(newCellule(result[i].broadcast));

                    // ajout de la ligen dans le tbaleau
                    tbody.appendChild(newRow);
                }
            }
            else {
                alert("données incorrect");
            }
        }
        else {
            alert("error cidr (0-30)");
        }
    } else {
        alert("error ip");
    }
});

// fonction pour créé une cellule dans le tableau
function newCellule(data) {
    const cellule = document.createElement("td");
    cellule.textContent = data;
    return cellule;
}


// Ajout d'un événement pour les tableaux des sous reseaux
document.getElementById("nb_sr").addEventListener('input', function() {
    // recupere en int la valeur du nombre de sous reseaux
    const valeur_nb_reseaux = parseInt(document.getElementById("nb_sr").value);

    // check que la valeur est dans [1, 50]
    if (valeur_nb_reseaux >= 1 && valeur_nb_reseaux <= 50 && typeof valeur_nb_reseaux === 'number'){
        // recupere la div sous reseau
        const nb_reseaux_div = document.getElementById("sous_reseaux");
        // clear la div
        nb_reseaux_div.innerHTML = "";

        // boucle qui genere les champs pour les sous reseaux
        for (let i = 1; i <= valeur_nb_reseaux; i++){
            nb_reseaux_div.innerHTML +=
                `<div class="input_form">
                <label for="val_sr${i}">Machines par sous réseaux n°${i} :</label>
                <input type="number" id="val_sr${i}" name="val_sr${i}" required>
                </div>`;
        }
    }
    else {
        // si la valeur est incorrecteon afficher l'erreur
        const nb_reseaux_div = document.getElementById("sous_reseaux");
        nb_reseaux_div.innerHTML = "<p style='color: red'>Saisie incorrecte</p>";
    }
});

/**
 * verifi si l'adresse IPv4 est valide
 * @param {string} str - L'ip a check
 * @returns {boolean} retourne si elle est bien une ipv4.
 */
function isIPv4(str) {
    // schema d'une ipV4
    const ipv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // test si l'ip respecte le schema
    return ipv4.test(str);
}

/**
 * Calcule les sous-réseaux
 * @param {string} ip - ip du reseau principal
 * @param {string} CIDR - CIDR du resaeu principal
 * @param {Array<number>} ListSR - Une liste de numero correspondant au nombre de machine sur chaque sous reseau
 * @returns {Array<object> | null} - Retourne un tableau avec les sous reseaux ou null si c'est impossible
 */
function calcSr(ip, CIDR, ListSR) {
    const cidr = parseInt(CIDR);

    // check la validité du cidr
    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return null;
    }

    // calcule le nombre max de machine sur le reseau grace au cidr
    const adressesPossibles = Math.pow(2, 32 - cidr);
    const sousReseaux = [];
    let DepartIP = ipToDecimal(mettreAZeroSousCIDR(ip,cidr)); // donne l'ip de depart et la met a 0 par rapport au cidr

    // boucle qui verifie si les sous reseaux sont possible grace au cidr
    for (const NbMachines of ListSR) {
        if (NbMachines <= 0 || NbMachines > adressesPossibles) {
            return null;
        }

        let masqueOpti = cidr;
        let adressesDispo = adressesPossibles;

        // donne le cidr opti pour le nombre de machine
        while (adressesDispo / 2 >= NbMachines) {
            masqueOpti++;
            if (masqueOpti >= 30) {
                masqueOpti = 30; // masque max 30
                break;
            }
            adressesDispo /= 2;
        }

        // convertie le masque opti en binaire puis en decimal pour avoir ce format 255.255.255.255
        const masqueBinaire = '1'.repeat(masqueOpti).padEnd(32, '0');
        const masqueDecimal = masqueBinaire.match(/.{8}/g).map(segment => parseInt(segment, 2)).join('.');

        let sousReseauIP = decimalToIp(DepartIP); // Converti l'ip de depart au format ip normal
        let lastIP = getLastIPAddress(sousReseauIP, masqueOpti); // donne la derniere ip du sous reseau c'est la broadcast
        DepartIP = ipToDecimal(lastIP) + 1; // redevient en decimal pour la prochaine boucle

        // donne un tableau de toutes les valeurs
        sousReseaux.push({
            adresse: sousReseauIP,
            masque: masqueDecimal,
            cidr: masqueOpti,
            machines: NbMachines,
            machinesMax: adressesDispo - 2, // nombre maximal de machines sur le reseau (-2 pour reseau et broadcast)
            assignableRange: `${incrementIp(sousReseauIP,1)} - ${incrementIp(lastIP,-1)}`, // plage d'adresses sur le sous reseeau
            broadcast: lastIP // adresse broadcast
        });
    }

    return sousReseaux;
}

/**
 * convertie une adresse IP en decimal
 * @param {string} ip - IP
 * @returns {number} - iP en decimal
 */
function ipToDecimal(ip) {
    // convertie chaque octet en decimal pour former un seul nombre
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

/**
 * convertie une ip decimal en ip normal
 * @param {number} num - ip decimal
 * @returns {string} - Ip normal
 */
function decimalToIp(num) {
    // Convertie un nombre décimal en ipv4
    return [(num >> 24) & 255, (num >> 16) & 255, (num >> 8) & 255, num & 255].join('.');
}

/**
 * Incremente une ip
 * @param {string} ip - Ip.
 * @param {number} num - valeur a incrementer
 * @returns {string} - ip
 */
function incrementIp(ip, num) {
    let decimalIp = ipToDecimal(ip);

    // ajout du nombre
    decimalIp += num;

    // retour au format normal
    return decimalToIp(decimalIp);
}

/**
 * pour mettre une ip au minimun de son cidr
 * @param {string} ip - ip
 * @param {number} cidr - cidr
 * @returns {string} - ip au minimun du cidr ou ip invalide
 */
function mettreAZeroSousCIDR(ip, cidr) {
    // split chaque morceau de l'ip entre chaque "."
    const octets = ip.split(".");

    // check que c'est bien la bonne taille
    if (octets.length !== 4) {
        return "Adresse IP invalide";
    }

    // donne le nombre de bit a mettre a 0
    const bitsAZero = 32 - cidr;

    // cree le masque a appliquer pour mettre a 0
    const masque = (0xFFFFFFFF << bitsAZero) >>> 0;

    // applique le masque
    for (let i = 0; i < 4; i++) {
        octets[i] = (octets[i] & (masque >> (8 * (3 - i)))) >>> 0;
    }

    // retourne l'ip ou bon format
    return octets.join(".");
}

/**
 * Donne la dernier ip du reseau (Broacast)
 * @param {string} ip - ip
 * @param {number} cidr - cidr
 * @returns {string} - derniere ip
 */
function getLastIPAddress(ip, cidr) {
    // convertie l'ip en binaire et donne le nombre max de cette ip grace au cidr
    const octets = ip.split('.');
    const decimalIP = (parseInt(octets[0]) << 24) | (parseInt(octets[1]) << 16) | (parseInt(octets[2]) << 8) | parseInt(octets[3]);
    const numAddresses = 2 ** (32 - cidr);
    const lastIPAddress = decimalIP + numAddresses - 1;

    // redonne l'ip au bon format
    return [(lastIPAddress >> 24) & 0xff, (lastIPAddress >> 16) & 0xff, (lastIPAddress >> 8) & 0xff, lastIPAddress & 0xff].join('.');
}


/**
 * test la fonction isIPv4
 */
function testIsIPv4() {
    const testCases = [
        { ip: "192.168.1.1", expected: true },
        { ip: "255.255.255.255", expected: true },
        { ip: "0.0.0.0", expected: true },
        { ip: "256.0.0.1", expected: false },
        { ip: "-1.0.0.0", expected: false },
        { ip: "192.168.1", expected: false },
        { ip: "192.168.1.1.1", expected: false },
        { ip: "abc.def.ghi.jkl", expected: false },
        { ip: "192.168.1.1a", expected: false }
    ];

    testCases.forEach(test => {
        const result = isIPv4(test.ip);

        console.log(`Test ${test.ip}: ${result === test.expected ? 'PASS' : 'FAIL'}`);
    });
}

/**
 * test la fonction calcSr avec différents cas.
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