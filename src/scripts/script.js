// genre pour le bouton de header le click
// attend que la page charge avant de créé un événement quand le bouton est cliqué pour renvoyer sur la page index
document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById("redirectButton");

    // créé un événement quand le bouton est cliqué
    button.addEventListener("click", function() {

        window.location.href = "index.php";
    });

    document.getElementById("menuButton").addEventListener("click", function() {
        var menu = document.getElementById("dropdownMenu");
        console.log(menu);
        if (menu.classList.contains("menu-hidden")) {
            menu.classList.remove("menu-hidden");
            menu.classList.add("menu-visible");
        } else {
            menu.classList.remove("menu-visible");
            menu.classList.add("menu-hidden");
        }
    });
});

