# Ristinollan tekoäly minimax algoritmia hyödyntäen
Ohjelmistokehityksen teknologioita kurssin seminaarityönä tutustuin minimax algoritmiin. Tarkoituksena oli luoda tekoäly pelaamaan ristinollaa (viiden suoraa) ja lisätä tämä tekemääni mobiiliapplikaatioon.

Ymmärsin algoritmin periaatteen ja oli mielenkiintoista implementoida sitä peliin vaikka nykyinen toteutus ei toimi täydellisesti.

Taustatietona on hyvä tietää, että aloittaja voittaa aina viidensuorassa optimaalisella pelillä. Tämän vuoksi tasokkaissa peleissä on tasoitettuja aloituksia eri menetelmillä.

---

## Minimax agoritmi
![A minimax tree example](https://upload.wikimedia.org/wikipedia/commons/6/6f/Minimax.svg)

Minimax algoritmi soveltuu hyvin vuoropohjaiseen kaksinpeliin kuten ristinollaan. Algoritmi käsittelee kahta osapuolta minimoijana (min) ja maksimoijana (max). Kuvan osoittamalla tavalla algoritmi haaroittaa pelitilanteesta mahdolliset skenaariot, jotka pisteytetään annetulla logiikalla.

Minimoija valitsee alla olevista haaroista itselle parhaan eli pienimmät pisteet. Maksimoija taasen valitsee alla olevista vaihtoehdoistaan sen, jossa on eniten pisteitä. Algoritmi olettaa siis molempien osapuolien pelaavan optimaalisia siirtoja ja toimii sen mukaisesti.

Ohjelma alkaa siitä, että parasta siirtoa etsivä funktio kutsuu minimaxia jokaisen pelattavan ruudun kohdalla. Minimax jatkaa kutsumalla itseään rekursiivisesti rakentaen haaroja kustakin aloituspisteestä. Jokaisen minimaxin suorituksen alussa pelitilanne tarkistetaan. Mikäli pelin päättävään tilanteeseen on saavuttu, palautetaan tilanteen mukainen pistemäärä. Esimerkkejä pisteytyksestä tämän osion lopussa.

Minimax yksinään ei takaa pelin kannalta nopeinta tapaa voittaa, mikäli hitaampaan voittoon johtava haara löytyy ensin. Algoritmia voikin soveltaa ja optimoida eri tavoin tarpeiden mukaan. Suoritukseen kuluva aika on hyvä huomioida etenkin peleissä. Voittamaton algoritmi, joka laskelmoi tulevia siirtoja kohtuuttoman kauan voi pilata pelikokemuksen.

**Esimerkkejä pisteyttämisestä:**
1. Haara päättyy maksimoijan voittoon eli pelaaja "O" saa 5 merkkiä peräkkäin: voitosta 10 pistettä.
1. Haara päättyy minimoijan voittoon eli pelaaja "X" saa 5 merkkiä peräkkäin: voitosta -10 pistettä.
1. Haara päättyy tasapeliin, kun ruudut loppuvat kesken: tasapelistä 0 pistettä.
1. Algoritmin toimintaa on rajoitettu ja haara päättyy tilanteeseen, jossa pelaaja saa 3 merkin pituisen ketjun, joiden molemmat päät ovat vapaita: +/-5 pistettä

---

## Ristinolla applikaation periaate
Tavoitteena on saada 5 merkkiä peräkkäin ennen vastustajaa. Pelikenttänä toimii 15x15 ruudukko.
![Kuvakaappaus mobiiliapplikaatiosta](https://raw.githubusercontent.com/hirvaks/5-in-a-row-minimax-mobile/master/Mobileapp-Screenshot.jpg)
Pelaajalle annetaan ensimmäinen vuoro. Pelaajan vuoron päätteeksi ohjelma lähettää pelikentän tilanteen tekoälyn käsiteltäväksi. Tekoäly lähtee kutsumaan minimax algoritmia jokaisessa vapaassa ruudussa rajoitusten mukaisesti. Tekoäly palauttaa parhaan siirtonsa koordinaatit johon merkki asetetaan, jolloin vuoro vaihtuu.


---

## Oppiminen
Opin ymmärtämään algoritmin periaatteen parhaiten katsomalla videoita aiheesta. Löysin netistä myös hyviä artikkeleita ja esimerkkikoodia mitä soveltaa. Suurin osa ristinollaan perustuvista esimerkeistä oli tehty kolmen suoraa varten 3x3 ruudukolle, mikä on verrattavasti helpompi ja kevyempi implementoida.

En heti ymmärtänyt kuinka raskaaksi algoritmin pyörittäminen kävi. Käytin paljon aikaa miettiäkseni ja implementoidakseni erilaisia ratkaisuja rajoittamaan algoritmin toimintaa. 225 ruudun kenttä mahdollistaa valtavan määrän erilaisia pelitilanteita, joista algoritmi haaroittaa vaihtoehtoja.

Päällimmäiset keinot, jotka itse oivalsin, oli rajata algoritmille mahdolliset siirrot vain jo pelattujen ruutujen ympärille. Olennaisin rajoite oli kuitenkin rajoittaa rekursiivisien kutsujen maksimimäärää kutakin vaihtoehtoa kohden. Jokainen syvyysaste luo uuden kerroksen pelitilanteiden haaroihin mikä kasvattaa suoritustehon tarvetta.

---

## Käytetyt lähteet
[Algorithms Explained – minimax and alpha-beta pruning](https://www.youtube.com/watch?v=l-hh51ncgDI&ab_channel=SebastianLague)
[Minimax Algorithm in Game Theory | Set 1 (Introduction)](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/)
[Introduction to Evaluation Function of Minimax Algorithm in Game Theory](https://www.geeksforgeeks.org/introduction-to-evaluation-function-of-minimax-algorithm-in-game-theory/?ref=rp)
[Minimax Algorithm in Game Theory | Set 3 (Tic-Tac-Toe AI – Finding optimal move)](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/)

---

## [Gomocup](https://gomocup.org/)
Viiden suoraa pelaaville tekoälyille on olemassa myös vuosittainen kilpailu. Suosittelen perehtymään, mikäli aihe kiinnostaa!

![Gomocup logo](https://gomocup.org/static/images/gomocup_small.png)
”Gomocup is a competition in gomoku (five in row). The competitors are not humans, but computer artificial intelligences (AI, brain).”