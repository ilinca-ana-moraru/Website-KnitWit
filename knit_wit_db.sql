DROP TYPE IF EXISTS categorii;
DROP TYPE IF EXISTS tipuri_culori;

CREATE TYPE categorii AS ENUM('lana','accesorii');

CREATE TYPE tipuri_culori AS ENUM('blush','pink','coral','watermelon','hot pink','bright pink', 'red','crimson','light yellow',
'yellow','mustard','light orange','orange','burnt orange','sage','lime','apple','olive','grass','forest','lavendar','violet',
'plum','eggplant','mint','babby blue','tiffany','turqoise','teal','colbalt','royal','navy','silver','grey','dark grey','charcoal',
'sand','soft brown','light cocoa','brown','cocoa','black','white');

CREATE TYPE tipuri_branduri AS ENUM('Drops', 'Pro Lana');

drop table produse;
CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   categorie categorii default 'lana',
   gramaj INT NOT NULL check(gramaj>=0),
   pret NUMERIC(8) NOT NULL,
   grosime NUMERIC(3,1),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   brand tipuri_branduri NOT NULL,
   compozitie VARCHAR [],
   spalabil_la_masina BOOLEAN NOT NULL DEFAULT FALSE,
   pentru_sosete BOOLEAN NOT NULL DEFAULT FALSE

);

GRANT ALL PRIVILEGES ON DATABASE knit_wit_db TO ilinca ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ilinca;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ilinca;


CREATE TYPE tipuri_materiale AS ENUM('Alpaca','Poliamide','Lana','Lana Merinos','Bumbac','Vascoza','In','Mohair','Matase','Bumbac reciclat','Metal','Plastic','Lemn de mesteacan');
INSERT INTO produse (nume, imagine, gramaj, pret, grosime, brand, compozitie, descriere, spalabil_la_masina) VALUES
('Air','air.jpg',50, 20, 4.5, 'Drops','{"Alpaca","Poliamide","Lana"}','Fir de grosime medie din baby alpaca și lână merinos',False),
('Alaska','alaska.jpg',50 , 13, 5.5,'Drops','{"Lana"}', 'Ah! Tradiționala lână!',False),
('Alpaca','alpaca.jpg', 100, 23, 3,'Drops','{"Alpaca"}', 'Dintotdeauna numărul 1 în topul preferințelor, făcut în întregime din lână fină de alpaca',False),
('Andes','andes.jpg', 70, 26, 6,'Drops','{"Lana","Alpaca"}', 'Un amestec moale și gros de alpaca și lână.',False),
('Baby Merino','baby_merino.jpg', 50, 20, 3,'Drops','{"Lana Merinos"}', 'Lână extra fină merino ce poate fi spălată la mașină',True),
('Belle','belle.jpg', 100, 10, 2.5,'Drops','{"Bumbac","Vascoza","In"}', 'Luxul de zi cu zi!',False),
('Big Merino','big_merino.jpg', 100, 28, 7,'Drops','{"Lana Merinos"}', 'Lână extra fină merinos ce poate fi spălată la mașină',True),
('Bomull-Lin','bomull-lin.jpg', 50, 14, 4,'Drops','{"Bumbac","In"}', 'Eleganta rustica din bumbac si in.',False),
('Fabel','fabel.jpg', 50, 20, 3,'Drops','{"Lana","Poliamida"}', 'Lână de șosete tratată Superwash',True),
('Flora','flora.jpg', 50, 15, 2.5,'Drops','{"Lana","Alpaca"}', 'Confort zilnic învăluită în alpaca și lână',False),
('Karisma','karisma.jpg', 70, 18, 4,'Drops','{"Lana"}', 'Lână tradițională tratată pentru o super spălare',True),
('Kid Silk','kid-silk.jpg', 25, 30, 4,'Drops','{"Mohair","Matase"}', 'Un mix uimitor de mohair super kid și mătase',False),
('Lima','lima.jpg', 50, 14, 4.5,'Drops','{"Lana","Alpaca"}', 'Firul perfect de zi cu zi!',False),
('Melody','melody.jpg', 25, 27, 4,'Drops','{"Alpaca","Lana"}', 'Un amestec voluptos de lână merino și alpaca pieptănată',False),
('Merino Extra Fine','merino_extra_fine.jpg', 50, 20, 4,'Drops','{"Lana Merinos"}', 'Lână extra fină merino ce poate fi spălată la mașină',True),
('Muskat','muskat.jpg', 50, 12, 4,'Drops','{"Bumbac"}', 'Bumbac mercerizat cu luciu colorat!',False),
('Nepal','nepal.jpg', 50, 12, 5,'Drops','{"Lana","Alpaca"}', 'Firul perfect de zi cu zi!',False),
('Nord','nord.jpg', 50, 14, 3.5,'Drops','{"Alpaca","Poliamida","Lana"}', 'Mătăsos și durabil cu alpaca, lână și poliamidă',False),
('Paris','paris.jpg', 50, 9, 4.5,'Drops','{"Bumbac"}', 'Bumbac de tricotat ușor și distractiv!',False),
('Polaris','polaris.jpg', 100, 21, 9,'Drops','{"Lana"}', 'Ideal pentru împâslire!',False),
('Puna','puna.jpg', 50, 16, 3,'Drops','{"Alpaca"}', 'Catifelare desăvârșită din alpaca',False),
('Safran','safran.jpg', 50, 8, 3,'Drops','{"Bumbac"}', 'Bumbac în orice culoare!',False),
('Sky','sky.jpg', 50, 18, 3,'Drops','{"Alpca","Poliamide","Lana"}', 'Extra delicat și ușor din baby alpaca și lână merino',False),
('Snow','snow.jpg', 100, 16, 12,'Drops','{"Lana"}', 'Ideal pentru impaslire!',False),
('Soft Tweed','soft-tweed.jpg', 50, 18, 4,'Drops','{"Alpaca","Lana","Vascoza"}', 'Un clasic Tweed din Alpaca Superfină și Lână Merinos',False),
('Wish','wish.jpg', 50, 12, 6,'Drops','{"Alpaca","Bumbac"}', 'Un fir de vis din baby alpaca, lână merino și bumbac pima.',False);


