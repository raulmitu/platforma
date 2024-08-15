document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('#loginForm')
    const feedback = document.querySelector("#feedback")

    const username = document.querySelector("#utilizator")
    const password = document.querySelector("#parola")

    let utilizator = sessionStorage.getItem("utilizator")
    let parola = sessionStorage.getItem("parola")

    if (utilizator)
        username.value = utilizator

    if(parola)
        password.value = parola

    let loginData = {}

    form.addEventListener('submit', function(event) 
    {
        event.preventDefault();

        const formData = new FormData(form);

        for (const [name, value] of formData.entries()) 
        {
            loginData[name] = value
        }

        let reference = firebase.database().ref();
        var folder = reference.child("Elevi");
        folder.child(loginData["utilizator"]).once('value').then(function(snapshot)
        {
            if (!snapshot.val() || snapshot.val() == "null" || snapshot.val().parola != loginData["parola"])
                feedback.textContent = "Utilizator sau parola incorecte"
            else
            {
                sessionStorage.setItem("utilizator", loginData["utilizator"])
                sessionStorage.setItem("parola", loginData["parola"])
                window.location.href = "acasa.html"
            }
        })
    })

})