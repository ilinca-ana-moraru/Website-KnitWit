// pfqmtzltwxdtlycl

const express = require("express");
const fs= require('fs');
const path = require('path');
const sharp = require('sharp');
const sass=require('sass');
const ejs=require('ejs');
const {Client}=require('pg');
const AccesBD = require("./module_proprii/accesbd.js");
const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");


AccesBD.getInstanta().select(
    {tabel:"produse",
    campuri:["nume","pret","gramaj"],
    conditii:[["pret>20","gramaj>50"],["pret<40"]]},
    function(err,rez){
        console.log("eroare:");
        console.log(err);
        //console.log(rez);
    }
)

var client= new Client({database:"knit_wit_db",
        user:"ilinca",
        password:"parolailincai",
        host:"localhost",
        port:5432});
client.connect();


// client.query("select * from lab8_10", function(err, rez){
//     console.log("eroare BD:", err);
//     console.log("rezultat BD:", rez);
// })


obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname,"resurse/scss"),
    folderCss: path.join(__dirname,"resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
    optiuniMeniu:[],
    optiuniMateriale:[],
    produse:[]

}

client.query("select * from unnest(enum_range(null::tipuri_produse))",function(err, rezTipuri){
    if(err){
        console.log("eroare:");
        console.log(err)
    }
    else{
        obGlobal.optiuniMeniu=rezTipuri.rows;
    }
})

client.query("select * from unnest(enum_range(null::tipuri_materiale))",function(err, rezMateriale){
    if(err){
        console.log("eroare:");
        console.log(err)
    }
    else{
        obGlobal.optiuniMateriale=rezMateriale.rows;
    }
})
app= express();
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitalized: false
}));

vectorFoldere=["temp","temp1","backup","poze_uploadate"]
for(let folder of vectorFoldere){
    // let caleFolder=path.join(__dirname,folder)
    let caleFolder=__dirname+"/"+folder
    if(!fs.existsSync(caleFolder))
        fs.mkdirSync(caleFolder);
}

