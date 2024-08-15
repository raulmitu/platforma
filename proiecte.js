document.addEventListener("DOMContentLoaded", () => {
    
    const bodyStyle = document.body.style
    const utilizator = sessionStorage.getItem("utilizator")

    const url = new URL(window.location.href)
    const proiectParametru = url.searchParams.get("proiect")

    const projects = document.querySelector("#projects")
    const displayProject = document.querySelector("#display-project")

    var reference = firebase.database().ref()
    var cursuri = reference.child("Cursuri")
    var elevi = reference.child("Elevi")

    elevi.child(utilizator).once('value').then(function(elev)
    {
        let lista_cursuri = elev.val().cursuri

        if (!proiectParametru)
        {
            for(let index = 0; index < lista_cursuri.length; index++)
            {
                let titlu = lista_cursuri[index].curs

                let div = document.createElement("div")
                div.className = "project"
                projects.appendChild(div)

                let a = document.createElement("a")
                a.href = `proiecte.html?proiect=${titlu}`
                div.appendChild(a)

                let h3 = document.createElement("h3")
                h3.textContent = titlu
                a.appendChild(h3)

                let img = document.createElement("img")
                img.src = `Cursuri/${titlu}/thumbnail.png`
                a.appendChild(img)
            }

            return
        }

        cursuri.child(proiectParametru).once('value').then(function(curs)
        {
            let proiect = curs.val().proiect
            let nume = proiect.nume
            let descriere = proiect.descriere

            bodyStyle.background = `url("Cursuri/${proiectParametru}/thumbnail.png")`
            bodyStyle.backgroundRepeat = "no-repeat"
            bodyStyle.backgroundPosition = "center"
            bodyStyle.backgroundSize = "cover"

            let div = document.createElement("div")
            div.className = "prezentare"
            displayProject.appendChild(div)

            let h1 = document.createElement("h1")
            h1.textContent = nume
            div.appendChild(h1)

            let ul = document.createElement("ul")
            div.appendChild(ul)

            for(let index = 0; index < descriere.length; index++)
            {
                let li = document.createElement("li")
                ul.appendChild(li)

                let p = document.createElement("p")
                p.textContent = descriere[index]
                li.appendChild(p)
            }

            let video = document.createElement("video")
            div.appendChild(video)
            video.controls = true
            video.poster = `Cursuri/${proiectParametru}/thumbnail.png`
            video.src = `Cursuri/${proiectParametru}/proiect.mp4`
            video.load()
        })
    })
})