// genre pour le bouton de header le click
// attend que la page charge avant de créé un événement quand le bouton est cliqué pour renvoyer sur la page index
document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById("redirectButton");

    // créé un événement quand le bouton est cliqué
    button.addEventListener("click", function() {

        window.location.href = "index.php";
    });
});