window.addEventListener("load", function(){

 
    butoane_salvare_produs = document.getElementsByClassName("buton1");
    for(let bt of butoane_salvare_produs){
        bt.onclick=function(){
            let id_produs=this.id.substr(1);
            let de_sters=7;
            
            //nu stim daca e de sters sau pastrat
            let locSt = localStorage.getItem("produse_pastrate");
            if(de_sters == 7){
                if(!(locSt)){
                    de_sters = 0;
                    console.log("nu am localStorage");
                }

                else if(locSt){
                    console.log("am localStorage");
                    string_iduri=localStorage.getItem("produse_pastrate");
                    console.log("string iduri inainte de adaugare: ", string_iduri);
    
                    vector_iduri=string_iduri.split(",");
                    console.log("vector iduri inainte de adaugare: ", vector_iduri);
                            
                    
                    for(let i = 0; i < vector_iduri.length; i++){
                        if(vector_iduri[i] == id_produs){ 
                            de_sters = 1;
                        }
                    }
                }
                    if(de_sters == 7)//daca nu am gasit butonul in lcSt, butonul e de adaugat
                        de_sters = 0;

                }
                console.log("de sters: ",de_sters);
            
                if(de_sters == 0){
                    if(!(localStorage.getItem("produse_pastrate"))){
                        localStorage.setItem("produse_pastrate",id_produs);
                    }
                    else{
                        string_iduri=localStorage.getItem("produse_pastrate")+","+id_produs;
                        localStorage.setItem("produse_pastrate",string_iduri);
                    }
                }

                else if(de_sters == 1){
                    string_iduri = "";
                    for(let i = 0; i < vector_iduri.length; i++){
                        if(vector_iduri[i] != id_produs){ 
                                if(string_iduri == "")
                                    string_iduri = string_iduri+vector_iduri[i];
                                else
                                    string_iduri += ","+vector_iduri[i];
                            }
                        }
                        if(string_iduri)
                            localStorage.setItem("produse_pastrate",string_iduri);
                        else
                            localStorage.removeItem("produse_pastrate");
                }
            filtrare();
            }
            
    }

    butoane_stergere_produs = document.getElementsByClassName("buton2");
    for(let bt of butoane_stergere_produs){
        bt.onclick=function(){
            bt.parentNode.parentNode.style.display="none";
        }
    }
     

    butoane_stergere_produs = document.getElementsByClassName("buton3");
    for(let bt of butoane_stergere_produs){
        bt.onclick=function(){
            let id_produs=this.id.substr(1);
            if(!(sessionStorage.getItem("produse_sterse"))){
                sessionStorage.setItem("produse_sterse",id_produs);
            }
            else{
                string_iduri=sessionStorage.getItem("produse_sterse")+","+id_produs;
                sessionStorage.setItem("produse_sterse",string_iduri);
            }
                
            filtrare();
        }
            
    }

        function afiseaza_pagina_curenta(){
            var pagina_curenta=1;
            var prod_per_pg = 5;
            var produse_pagina =[];

        
            var produse_totale=document.getElementsByClassName("produs");
            for(let produs of produse_totale){
                if(produs.style.display != "none"){
                    produse_pagina.push(produs);
                }
            }
        
            var nr_pg = Math.ceil(produse_totale.length/prod_per_pg);
            

            for(let i = 1; i <= nr_pg; i ++){
                if(document.getElementById("page_rad" + i.toString()).checked == true){
                    pagina_curenta = i;
                    break;
                }
            }

       
            //la loadul paginii vrem doar produsele de pe prima pagina
            for(let prod_idx = 0; prod_idx < produse_pagina.length; prod_idx ++){
                if(Math.floor(prod_idx / prod_per_pg) != pagina_curenta-1){
                    produse_pagina[prod_idx].style.display= "none";
                }
                else{
                    produse_pagina[prod_idx].style.display= "block";
                }
            }
        }
    
        afiseaza_pagina_curenta();

    
            document.getElementById("infoRange").innerHTML=document.getElementById("inp-pret").value;
            filtrare();

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
        filtrare();
    }

    document.getElementById("inp-nume").onchange= filtrare
    document.getElementById("i_datalist").onchange= filtrare
    document.getElementById("i_check1").onchange= filtrare
    document.getElementById("i_check2").onchange= filtrare
    document.getElementById("inp-brand").onchange= filtrare
    document.getElementById("i_rad1").onchange= filtrare
    document.getElementById("i_rad2").onchange= filtrare
    document.getElementById("i_rad3").onchange= filtrare
    document.getElementById("inp-materiale").onchange= filtrare
    document.getElementById("inp-descriere").onchange= filtrare
    document.getElementById("id_lista").onchange= filtrare

    document.getElementById("filtrare").onclick = filtrare

    document.getElementById("buton_pagina").onchange = filtrare

    




    function filtrare(){
        var produse=document.getElementsByClassName("produs");
        //text cautare
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();

        //categorie- radiobutton
        let val_cat;        
        let gr_radio=document.getElementsByName("gr_rad");
        for(let r of gr_radio){
            if(r.checked){
                val_cat=r.value;
                break;
            }
        }

        //datalist- grosimi
        let val_grosime=document.getElementById("i_datalist").value;
        if(val_grosime==""){
            lim_inf=0;
            lim_sup=100;
        }
        else {
            if(val_grosime=="9+"){
                lim_inf=9;
                lim_sup=100;
            }
            else{
                [lim_inf,lim_sup]=val_grosime.split(":");
                lim_inf=parseInt(lim_inf);
                lim_sup=parseInt(lim_sup);
            }
        }


        //spalabil la masina
        let val_spalabil='false';
        let checkbox_spalabil=document.getElementById("i_check1");
        if(checkbox_spalabil.checked){
            val_spalabil='true';
        }

        //soseete-checkbox
        let val_sosete='false';
        let checkbox_sosete=document.getElementById("i_check2");
        if(checkbox_sosete.checked){
            val_sosete='true';
        }
    
 
        //pret
        let val_pret = document.getElementById("inp-pret").value;

        //brand
        let val_brand = document.getElementById("inp-brand").value;

        //compozitie
        let val_comp = [];
        for( m of document.getElementById("inp-materiale")){
            if(m.selected){
                val_comp.push(m.value);
            }
        }
        //descriere
        let val_descriere = document.getElementById("inp-descriere").value.toLowerCase();
        //console.log(val_descriere)

        for(let prod of produse){
            prod.style.display="none";

            //categorie- radiobutton
            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML
            let cond1 = true;                
            if(val_cat != "toate"){
                if(val_cat != categorie)
                cond1 = false;
            }

            //datalist- grosimi
            let cond2=false;
            let grosime=parseInt(prod.getElementsByClassName("val-grosime")[0].innerHTML);
            if(lim_inf <= grosime && grosime <=lim_sup)
                cond2=true;

            //spalabil-checkbox            
            let cond3 = true;
            let spalabil=prod.getElementsByClassName("val-spalabil_la_masina")[0].innerHTML;
            if(val_spalabil=='true' && spalabil!=val_spalabil){
                cond3=false;
            }
            //sosete-checkbox
            let cond4 = true;
            let sosete=prod.getElementsByClassName("val-pentru_sosete")[0].innerHTML;
            if(val_sosete=='true' && sosete!=val_sosete){
                cond4=false;

            }

            //text

            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond5 = true;
            if(val_nume.length!=0){
                //length si for si numar diferentele 
                if(nume.length!=val_nume.length)
                    cond5=false;

                    litere_diferite = 0;
                    for(let i = 0; i < nume.length; i++){
                        if(nume[i] != val_nume[i])
                        litere_diferite++;
                    }
                    console.log("val nume: ",val_nume);
                    if(litere_diferite > 2)
                        cond5 = false;
            }
            //range-pret
            pret=parseInt(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let  cond6=(val_pret <= pret);

            //select simplu-brand
            let cond7;
            brand=prod.getElementsByClassName("val-brand")[0].innerHTML;
            if(val_brand =="toate")
                cond7=true;
            else
                cond7=(val_brand == brand);

            //select multiplu-compozitie
            compozitie=prod.getElementsByClassName("val-compozitie")[0].innerHTML;
            let cond8 = val_comp.some(element => compozitie.includes(element))
            || val_comp.includes('toate');

            //textarea descriere
            descriere=prod.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().split(" ");
            let cond9=false;
            for(cuv of descriere){
                if(cuv.startsWith(val_descriere))
                    cond9=true;
            }

            let cond10=false;
            id_pr = prod.getElementsByClassName("buton1")[0].id.substr(1);
            // console.log("id_pr: ",id_pr);
            string_iduri=localStorage.getItem("produse_pastrate");
            if(string_iduri){
                vector_iduri=string_iduri.split(",");
                for(let i = 0; i < vector_iduri.length; i++){
                    if(vector_iduri[i] == id_pr){ 
                        cond10=true;
                      
                    }
                                 
                }
            }

            let cond11=true;
            id_pr = prod.getElementsByClassName("buton3")[0].id.substr(1);

            string_iduri=sessionStorage.getItem("produse_sterse");
            if(string_iduri){
                vector_iduri=string_iduri.split(",");
                for(let i = 0; i < vector_iduri.length; i++){
                    if(vector_iduri[i] == id_pr){ 
                        cond11=false;
                      
                    }
                                 
                }
            }
        
            if(cond10 && prod.getElementsByClassName("icon-buton1")[0].classList.contains("fa-thumbs-up")){
                prod.getElementsByClassName("nume")[0].style.color="red";
                prod.getElementsByClassName("icon-buton1")[0].classList.remove("fa-thumbs-up");
                prod.getElementsByClassName("icon-buton1")[0].classList.add("fa-thumbtack");
            }

            if (cond10==false && prod.getElementsByClassName("icon-buton1")[0].classList.contains("fa-thumbtack") ){
                prod.getElementsByClassName("nume")[0].style.color="var(--text-color)";
                prod.getElementsByClassName("icon-buton1")[0].classList.remove("fa-thumbtack");
                prod.getElementsByClassName("icon-buton1")[0].classList.add("fa-thumbs-up");
            }   

            if((cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8 && cond9 && cond11) || cond10){
                prod.style.display="block";
            }
        
        }
           afiseaza_pagina_curenta();

    }

    document.getElementById("resetare").onclick=function(){
        document.getElementById("inp-brand").value="toate";
        document.getElementById("inp-nume").value="";
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad3").checked=true;
        document.getElementById("i_check1").checked=false;
        document.getElementById("i_check2").checked=false;
        document.getElementById("inp-materiale").value="toate";
        document.getElementById("inp-descriere").value="";
        document.getElementById("i_datalist").value="";


        var produse=document.getElementsByClassName("produs");

        for(let prod of produse){
            prod.style.display="block";
        }
        afiseaza_pagina_curenta();
    }

    function sorteaza(semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse);

 
        v_produse.sort(function(a,b){
            var pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                var nume_a=a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return (pret_a-pret_b)*semn;
        });
        for (let produs of v_produse){
            produs.parentNode.appendChild(produs);
        }      
    }
 
    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1);
    }

    window.onkeydown= function(e){
        if (e.key=="c" && e.altKey){
            if(document.getElementById("info-suma"))
                return;
            var produse=document.getElementsByClassName("produs");
            let suma=0;
            for (let prod of produse){
                if(prod.style.display!="none")
                {
                    let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                    suma+=pret;
                }
            }
            let p=document.createElement("p");
            p.innerHTML=suma;
            p.id="info-suma";
            ps=document.getElementById("p-suma");
            container = ps.parentNode;
            frate=ps.nextElementSibling
            container.insertBefore(p, frate);
            setTimeout(function(){
                let info=document.getElementById("info-suma");
                if(info)
                    info.remove();
            }, 1000)
        }
    }





});
