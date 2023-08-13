window.onload= function(){
    var formular=document.getElementById("form_inreg");
    if(formular){
    formular.onsubmit= function(){
            if(document.getElementById("parl").value!=document.getElementById("rparl").value){
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }
            if(!(document.getElementById("inp-username").value && document.getElementById("inp-nume").value && 
            document.getElementById("inp-prenume").value && document.getElementById("parl").value && 
            document.getElementById("rparl").value && document.getElementById("inp-email").value))
                return false;
            return true;
        }
    }
 }


