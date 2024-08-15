document.addEventListener("DOMContentLoaded", () => {

    const utilizator = sessionStorage.getItem("utilizator")
    const courses = document.querySelector("#courses")
    const oldcourses = document.querySelector("#oldcourses")
    const coursessection = document.querySelector("#courses-section")
    const lesson = document.querySelector("#lesson")

    const titlu = document.querySelector("#titlu")
    const descriere = document.querySelector("#descriere")
    const lista = document.querySelector("#lista")
    const video = document.querySelector("#video")
    const pdf = document.querySelector("#pdf")
    const resurse = document.querySelector("#resurse")

    const url = new URL(window.location.href)
    const cursParametru = url.searchParams.get("curs")
    const lectieParametru = url.searchParams.get("lectie")

    lista.innerHTML = ""
    courses.innerHTML = ""
    oldcourses.innerHTML = ""

    var reference = firebase.database().ref();
    var cursuri = reference.child("Cursuri")
    var elevi = reference.child("Elevi")

    function seteazaLectie(curs, lectie, nume, continut, resursa)
    {
        let adresa = "Cursuri/" + curs + "/" + lectie
        titlu.textContent = nume
        descriere.textContent = continut
        pdf.href = adresa + ".pdf"
        pdf.download = nume + ".pdf"
        video.setAttribute("src", adresa + ".mp4")
        video.load()
        resurse.href = resursa
    }

    function lectieCurenta(curs, lista_cursuri)
    {
        for(let index = 0; index < lista_cursuri.length; index++)
            if(curs == lista_cursuri[index].curs)
                return lista_cursuri[index].lectie
        return null
    }

    elevi.child(utilizator).once('value').then(function(elev)
    {
        let lista_cursuri = elev.val().cursuri
        let lista_finalizate = elev.val().finalizate

        if (!cursParametru)
        {
            lesson.style.display = "none"
            for(let index = 0; index < lista_cursuri.length; index++)
            {
                let curs = lista_cursuri[index].curs
                let lectie = lista_cursuri[index].lectie

                cursuri.child(curs).once('value').then(function(snapshot)
                {
                    let div = document.createElement("div")
                    div.className = "course"
                    courses.appendChild(div)

                    let a = document.createElement("a")
                    a.href = `lectii.html?curs=${curs}&lectie=${lectie}`
                    div.appendChild(a)

                    let h3 = document.createElement("h3")
                    h3.textContent = curs
                    a.appendChild(h3)

                    let img = document.createElement("img")
                    img.src = `Cursuri/${curs}/thumbnail.png`
                    a.appendChild(img)

                    let p = document.createElement("p")
                    p.textContent = snapshot.val().descriere
                    a.appendChild(p)
                })
            }

            for (let index = 0; index < lista_finalizate.length; index++)
            {
                let curs = lista_finalizate[index].curs
                let data = lista_finalizate[index].data

                cursuri.child(curs).once('value').then(function(snapshot)
                {
                    let div = document.createElement("div")
                    div.className = "course"
                    oldcourses.appendChild(div)

                    let h3 = document.createElement("h3")
                    h3.textContent = curs + " | Finalizat in " + data
                    div.appendChild(h3)

                    let img = document.createElement("img")
                    img.src = `Cursuri/${curs}/thumbnail.png`
                    div.appendChild(img)

                    if (snapshot.val())
                    {
                        let p = document.createElement("p")
                        p.textContent = snapshot.val().descriere
                        div.appendChild(p)
                    }
                })
            }

            return
        }

        let lectie_curenta = lectieCurenta(cursParametru, lista_cursuri)

        if(!lectie_curenta)
        {
            window.location.href = "lectii.html"
            return
        }

        coursessection.innerHTML = ""

        cursuri.child(cursParametru).once('value').then(function(curs)
        {
            let lectii = curs.val().lectii
            for(let index = 0; index < lectii.length; index++)
            {
                let lectie = lectii[index]
                let li = document.createElement("li")
                let a = document.createElement("a")
                let span = document.createElement("span")

                span.textContent = `${index + 1}. `
                a.appendChild(span)
                a.textContent += lectie.nume
                let durata = document.createElement("span")
                durata.textContent = lectie.durata
                durata.className = "durata"
                a.appendChild(durata)
                li.appendChild(a)
                lista.appendChild(li)

                if (index + 1 > lectie_curenta)
                {
                    li.classList.add("unavailable")
                }

                else
                {
                    a.href = `lectii.html?curs=${cursParametru}&lectie=${index + 1}`

                    if ((index + 1).toString() != lectieParametru)
                        continue

                    li.classList.add("hovered")
                    seteazaLectie(cursParametru, index + 1, lectie.nume, lectie.descriere, lectie.resurse)
                }
            }
        })
    })
})
