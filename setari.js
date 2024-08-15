document.addEventListener("DOMContentLoaded", () => {

    const utilizator = sessionStorage.getItem("utilizator")

    const passwordForm = document.querySelector('#passwordForm')
    const emailForm = document.querySelector('#emailForm')
    const confirmForm = document.querySelector('#confirmForm')

    const passwordFeedback = document.querySelector("#passwordFeedback")
    const emailFeedback = document.querySelector("#emailFeedback")
    const confirmFeedback = document.querySelector("#confirmFeedback")

    const oldPassword = document.querySelector("#parola-veche")
    const newPassword = document.querySelector("#parola-noua")
    const confirmPassword = document.querySelector("#parola-confirma")

    const oldEmail = document.querySelector("#email-vechi")
    const newEmail = document.querySelector("#email-nou")
    const actualPassword = document.querySelector("#parola-actuala")

    const codeField = document.querySelector("#cod")

    let cod = ""

    let camp = ""
    let valoare = ""

    let user

    let reference = firebase.database().ref();
    var folder = reference.child("Elevi");
    folder.child(utilizator).once('value').then(function(snapshot){
        user = snapshot.val()
        oldEmail.value = user.email
    })

    passwordForm.addEventListener('submit', function(event) 
    {
        event.preventDefault()

        if (user.parola != oldPassword.value)
            passwordFeedback.textContent = "Parola veche incorecta"

        else if(user.parola == newPassword.value)
            passwordFeedback.textContent = "Parola noua nu poate fi cea veche"

        else if(newPassword.value != confirmPassword.value)
            passwordFeedback.textContent = "Parola noua trebuie scrisa la fel in ambele campuri"

        else
        {    
            cod = ""
            for(index = 0; index < 6; index++)
                cod += Math.ceil(Math.random() * 9)

            try
            {
                sendEmail("template_cqgu0v9", utilizator, user.email, cod)
                passwordForm.classList.add("hide")
                emailForm.classList.add("hide")
                confirmForm.classList.remove("hide")

                camp = "parola"
                valoare = newPassword.value
            }

            catch(error)
            {
                var message = JSON.stringify(error, Object.getOwnPropertyNames(error));
                alert(message);
            }
        }
    });

    emailForm.addEventListener('submit', function(event) 
    {
        event.preventDefault()

        if (user.parola != actualPassword.value)
            emailFeedback.textContent = "Parola incorecta"

        else
        {    
            cod = ""
            for(index = 0; index < 6; index++)
                cod += Math.ceil(Math.random() * 9)

            try
            {
                sendEmail("template_j64gy2e", utilizator, newEmail.value, cod)
                passwordForm.classList.add("hide")
                emailForm.classList.add("hide")
                confirmForm.classList.remove("hide")

                camp = "email"
                valoare = newEmail.value
            }

            catch(error)
            {
                var message = JSON.stringify(error, Object.getOwnPropertyNames(error));
                alert(message);
            }
        }
    });

    confirmForm.addEventListener('submit', function(event) 
    {
        event.preventDefault()

        if (codeField.value != cod)
            confirmFeedback.textContent = "Cod Incorect"

        else
        {
            reference = "Elevi/" + utilizator

            data = `{\"${camp}\":\"${valoare}\"}`

            try 
            {
                firebase.database().ref(reference).update(JSON.parse(data)).then(function() 
                {
                    alert("Modificare efectuata cu succes")
                    window.location.href = "setari.html"
                });
            } 

            catch(error)
            {
                var message = JSON.stringify(error, Object.getOwnPropertyNames(error));
                alert(message);
            }
        }
    })
})