function compileazaScss(caleScss, caleCss){
    if(!caleCss){
        // let vectorCale=caleScss.split("\\");
        // let numeFisExt=vectorCale[vectorCale.length-1];
        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0];
        caleCss=numeFis+".css";
    }
    if(!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss)
    if(!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss)

    let vectorCale=caleCss.split("\\");
    let numeFisCss=vectorCale[vectorCale.length-1];

    let caleResBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if(!fs.existsSync(caleResBackup))
    fs.mkdirSync(caleResBackup, {recursive:true});

    if(fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss,path.join(obGlobal.folderBackup,"resurse/css",numeFisCss))
    }
    rez=sass.compile(caleScss,{"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css);
    
}
    //compileazaScss("a.scss");
    vFisiere=fs.readdirSync(obGlobal.folderScss)
    for(let numeFis of vFisiere){
        if(path.extname(numeFis)==".scss"){
            compileazaScss(numeFis);
        }
    }

    fs.watch(obGlobal.folderScss,function(eveniment, numeFis){
        console.log(eveniment, numeFis);
        if(eveniment=="change" || eveniment=="rename"){
            let caleCompleta=path.join(obGlobal.folderScss, numeFis);
            if(fs.existsSync(caleCompleta)){
                compileazaScss(caleCompleta);
            }
        }
    })


app.set("view engine","ejs");

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/poze_uploadate", express.static(__dirname+"/poze_uploadate"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use("/*", function(req, res, next){    
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    res.locals.Drepturi=Drepturi;
    if(req.session.utilizator){
        req.utilizator=res.locals.utilizator= new Utilizator(req.session.utilizator);

    }
    next();
})


app.use(/^\/resurse(\/[a-zA-Z0-9]*)*$/, function(req,res){
    afisareEroare(res,403);
});

app.get("/logout",function(req,res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
});

app.get("/ceva", function(req, res){
    res.send("<h1>altceva</h1> ip:"+req.ip);
})

app.get("/favicon.ico", function(req,res){
    res.sendFile(__dirname+"/resurse/imagini/ico/favicon.ico");
})

// app.use(function(req, res, next) {
//     res.locals.username = this.username;
//     console.log("This username is: ", this.username)
//     res.locals.poza = this.poza;
//     res.locals.SalutSuntMircea = "mircea";
//     next();
// });

app.get(["/index","/","/home","login" ], function(req, res){
    let sir=req.session.mesajLogin;
    req.session.mesajLogin=null;
    client.query("select * from produse", function( err, rez){
        if(err){
            console.log("eroare la select * from produse\n",err);
            afiseazaEroare(res, 2);
        }
        else{
            //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n\n",rez.rows)
            // de aici sunt trimise optiunile pt dropdown
            res.render("pagini/index", {produse: rez.rows, ip: req.ip, a: 10, b:20,
                 imagini:obGlobal.obImagini.imagini,mesajLogin:sir
                 
                });
                // res.render("fragmente/header.ejs",{ mesajLogin:sir, username:ceva});
        }
    });
})



app.get("/*.ejs",function(req,res){
    afisareEroare(res,400);
})

// app.get("*/galerie-animata.css",function(req, res){

//     var sirScss=fs.readFileSync(__dirname+"/resurse/scss_ejs/galerie_animata.scss").toString("utf8");
//     var culori=["navy","black","purple","grey"];
//     var indiceAleator=Math.floor(Math.random()*culori.length);
//     var culoareAleatoare=culori[indiceAleator]; 
//     rezScss=ejs.render(sirScss,{culoare:culoareAleatoare});
//     console.log(rezScss);
//     var caleScss=__dirname+"/temp/galerie_animata.scss"
//     fs.writeFileSync(caleScss,rezScss);
//     try {
//         rezCompilare=sass.compile(caleScss,{sourceMap:true});
        
//         var caleCss=__dirname+"/temp/galerie_animata.css";
//         fs.writeFileSync(caleCss,rezCompilare.css);
//         res.setHeader("Content-Type","text/css");
//         res.sendFile(caleCss);
//     }
//     catch (err){
//         console.log(err);
//         res.send("Eroare");
//     }
// });

// app.get("*/galerie-animata.css.map",function(req, res){
//     res.sendFile(path.join(__dirname,"temp/galerie-animata.css.map"));
// });

app.get("/produse", function(req, res) {
    client.query("select * from unnest(enum_range(null::categorii))", function(err, rezCategorie) {
        if (err) {
            console.log("eroare:");
            console.log(err);
            afisareEroare(res, 2);
        } else {
            let conditieWhere = "";
            if (req.query.tip) {
                conditieWhere = ` where categorie='${req.query.tip}'`;
            }
            client.query("select * from produse " + conditieWhere, function(err, rez) {
                if (err) {
                    console.log("eroare:");
                    console.log(err);
                    afisareEroare(res, 2);
                } else {
                    client.query("select * from unnest(enum_range(null::tipuri_branduri))", function(err, rezBrand) {
                        if (err) {
                            console.log("eroare:");
                            console.log(err);
                            afisareEroare(res, 2);
                        } else {
                            res.render("pagini/produse", { produse: rez.rows, optiuni: rezCategorie.rows, branduri: rezBrand.rows, compozitie:obGlobal.optiuniMateriale });
                        }
                    });
                }
            });

        }
    });
});



app.get("/jucarii",function(req,res){
    client.query("select * from jucarii" , function(err,rez){
        if (err) {
            console.log("eroare:");
            console.log(err);
            afisareEroare(res, 2);
        } else {
            res.render("pagini/jucarii",{jucarii:rez.rows})
        }
    })
})

app.get("/produs/:id",function(req, res){
    // console.log(req.params);
   
    client.query(`select * from produse where id=${req.params.id}`, function( err, rezultat){
        if(err){
            console.log("eroare:");
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});

app.get("/reduceri", function(req, res){
    res.render("pagini/reduceri");
})


app.post("/login",function(req, res){
    var username;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        Utilizator.getUtilizDupaUsername (campuriText.username,{
            req:req,
            res:res,
            parola:campuriText.parola
        }, function(u, obparam ){
            let parolaCriptata=Utilizator.criptareParola(obparam.parola);
            if(u.parola==parolaCriptata && u.confirmat_mail ){
                console.log("u.poza este :",u.poza);
                u.poza=u.poza ? path.join("poze_uploadate",u.username,u.poza)
                              : "./poze_uploadate/default/poza_default.jpg";
                console.log("exista u.poza? ", u.poza);
                obparam.req.session.utilizator=u;
                console.log("utiliator.username este ",u.username);
                obparam.req.session.mesajLogin="Bravo! Te-ai logat!";
                obparam.req.session.username=u.username;
                obparam.res.redirect("/index");
                //obparam.res.render("/login");
            }
            else{
                console.log("Eroare logare")
                obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    });
});



app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        // console.log("Inregistrare:",campuriText);

        // console.log(campuriFisier);
        // console.log(poza, username);
        var eroare="";

        var utilizNou=new Utilizator();
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
            
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.poza= poza;
            utilizNou.data_nastere = campuriText.data_nastere;
            utilizNou.tema = campuriText.tema;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                }
                else{
                    eroare+="Mai exista username-ul";
                }

                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                   
                    
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
                
            })
            

        }
        catch(e){ 
            //console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
    



    });
    formular.on("field", function(nume,val){  // 1 
	
        //console.log(`--- ${nume}=${val}`);
		
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
		
        console.log(nume,fisier);
		//TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser=path.join(__dirname, "poze_uploadate",username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)

    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    }); 
});


