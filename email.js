(function(){
    emailjs.init({
      publicKey: "wiQZ5knMUg365bdeE",
    });
  })();

  
function sendEmail(template, utilizator, email, cod)
{
    var parameters = {
      nume_utilizator: utilizator,
      email_utilizator: email,
      cod_utilizator: cod
    }

    emailjs.send('default_service', template, parameters);

    alert("Email trimis cu succes")
}

