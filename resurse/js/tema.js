let tema = localStorage.getItem("tema");
if(tema){
    document.body.classList.add(tema);
}

window.addEventListener("DOMContentLoaded", function(){
    document.getElementById("tema").onclick= function(){
        if(document.body.classList.contains("dark")){
            document.body.classList.remove("dark");
            document.body.classList.add("happy");
            localStorage.setItem("tema", "happy");            
        }
        else if(document.body.classList.contains("happy")){
            document.body.classList.remove("happy");
            localStorage.removeItem("tema");            
        }
        else{
            document.body.classList.add("dark")
            localStorage.setItem("tema", "dark");
        }
    }
})