app.get("/useri", function(req, res){
   
    if(req?.utilizator?.areDreptul?.(Drepturi.vizualizareUtilizatori)){
        AccesBD.getInstanta().select({tabel:"utilizatori", campuri:["*"]}, function(err, rezQuery){
            console.log("eroare:");
            console.log(err);
            res.render("pagini/useri", {useri: rezQuery.rows});
        });
    }
    else{
        afisareEroare(res, 403);
    }
});

app.post("/sterge_utiliz", function(req, res){
    if(req?.utilizator?.areDreptul?.(Drepturi.stergereUtilizatori)){
        var formular= new formidable.IncomingForm();
 
        formular.parse(req,function(err, campuriText, campuriFile){
           
                AccesBD.getInstanta().delete({tabel:"utilizatori", conditii:[`id=${campuriText.id_utiliz}`]}, function(err, rezQuery){
                console.log("eroare:");
                console.log(err);
                res.redirect("/useri");
            });
        });
    }else{
        afisareEroare(res,403);
    }
})

app.post("/profil", function(req, res){
    console.log("profil");
    if (!req.session.utilizator){
        randeazaEroare(res,403,)
        res.render("pagini/eroare_generala",{text:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();
 
    formular.parse(req,function(err, campuriText, campuriFile){
       
        var parolaCriptata=Utilizator.criptareParola(campuriText.parola);
        // AccesBD.getInstanta().update(
        //     {tabel:"utilizatori",
        //     campuri:["nume","prenume","email","culoare_chat"],
        //     valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
        //     conditiiAnd:[`parola='${parolaCriptata}'`]
        // },  
        AccesBD.getInstanta().updateParametrizat(
            {tabel:"utilizatori",
            campuri:["nume","prenume","email","culoare_chat"],
            valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
            conditii:[[`parola='${parolaCriptata}'`,`username=${campuriText.username}`]]
            //si username in conditii
        },          
        function(err, rez){
            if(err){
                console.log("eroare:");
                console.log(err);
                randeazaEroare(res,2);
                return;
            }
            //console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pagini/profil",{mesaj:"Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
            else{            
                //actualizare sesiune
                console.log("ceva");
                req.session.utilizator.nume= campuriText.nume;
                req.session.utilizator.prenume= campuriText.prenume;
                req.session.utilizator.email= campuriText.email;
                req.session.utilizator.culoare_chat= campuriText.culoare_chat;
                res.locals.utilizator=req.session.utilizator;
            }
 
 
            res.render("pagini/profil",{mesaj:"Update-ul s-a realizat cu succes."});
 
        });
       
 
    });
});

ttp://${Utilizator.numeDomeniu}/confirmare_mail/${token}/${utiliz.username}'
//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}
app.get("/confirmare_mail/:token/:username",function(req,res){
    console.log(req.params);
    try {
        Utilizator.getUtilizDupaUsername(req.params.username,{res:res,token:req.params.token} ,function(u,obparam){
            AccesBD.getInstanta().update(
                {tabel:"utilizatori",
                campuri:{confirmat_mail:'true'}, 
                conditii:[[`cod='${obparam.token}'`]]}, 
                function (err, rezUpdate){
                    if(err || rezUpdate.rowCount==0){
                        console.log("Cod:", err);
                        afisareEroare(res,3);
                    }
                    else{
                        res.render("pagini/confirmare.ejs");
                    }
                })
        })
    }
    catch (e){
        console.log("eroare:");
        console.log(e);
        renderError(res,2);
    }
})


app.get("/*",function(req, res){
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if(err){
                console.log("eroare:");
                console.log(err);
                console.log("ceva",err.message);
                if(err.message.startsWith("Failed to lookup view"))
                //afisareEroare(res,{_identificator:404, _titlu:"ceva"});
                    afisareEroare(res,404, "ceva");
                else
                    afisareEroare(res);
            }
            else{
                
                res.send(rezRandare);
            }
        } );
    }

    catch(err){
        console.log("eroare:");
        console.log(err);
        if(err.message.startsWith("Cannot find module")){
            afisareEroare(res,404,"Fisier resursa negasit");
        }
    }
})
 



