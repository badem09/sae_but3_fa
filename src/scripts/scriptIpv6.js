// ajoute un événement lorsque le bouton est cliqué
document.getElementById("subnet-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // recupere l'élément ipV6
    const ipv6 = document.getElementById("ip");
    // check si la valeur correspond a une ipv6
    if (isIPv6(ipv6.value)){
        // recupere l'élément simplification
        const simp = document.getElementById("simp");
        // fait l'opération pour avoir la simplification et l'affiche sur la page
        simp.value = simplifier_Binaire_Type_ipv6(ipv6.value).adresseIPv6Simplifiee;
        // recupere l'élément binaire
        const binaire = document.getElementById("binaire");
        // fait l'opération pour avoir les binaires et l'affiche sur la page
        binaire.value = simplifier_Binaire_Type_ipv6(ipv6.value).binaireOctetsDePoidsFort;
        // recupere l'élément type
        const type = document.getElementById("type");
        // fait l'opération pour avoir le type et l'affiche sur la page
        type.value = simplifier_Binaire_Type_ipv6(ipv6.value).typeAdresseIPv6;
    }
    else {
        // renvoie une erreur si le champs n'est pas une ipv6
        alert("Ip invalide");
    }
});

// retroune true si le champ est une ipv6 et false si ce n'est pas le cas
function isIPv6(ip) {
    // ceci est le pattern d'une ipv6
    const ipv6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
    // vérification du match entre l'ip est le pattern
    if (ipv6.test(ip)) {
        const parties = ip.split(':');
        for (let partie of parties) {
            // check si l'ip a moins de 4 éléments par partie
            if (partie.length > 4) {
                return false;
            }
        }
        return true;
    }
    return false;
}


// cette fonction prend une ipv6 en entrée et retourne sa simplification ainsi que ses bits de poid fort et son type
function simplifier_Binaire_Type_ipv6(ip) {
    // simplification
    // Supprimer les zéros inutiles
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

    // Si un groupe de zéros a été trouvé remplacez-le par ::
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

