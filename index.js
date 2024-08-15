document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("utilizator"))
        window.location.href = "acasa.html"
    else
        window.location.href = "login.html"
})