function initErori(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
   
    obGlobal.obErori=JSON.parse(continut);
    let vErori=obGlobal.obErori.info_erori;
    //for (let i=0; i< vErori.length; i++ )
    for (let eroare of vErori){
        eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;
    }
}
initErori();



function initImagini(){
    var continut= fs.readFileSync(__dirname+"/resurse/json/galerie_statica.json").toString("utf-8");
   
    obGlobal.obImagini=JSON.parse(continut);

    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleMediu=path.join(caleAbs,"mediu");
    let caleMic=path.join(caleAbs,"mic"); //folder in care vom crea imaginile de dim medie
    if(!fs.existsSync(caleMediu))
        fs.mkdirSync(caleMediu);
    if(!fs.existsSync(caleMic))
        fs.mkdirSync(caleMic);
    let vImagini=obGlobal.obImagini.imagini;
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_fisier.split(".");

        let caleAbsFisier=path.join(caleAbs,imag.cale_fisier);
        let caleAbsFisierMediu=path.join(caleMediu,numeFis+".webp");
        let caleAbsFisierMic=path.join(caleMic,numeFis+".webp");

        sharp(caleAbsFisier).resize(400).toFile(caleAbsFisierMediu);
        sharp(caleAbsFisier).resize(200).toFile(caleAbsFisierMic);

        imag.fisier="/"+path.join(obGlobal.obImagini.cale_galerie,imag.cale_fisier);
        imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie,"mediu",numeFis+".webp");
        imag.fisier_mic="/"+path.join(obGlobal.obImagini.cale_galerie,"mic",numeFis+".webp");



    }
}
initImagini();

/*
daca  programatorul seteaza titlul, se ia titlul din argument
daca nu e setat, se ia cel din json
daca nu avem titluk nici in JSOn se ia titlul de valoarea default
idem pentru celelalte
*/

function afisareEroare(res, _identificator, _titlu="titlu default", _text, _imagine ){
    let vErori=obGlobal.obErori.info_erori;
    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;} )
    if(eroare){
        let titlu1= _titlu=="titlu default" ? (eroare.titlu || _titlu) : _titlu;
        let text1= _text || eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
        else
            res.render("pagini/eroare", {titlu:titlu1, text:text1, imagine:imagine1});
    }
    else{
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", {titlu:errDef.titlu, text:errDef.text, imagine:obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
    

}





app.listen(8080);
console.log("Serverul a pornit");