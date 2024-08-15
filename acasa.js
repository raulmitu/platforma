document.addEventListener("DOMContentLoaded", () => {

    const utilizator = sessionStorage.getItem("utilizator")

    var reference = firebase.database().ref();
    var cursuri = reference.child("Cursuri")
    var realizari = reference.child("Realizari")
    var elevi = reference.child("Elevi")

    function increase(id, progres, value)
    {
        if (value <= progres)
        {
            setTimeout(() => {
                document.getElementById(id).value = value    
                increase(id, progres, value + 1)
            }, 10);
        }
    }

    function pickLesson(istoric)
    {
        for(let index = istoric.length - 1; index >= 0; index--)
            if(istoric[index].lectie > 0)
                return istoric[index]
        return null
    }

    elevi.child(utilizator).once('value').then(function(elev)
    {      
        realizari.once('value').then(function(snapshot)
        {
            let max_index = -1;
            let maxim = -1;

            let min_index = Infinity
            let minim = Infinity

            for(let i = 0; i < snapshot.val().length; i++)
            {
                let progres = elev.val().realizari[i] / snapshot.val()[i].progres[2] * 100

                if(progres > maxim)
                {
                    maxim = progres
                    max_index = i
                }

                if(progres < minim)
                {
                    minim = progres
                    min_index = i
                }
            }
            
            maxim = Math.floor(maxim)
            minim = Math.floor(minim)

            document.getElementById("best-achievement").textContent = snapshot.val()[max_index].nume

            document.getElementById("best-progress-percent").textContent = `${maxim}%`;
            document.getElementById("best-progress").textContent = `( ${elev.val().realizari[max_index]} / ${snapshot.val()[max_index].progres[2]} )`

            document.getElementById("worst-achievement").textContent = snapshot.val()[min_index].nume

            document.getElementById("worst-progress-percent").textContent = `${minim}%`;
            document.getElementById("worst-progress").textContent = `( ${elev.val().realizari[min_index]} / ${snapshot.val()[min_index].progres[2]} )`

            increase("best-progress-bar", maxim, 0)
            increase("worst-progress-bar", minim, 0)
        })
        
        document.getElementById("username").textContent = elev.val().nume;
        
        let istoric = elev.val().istoric

        if (istoric.length == 0)
        {
            document.getElementById("curs-card").style.display = "none"
            return
        }

        let prezenta = pickLesson(istoric)
        
        if(!prezenta)
        {
            document.getElementById("curs-card").style.display = "none"
            return
        }

        cursuri.child(prezenta.curs).once('value').then(function(curs)
        {
            let lectii  = curs.val().lectii

            let maxim   = lectii.length
            let progres = Math.floor(prezenta.lectie / maxim * 100)

            let lectie = lectii[prezenta.lectie - 1].nume

            document.getElementById("last-course").textContent = prezenta.curs
            document.getElementById("last-lesson").textContent = lectie + " | " + istoric[istoric.length - 1].data

            document.getElementById("curs-progress-percent").textContent = `${progres}%`;
            document.getElementById("curs-progress").textContent = `( ${prezenta.lectie} / ${maxim} )`

            document.getElementById("curs-link").href = `lectii.html?curs=${prezenta.curs}&lectie=${prezenta.lectie}` 
            document.getElementById("proiect-link").href = `proiecte.html?proiect=${prezenta.curs}`
            document.getElementById("project-course").textContent = prezenta.curs
            document.getElementById("project-title").textContent = curs.val().proiect.nume
            document.getElementById("project-details").textContent = "Vezi detalii despre acest proiect."
            document.getElementById("proiect-card").style.backgroundImage = `url("Cursuri/${prezenta.curs}/thumbnail.png")`
            increase("curs-progress-bar", progres, 0)
        })
    })
})


