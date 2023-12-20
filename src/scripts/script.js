document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById("redirectButton");

    button.addEventListener("click", function() {

        window.location.href = "index.php";
    });
});