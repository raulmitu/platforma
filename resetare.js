document.addEventListener("DOMContentLoaded", () => {

    const resetForm = document.querySelector('#resetForm')
    const confirmForm = document.querySelector('#confirmForm')

    const resetFeedback = document.querySelector("#resetFeedback")
    const confirmFeedback = document.querySelector("#confirmFeedback")

    let loginData = {}
    let resetData = {}
    let cod = ""

    resetForm.addEventListener('submit', function(event) 
    {
        event.preventDefault()

        const formData = new FormData(resetForm)

        for (const [name, value] of formData.entries()) 
        {
            loginData[name] = value
        }

        let reference = firebase.database().ref();
        var folder = reference.child("Elevi");
        folder.child(loginData["utilizator"]).once('value').then(function(snapshot)
        {
            if (!snapshot.val() || snapshot.val() == "null")
                resetFeedback.textContent = "Utilizator incorect"
            else
            {
                cod = ""
                for(index = 0; index < 6; index++)
                    cod += Math.ceil(Math.random() * 9)

                try
                {
                    sendEmail("template_cqgu0v9", loginData["utilizator"], snapshot.val().email, cod)
                    sessionStorage.setItem("utilizator", loginData["utilizator"])
                    resetForm.classList.add("hide")
                    confirmForm.classList.remove("hide")
                }

                catch(error)
                {
                    var message = JSON.stringify(error, Object.getOwnPropertyNames(error));
                    alert(message);
                }
            }
        })
    });

    confirmForm.addEventListener('submit', function(event) 
    {
        event.preventDefault()

        const formData = new FormData(confirmForm)

        for (const [name, value] of formData.entries()) 
        {
            resetData[name] = value
        }

        let reference = firebase.database().ref();
        var folder = reference.child("Elevi");
        folder.child(sessionStorage.getItem("utilizator")).once('value').then(function(snapshot)
        {
            if (!snapshot.val() || snapshot.val() == "null")
                feedback.textContent = "Utilizator incorect"
            else if (resetData["cod"] != cod)
                confirmFeedback.textContent = "Cod Incorect"
            else if(resetData["parola"] == snapshot.val().parola)
                confirmFeedback.textContent = "Parola nu poate fi cea veche"
            else
            {
                reference = "Elevi/" + sessionStorage.getItem("utilizator")

                parola = "{\"parola\":\"" + resetData["parola"] + "\"}"

                try 
                {
                    firebase.database().ref(reference).update(JSON.parse(parola)).then(function() 
                    {
                        alert("Parola schimbata cu succes")
                        sessionStorage.setItem("parola", resetData["parola"])
                        window.location.href = "login.html"
                    });

                } 

                catch(error)
                {
                    elev.parola = parola_veche
                    var message = JSON.stringify(error, Object.getOwnPropertyNames(error));
                    alert(message);
                }
            }
        })
    })

})