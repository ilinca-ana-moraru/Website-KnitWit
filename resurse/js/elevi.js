window.addEventListener("load", function(){


    function sorteaza(semn){
        console.log("salut")

        var elevi=document.getElementsByClassName("elev");
        var v_elevi=Array.from(elevi);
        //console.log(v_elevi)

        v_elevi.sort(function(a,b){
            var media_a=parseFloat(a.getElementsByClassName("media")[0].innerHTML);
            var media_b=parseFloat(b.getElementsByClassName("media")[0].innerHTML);
            console.log(media_a,media_b)
            if(media_a==media_b){
                var nume_a=a.getElementsByClassName("nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return (media_a-media_b)*semn;
        });
        for (let e of v_elevi){
            console.log(e)
            e.parentNode.appendChild(e);
        }      
    }
 
    document.getElementById("cres").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("desc").onclick=function(){
        sorteaza(-1);
    }


    x=document.getElementById("lst").getElementsByTagName("li").length
        console.log(x)

})