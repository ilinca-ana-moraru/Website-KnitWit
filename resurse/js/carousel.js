window.addEventListener("load", function(){
    for(let i =0; i<document.getElementsByClassName("element").length;i++){
        document.getElementsByClassName("element")[i].style.display="none";
    }

    // carousel-item c-item 
    function refresh_carousel(){
        //stpcat in lista, sters classLIsturile specifice carousel si display none la vector
        var indice;
        for(let i=0;i<5;i++){
            indice = Math.floor(Math.random()*document.getElementsByClassName("element").length);
            prodCarousel = document.getElementsByClassName("element")[indice];
            prodCarousel.style.display="block";
            prodCarousel.classList.add("c-item")
            prodCarousel.classList.add("carousel-item")
            //console.log(prodCarousel);            
            if(i==0){
                let primul = document.getElementsByClassName("element")[indice];
                primul.classList.add("active");
                //console.log(primul.classList);
            }   
        }
    }

    refresh_carousel()
      
})



