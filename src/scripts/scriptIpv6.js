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
    const morceau = ip.split(":");
    for (let i = 0; i < morceau.length; i++) {
        morceau[i] = morceau[i].replace(/^0+/, "");
    }

    // Trouver l'emplacement du groupe de zéros le plus long
    let IndexMaxGzero = -1;
    let maxGzero = 0;
    let Gzerolen = 0;

    for (let i = 0; i < morceau.length; i++) {
        if (morceau[i] === "") {
            Gzerolen++;
            if (Gzerolen > maxGzero) {
                maxGzero = Gzerolen;
                IndexMaxGzero = i - Gzerolen + 1;
            }
        } else {
            Gzerolen = 0;
        }
    }

    // Si un groupe de zéros a été trouvé remplacez-le par ::
    if (maxGzero > 1) {
        morceau.splice(IndexMaxGzero, maxGzero, "");
    }

    // Rejoindre les segments pour former l'adresse IPv6 simplifiée
    let simplifiedIPv6 = morceau.join(":");

    if(simplifiedIPv6 === ""){
        simplifiedIPv6 = "::";
    }

    // remplace les :: par des :0:
    for (let i=0;i<8;i++){
        simplifiedIPv6 = simplifiedIPv6.replace(/::(?!:)/g, (match, offset) => (offset === 0 ? match : ":0:"));
    }

    // remplace le premier ":" par un "::" si il n'est pas deja suivi par un ":"
    if(simplifiedIPv6[0] === ":" && simplifiedIPv6[1] !== ":"){
        simplifiedIPv6 = ":"+simplifiedIPv6 ;
    }

    // rajoute un "0" a la fin si il termine par un ":"
    if(simplifiedIPv6[(simplifiedIPv6.length)-1] === ":"){
        simplifiedIPv6 = simplifiedIPv6+"0" ;
    }

    // cas particuler de bug
    if(simplifiedIPv6 === "::0:0"){
        simplifiedIPv6 = "::";
    }

    // Obtenir le premier segment (premier octet) et convertissez-le en entier
    const premierOctet = parseInt(morceau[0], 16);

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
    const binaryPrefix = morceau[0] ? parseInt(morceau[0], 16).toString(2).padStart(16, "0") : "";

    return {
        adresseIPv6Simplifiee: simplifiedIPv6,
        binaireOctetsDePoidsFort: binaryPrefix,
        typeAdresseIPv6: typeAdresse
    };
}

