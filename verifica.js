document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("utilizator"))
        window.location.href = "login.html"
})