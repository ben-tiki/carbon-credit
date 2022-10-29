var hideRenewable = false;

// if "h" key is pressed, hide renewable energy
document.addEventListener("keydown", function (event) {
    if (event.key === "h") {
        hideRenewable = !hideRenewable;

        if (hideRenewable) {
            // hide renewable energy
            document.getElementById("renewable").style.display = "none";
        } else {
            // display renewable energy
            document.getElementById("renewable").style.display = "block";
        }
    }
});