INSERT INTO produse (nume, imagine, gramaj, pret, grosime, brand, compozitie, descriere, spalabil_la_masina, pentru_sosete) VALUES
('Basic Cotton','basic_cotton.webp',120,18,3,'Pro Lana','{"bumbac"}','Bumbac mercerizat de cea mai înaltă calitate!',False,True),
('Kid Seta','kid_seta.png',25,45,4,'Pro Lana','{"Mohair","Matase"}','Fiecare scul are un gradient de culoare unic',False,False),
('Socks Ball','socks_ball.jpg',100,47,2.5,'Pro Lana','{"Lana","Poliamida"}','Șosete tricotate din fire special create pentru șosete, înfășurate manual!',True,True),
('Drops Loves You','drops_loves_you.jpg',70,7,2,'Drops','{"Bumbac reciclat"}','Colorat și distractiv din bumbac reciclat.',False,True);

INSERT INTO produse (categorie, nume, imagine, gramaj, pret, grosime, brand, compozitie, descriere,pentru_sosete) VALUES
('accesorii','Drops andrele 2.5mm pentru sosete','Drops-2.5mm-sosete.jpeg',10,25,2.5,'Drops','{"Metal","Plastic"}','Andrele Circulare Fixe Drops Lace 40cm sunt foarte confortabile de utilizat și au un preț foarte bun în comparație cu cele de calitate similară oferite de alte mărci.',True),
('accesorii','Drops andrele 3.5mm','Drops-3.5mm.jpg',10,25,3.5,'Drops','{"Metal","Plastic"}','Andrele Circulare Fixe Drops Lace 60cm sunt foarte confortabile de utilizat și au un preț foarte bun în comparație cu cele de calitate similară oferite de alte mărci.',False),
('accesorii','Drops andrele 4.5mm','Drops-4.5mm.jpg',13,30,4.5,'Drops','{"Metal","Plastic"}','Andrele Circulare Fixe Drops Lace 80cm sunt foarte confortabile de utilizat și au un preț foarte bun în comparație cu cele de calitate similară oferite de alte mărci.',False),
('accesorii','Pro Lana andrele 3mm pentru sosete','ProLana-3mm-sosete.jpg',12,23,3,'Pro Lana','{"Metal","Plastic"}','Andrele Circulare sunt realizate manual și asamblate într-o regiune pitorească din Kathmandu, Nepal. Procesul lor de producție nu se bazează pe automatizarea mecanizată. În schimb, beneficiază de atingerea umană grațioasă a meșterilor pricepuți nepalezi. ',True),
('accesorii','Pro Lana andrele 9mm','ProLana-9mm.jpg',27,56,9,'Pro Lana','{"Lemn de mesteacan","Plastic"}','Un instrument foarte util în orice trusa de lucru manual! Acestea sunt realizate din lemn de mesteacăn de înaltă calitate, cu suprafață foarte bine lustruită și netedă. ',False),
('accesorii','Pro Lana andrele 12mm','ProLana-12mm.jpg',30,65,12,'Pro Lana','{"Lemn de mesteacan","Plastic"}','Un instrument foarte util în orice trusa de lucru manual! Acestea sunt realizate din lemn de mesteacăn de înaltă calitate, cu suprafață foarte bine lustruită și netedă. ',False);

