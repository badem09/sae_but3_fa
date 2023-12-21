// Ajoute un écouteur d'événement pour gérer la soumission du formulaire.
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    // Empêche le rechargement de la page lors de la soumission du formulaire.
    event.preventDefault();

    // Récupère l'élément HTML correspondant à l'entrée de l'adresse IPv6.
    const ipv6 = document.getElementById("ip");

    // Vérifie si la valeur saisie est une adresse IPv6 valide.
    if (isIPv6(ipv6.value)) {
        // Récupère l'élément pour afficher la version simplifiée de l'adresse IPv6.
        const simp = document.getElementById("simp");

        // Calcule la version simplifiée de l'adresse IPv6 et l'affiche.
        simp.value = simplifier_Binaire_Type_ipv6(ipv6.value).adresseIPv6Simplifiee;

        // Récupère l'élément pour afficher la représentation binaire de l'adresse IPv6.
        const binaire = document.getElementById("binaire");

        // Calcule la représentation binaire de l'adresse IPv6 et l'affiche.
        binaire.value = simplifier_Binaire_Type_ipv6(ipv6.value).binaireOctetsDePoidsFort;

        // Récupère l'élément pour afficher le type de l'adresse IPv6.
        const type = document.getElementById("type");

        // Détermine le type de l'adresse IPv6 et l'affiche.
        type.value = simplifier_Binaire_Type_ipv6(ipv6.value).typeAdresseIPv6;
    } else {
        // Affiche une alerte si la valeur saisie n'est pas une adresse IPv6 valide.
        alert("Ip invalide");
    }
});


/**
 * Vérifie si une chaîne de caractères est une adresse IPv6 valide.
 * @param {string} ip - La chaîne de caractères à vérifier.
 * @returns {boolean} Retourne true si la chaîne est une adresse IPv6 valide, sinon false.
 */
function isIPv6(ip) {
    // Utilisation d'une expression régulière pour définir le format d'une adresse IPv6 valide.
    // Une adresse IPv6 valide est une suite de 8 groupes de 1 à 4 chiffres hexadécimaux séparés par des ':'
    const ipv6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;

    // Teste si l'adresse IP donnée correspond au format IPv6 défini par l'expression régulière.
    if (ipv6.test(ip)) {
        // Divise l'adresse IP en ses composants séparés par des ':'
        const parties = ip.split(':');

        // Parcourt chaque partie de l'adresse IPv6.
        for (let partie of parties) {
            // Vérifie si chaque partie a plus de 4 caractères.
            // Une partie valide ne doit pas dépasser 4 chiffres hexadécimaux.
            if (partie.length > 4) {
                return false; // Si une partie est invalide, retourne false.
            }
        }

        return true; // Si toutes les parties sont valides, retourne true.
    }

    return false; // Si l'adresse IP ne correspond pas au format IPv6, retourne false.
}

// cette fonction prend une ipv6 en entrée et retourne sa simplification ainsi que ses bits de poid fort et son type
/**
 * Simplifie une adresse IPv6, détermine son type et obtient les 16 premiers bits en binaire.
 * @param {string} ip - L'adresse IPv6 à simplifier.
 * @returns {object} Un objet contenant l'adresse IPv6 simplifiée, le type d'adresse et les 16 premiers bits en binaire.
 */
function simplifier_Binaire_Type_ipv6(ip) {
    // Supprimer les zéros de tête dans chaque bloc
    let blocs = ip.split(':').map(bloc => bloc.replace(/^0+/, '') || '0');

    // Trouver la plus longue séquence de blocs '0' consécutifs
    let maxSeqLength = 0;
    let maxSeqIndex = -1;
    let currentSeqLength = 0;

    for (let i = 0; i < blocs.length; i++) {
        if (blocs[i] === '0') {
            currentSeqLength++;
            if (currentSeqLength > maxSeqLength) {
                maxSeqLength = currentSeqLength;
                maxSeqIndex = i - currentSeqLength + 1;
            }
        } else {
            currentSeqLength = 0;
        }
    }

    // Remplacer la plus longue séquence de zéros par '::'
    if (maxSeqLength > 1) {
        blocs.splice(maxSeqIndex, maxSeqLength, '');
        if (maxSeqIndex === 0) blocs.unshift('');
        if (maxSeqIndex + maxSeqLength === blocs.length) blocs.push('');
    }

    ip = blocs.join(':');

    // Ajouter ':' à la fin si l'adresse se termine par un ':'
    if (ip[ip.length - 1] === ":") {
        ip += ":";
    }

    // Simplifier davantage si l'adresse commence par "0:0:"
    if (ip.startsWith("0:0:")) {
        ip = "::" + ip.slice(4);
    }

    // Convertir le premier bloc en entier pour déterminer le type d'adresse
    const premierOctet = parseInt(blocs[0], 16);

    // Déterminer le type d'adresse IPv6
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

    // Convertir le premier bloc en binaire pour obtenir les 16 premiers bits
    const binaryPrefix = blocs[0] ? parseInt(blocs[0], 16).toString(2).padStart(16, "0") : "";

    return {
        adresseIPv6Simplifiee: ip,
        binaireOctetsDePoidsFort: binaryPrefix,
        typeAdresseIPv6: typeAdresse
    };
}



/**
 * Teste la fonction isIPv6 avec différents cas d'adresses IPv6.
 */
function testIsIPv6() {
    // Ensemble de cas de test, chaque cas comprend une adresse IP et le résultat attendu (true ou false).
    const testCases = [
        { ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", expected: true },
        { ip: "2001:db8::1234::5678", expected: false },
        { ip: "2001:db8:z123::5678", expected: false },
        { ip: "1234:5678:9ABC:DEF1:2345:6789:ABCD:EF12", expected: true }
    ];

    // Parcourt chaque cas de test
    testCases.forEach(test => {
        // Appelle la fonction isIPv6 avec l'adresse IP du cas de test
        const result = isIPv6(test.ip);

        // Compare le résultat obtenu avec le résultat attendu et affiche 'PASS' ou 'FAIL'
        console.log(`Test ${test.ip}: ${result === test.expected ? 'PASS' : 'FAIL'}`);
    });
}

/**
 * Teste la fonction simplifier_Binaire_Type_ipv6 avec différents cas.
 */
function testerSimplifier_Binaire_Type_ipv6() {
    // Ensemble de cas de test pour la fonction simplifier_Binaire_Type_ipv6.
    // Chaque test comprend une adresse IPv6 d'entrée et le résultat attendu (adresse simplifiée, binaire et type).
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
                adresseIPv6Simplifiee: "fe80::100:0:0:abcd",
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
                adresseIPv6Simplifiee: "::1234:5678:abcd::",
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
        // Appelle la fonction simplifier_Binaire_Type_ipv6 avec l'adresse IPv6 du cas de test
        const resultat = simplifier_Binaire_Type_ipv6(test.input);

        // Vérifie si le résultat correspond au résultat attendu pour chaque aspect (adresse, binaire, type)
        const reussi =
            resultat.adresseIPv6Simplifiee === test.expected.adresseIPv6Simplifiee &&
            resultat.binaireOctetsDePoidsFort === test.expected.binaireOctetsDePoidsFort &&
            resultat.typeAdresseIPv6 === test.expected.typeAdresseIPv6;

        // Affiche 'Pass' si le test réussit, sinon 'Fail'
        console.log(`Test ${test.input}: ${reussi ? "PASS" : "FAIL"}`);
    });
}