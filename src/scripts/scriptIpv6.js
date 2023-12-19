document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const ipv6 = document.getElementById("ip");
    if (isIPv6(ipv6.value)){
        const simp = document.getElementById("simp");
        simp.value = simplifierIPv6AvecBinaireEtType(ipv6.value).adresseIPv6Simplifiee;
        const binaire = document.getElementById("binaire");
        binaire.value = simplifierIPv6AvecBinaireEtType(ipv6.value).binaireOctetsDePoidsFort;
        const type = document.getElementById("type");
        type.value = simplifierIPv6AvecBinaireEtType(ipv6.value).typeAdresseIPv6;
    }
    else {
        alert("Ip invalide");
    }
});

function isIPv6(ip) {
    const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
    if (ipv6Regex.test(ip)) {
        const parts = ip.split(':');
        for (let part of parts) {
            if (part.length > 4) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function simplifierIPv6AvecBinaireEtType(ip) {
    // Supprimer les zéros inutiles dans chaque segment
    const segments = ip.split(":");
    for (let i = 0; i < segments.length; i++) {
        segments[i] = segments[i].replace(/^0+/, "");
    }

    // Trouver l'emplacement du groupe de zéros le plus long
    let maxZeroGroupIndex = -1;
    let maxZeroGroupLength = 0;
    let zeroGroupLength = 0;

    for (let i = 0; i < segments.length; i++) {
        if (segments[i] === "") {
            zeroGroupLength++;
            if (zeroGroupLength > maxZeroGroupLength) {
                maxZeroGroupLength = zeroGroupLength;
                maxZeroGroupIndex = i - zeroGroupLength + 1;
            }
        } else {
            zeroGroupLength = 0;
        }
    }

    // Si un groupe de zéros a été trouvé, remplacez-le par ::
    if (maxZeroGroupLength > 1) {
        segments.splice(maxZeroGroupIndex, maxZeroGroupLength, "");
    }

    // Rejoindre les segments pour former l'adresse IPv6 simplifiée
    const simplifiedIPv6 = segments.join(":");

    // Obtenir le premier segment (premier octet) et convertissez-le en entier
    const premierOctet = parseInt(segments[0], 16);

    // Déterminer le type d'adresse IPv6 en fonction du premier octet
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

    // Obtenir les 16 premiers bits en notation binaire
    const binaryPrefix = segments[0] ? parseInt(segments[0], 16).toString(2).padStart(16, "0") : "";

    return {
        adresseIPv6Simplifiee: simplifiedIPv6,
        binaireOctetsDePoidsFort: binaryPrefix,
        typeAdresseIPv6: typeAdresse
    };
}

