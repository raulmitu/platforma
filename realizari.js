document.addEventListener("DOMContentLoaded", () => {

    const utilizator = sessionStorage.getItem("utilizator")
    const cards = document.querySelector("#cards")

    var reference = firebase.database().ref();
    var realizari = reference.child("Realizari")
    var elevi = reference.child("Elevi")

    const stages = ["bronze", "silver", "gold", ""]
    const procente = ["33.33%", "66.66%", "100%"]

    let terminat = 0
    let total = 0

    elevi.child(utilizator).once('value').then(function(elev)
    {    
        realizari.once('value').then(function(realizare)
        {
            cards.innerHTML = ""
            
            total = realizare.val().length

            for(let index = 0; index < realizare.val().length; index++)
            {
                let progresElev = elev.val().realizari[index]
                let progresMaxim = realizare.val()[index].progres[2]
                let procent = progresElev / progresMaxim * 100

                if(procent > 100)
                    procent = 100

                procent = Math.floor(procent)

                if(procent == 100)
                    terminat += 1

                let card = document.createElement("div")
                card.className = "achievement-card"
                let h3 = document.createElement("h3")
                h3.className = "achievement-name"
                h3.textContent = realizare.val()[index].nume
                card.appendChild(h3)
                let p = document.createElement("p")
                p.className = "achievement-description"
                p.textContent = realizare.val()[index].descriere
                card.appendChild(p)
                let progressBar = document.createElement("div")
                progressBar.className = "progress-bar"
                let progress = document.createElement("div")
                progress.className = "progress"
                progress.style.width = `${procent}%`
                progressBar.appendChild(progress)
                for(let i = 0; i < stages.length; i++)
                {
                    let milestone = document.createElement("div")
                    milestone.classList.add("milestone")
                    if(stages[i] != "")
                    {
                        milestone.classList.add(stages[i])
                        milestone.textContent = realizare.val()[index].progres[i]
                        milestone.style.left = procente[i]
                    }

                    else
                    {
                        milestone.classList.add("student")
                        milestone.textContent = elev.val().realizari[index]
                        milestone.style.left = `${procent}%`
                        for(j = 2; j >= 0; j--)
                        {
                            if(progresElev >= realizare.val()[index].progres[j])
                            {
                                milestone.classList.add(stages[j])
                                progress.classList.add(stages[j])
                                break
                            }
                        }
                    }
                    progressBar.appendChild(milestone)
                }
                card.appendChild(progressBar)
                let h4 = document.createElement("h4")
                h4.textContent = `Progres: ${procent}% (${progresElev} / ${progresMaxim})`
                card.appendChild(h4)
                cards.appendChild(card)
            }

            document.getElementById("progres").textContent = terminat
            document.getElementById("maxim").textContent = total
        })
    })
})