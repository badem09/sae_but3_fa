// ajout d'un événement pour le formulaire.
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // recupere l'ip
    const ipv6 = document.getElementById("ip");

    // verifie si l'ipv6 est bonne
    if (isIPv6(ipv6.value)) {

        // calcule pour l'ip
         const result = simplifier_Binaire_Type_ipv6(ipv6.value);

        // recupere la case simplification
        const simp = document.getElementById("simp");

        // donne le resultat a la case simp
        simp.value = result.adresseIPv6Simplifiee;

        // recupere la case binaire
        const binaire = document.getElementById("binaire");

        // donne le resultat a la case bianire
        binaire.value = result.binaireOctetsDePoidsFort;

        // recupere la case type
        const type = document.getElementById("type");

        // donne le resultat a la case type
        type.value = result.typeAdresseIPv6;
    } else {
        // si l'ip n'est pas bonne il retoune cette erreur
        alert("Ip invalide");
    }
});


/**
 * verfie que l'ipv6 est valide
 * @param {string} ip - IP
 * @returns {boolean} retourne true or false
 */
function isIPv6(ip) {
    // patterne d'une ipvV6
    const ipv6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

    // regarde si l'ip repond bien au patterne
    if (ipv6.test(ip)) {
        // coupe l'ip en morceau
        const parties = ip.split(':');

        // parcour les partie de l'ip
        for (let partie of parties) {
            // verifie que l'ip n'est pas trop longue
            if (partie.length > 4) {
                return false;
            }
        }

        return true;
    }

    return false;
}

/**
 * simplifie donne le binaire et le type d'une ipv6
 * @param {string} ip - ip
 * @returns {object} un object avec les valeurs pour l'ip
 */
function simplifier_Binaire_Type_ipv6(ip) {

    let ipArray = ip.split(":"); // diviser l'IPv6 en sous tableau

    // retire tous les 0 inutile
    for (let i = 0; i < ipArray.length; i++) {
        let etat = 1;
        while(etat){
            if (ipArray[i][0] === "0") {
                ipArray[i] = ipArray[i].substring(1);
            }
            else {
                etat = 0;
            }
        }
    }

    // refusionne les sous tableau
    ipArray = ipArray.join(":");


    // suprime tous les ":" en trop
    for (let i = 0; i < (ipArray.length*8); i++) {
        let iModulo = i % ipArray.length ;
        if (ipArray.substring(iModulo, iModulo + 2) === "::") {
            if (iModulo + 2 < ipArray.length) {
                if (ipArray[iModulo + 2] === ":") {
                    ipArray = ipArray.substring(0, iModulo) + ipArray.substring(iModulo + 1);
                }
            }
        }
    }

    // met un 0 entre les "::" sauf au premier
    let DeuxPoints = 0
    for (let i = 0; i < ipArray.length; i++) {
        if (ipArray.substring(i, i + 2) === "::") {
            if (DeuxPoints === 1){
                ipArray = ipArray.substring(0, i) + ":0:" + ipArray.substring(i + 2);
            }
            else {
                DeuxPoints = 1;
            }
        }
    }

    const blocs = ip.split(":"); // Divisez l'adresse IPv6 en un tableau d'octets

    // convertie en bianaire le premier octet
    const premierOctet = parseInt(blocs[0], 16);

    // donne le type grace a ca
    let typeAdresse = "";
    if (premierOctet === 0x00) {
        typeAdresse = "Adresse IPv6 réservée";
    } else if ((premierOctet & 0x01) === 0x01) {
        typeAdresse = "Adresse IPv6 unicast globale";
    } else if ((premierOctet & 0x02) === 0x02) {
        typeAdresse = "Adresse IPv6 unicast lien-local";
    } else if ((premierOctet & 0x04) === 0x04) {
        typeAdresse = "Adresse IPv6 multicast";
    } else {
        typeAdresse = "Type d'adresse IPv6 non reconnu";
    }

    // convertie en string pour le rendre lisible
    const binaryPrefix = blocs[0] ? premierOctet.toString(2).padStart(16, "0") : "";

    return {
        adresseIPv6Simplifiee: ipArray,
        binaireOctetsDePoidsFort: binaryPrefix,
        typeAdresseIPv6: typeAdresse
    };
}

/**
 * Teste la fonction isIPv6
 */
function testIsIPv6() {
    const testCases = [
        { ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", expected: true },
        { ip: "2001:db8::1234::5678", expected: false },
        { ip: "2001:db8:z123::5678", expected: false },
        { ip: "1234:5678:9ABC:DEF1:2345:6789:ABCD:EF12", expected: true },
    ];

    testCases.forEach((test, index) => {
        const result = isIPv6(test.ip);

        // Affiche "PASS" si le résultat correspond à l'attendu, sinon "FAIL".
        console.log(`Test ${index + 1}: ${result === test.expected ? "PASS" : "FAIL"}`);
    });
}

/**
 * Teste la fonction simplifier_Binaire_Type_ipv6 avec différents cas.
 */
function testerSimplifier_Binaire_Type_ipv6() {
    const tests = [
        {
            input: "2001:0db8:0000:0000:0000:0000:0000:0123",
            expected: {
                adresseIPv6Simplifiee: "2001:db8::123",
                binaireOctetsDePoidsFort: "0010000000000001",
                typeAdresseIPv6: "Adresse IPv6 unicast globale",
            },
        },
        {
            input: "fe80:0000:0000:0000:0100:0000:0000:abcd",
            expected: {
                adresseIPv6Simplifiee: "fe80::100:0:abcd",
                binaireOctetsDePoidsFort: "1111111010000000",
                typeAdresseIPv6: "Type d'adresse IPv6 non reconnu",
            },
        },
        {
            input: "abcd:ef01:2345:6789:0000:0000:0000:0000",
            expected: {
                adresseIPv6Simplifiee: "abcd:ef01:2345:6789::",
                binaireOctetsDePoidsFort: "1010101111001101",
                typeAdresseIPv6: "Adresse IPv6 unicast globale",
            },
        },
        {
            input: "0000:0000:1234:5678:abcd:0000:0000:0000",
            expected: {
                adresseIPv6Simplifiee: "::1234:5678:abcd:0:",
                binaireOctetsDePoidsFort: "0000000000000000",
                typeAdresseIPv6: "Adresse IPv6 réservée",
            },
        },
        {
            input: "2001:0db8:0:0:0:0:0:0",
            expected: {
                adresseIPv6Simplifiee: "2001:db8::",
                binaireOctetsDePoidsFort: "0010000000000001",
                typeAdresseIPv6: "Adresse IPv6 unicast globale",
            },
        },
    ];

    // Parcourt chaque cas de test
    tests.forEach((test, index) => {
        const resultat = simplifier_Binaire_Type_ipv6(test.input);

        // Vérifie si le résultat correspond aux valeurs attendues.
        const reussi =
            resultat.adresseIPv6Simplifiee === test.expected.adresseIPv6Simplifiee &&
            resultat.binaireOctetsDePoidsFort === test.expected.binaireOctetsDePoidsFort &&
            resultat.typeAdresseIPv6 === test.expected.typeAdresseIPv6;

        // Affiche "PASS" ou "FAIL" en fonction du succès du test.
        console.log(`Test ${index + 1}: ${reussi ? "PASS" : "FAIL"}`);
    });
}