document.addEventListener("DOMContentLoaded", () => {

    const utilizator = sessionStorage.getItem("utilizator")

    const tables = document.querySelector("#tables")
    tables.innerHTML = ""

    const titluri = ["Data", "Ora", "Curs", "Lectie", "Sedinte", "Prezenta"]
    const luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
    const zile = ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"]

    var reference = firebase.database().ref();
    var cursuri = reference.child("Cursuri")
    var elevi = reference.child("Elevi")

    let ultimaLuna = ""
    let tbody

    let lectii = []

    function addFeedback(titlu, continut)
    {
        let tr = document.createElement("tr")
        tr.className = "details-row"
        tbody.appendChild(tr)
        
        let td = document.createElement("td")
        td.colSpan = titluri.length
        tr.appendChild(td)

        let details = document.createElement("details")
        td.appendChild(details)

        let summary = document.createElement("summary")
        summary.textContent = titlu
        details.appendChild(summary)

        let div = document.createElement("div")
        div.textContent = continut
        details.appendChild(div)
    }

    function setDay(data)
    {
        return zile[new Date(data[2], data[1] - 1, data[0]).getDay()] + ", " + data[0]
    }

    function setTable(prezenta)
    {
        let data    = prezenta.data.split("-")
        let luna = luni[data[1] - 1] + " " + data[2]

        if (luna != ultimaLuna)
        {
            ultimaLuna = luna

            let div = document.createElement("div")
            div.className = "table"
            tables.appendChild(div)
            
            let h2 = document.createElement("h2")
            h2.textContent = ultimaLuna
            div.appendChild(h2)

            let table = document.createElement("table")
            div.appendChild(table)

            let thead = document.createElement("thead")
            table.appendChild(thead)

            let tr = document.createElement("tr")
            thead.appendChild(tr)

            for(let i = 0; i < titluri.length; i++)
            {
                let th = document.createElement("th")
                th.textContent = titluri[i]
                tr.appendChild(th)
            }

            tbody = document.createElement("tbody")
            table.appendChild(tbody)
        }
    }

    function addAttendance(prezenta, snapshot)
    {
        if (prezenta.lectie == 0)
        {
            let continut = `Au fost achitate si adaugate ${prezenta.sedinte} sedinte.`
            addFeedback("Plata - " + setDay(prezenta.data.split("-")), continut)
            return
        }
        
        let data    = prezenta.data.split("-")
        let zi      = setDay(data)
        let ora     = prezenta.ora
        let curs    = prezenta.curs
        let lectie  = snapshot.lectii[prezenta.lectie - 1].nume
        let sedinte = prezenta.sedinte
        let prezent = prezenta.prezent == "true" ? "Prezent" : "Absent"

        let status = [zi, ora, curs, lectie, sedinte, prezent]

        let tr = document.createElement("tr")
        tbody.appendChild(tr)

        for(let i = 0; i < status.length; i++)
        {
            let td = document.createElement("td")
            td.textContent = status[i]
            tr.appendChild(td)
        }

        if(prezenta.feedback != "")
        {
            addFeedback("Feedback - " + zi + ":", prezenta.feedback)
        }
    }

    elevi.child(utilizator).once('value').then(function(elev)
    {
        let istoric = elev.val().istoric

        for(let index = 0; index < istoric.length; index++)
        {
            let prezenta = istoric[index]

            if (!lectii[prezenta.curs])
            {   
                cursuri.child(prezenta.curs).once('value').then(function(snapshot)
                {
                    lectii[prezenta.curs] = snapshot.val()
                    setTable(prezenta)
                    addAttendance(prezenta, lectii[prezenta.curs])
                })
            }

            else
            {
                addAttendance(prezenta, lectii[prezenta.curs])
            }
        }
    })
})


