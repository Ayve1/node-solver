const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const math = require('mathjs');
const path = require('path');
app.use(bodyParser.json());
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/View'));
//Store all JS and CSS in Scripts folder.
app.use(express.static(__dirname + '/Script'));

//dangerous solution - to change!
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const N = 500;
let packagesAll = [];
let packagesAvailable = [];
let packagesDone = [];
let packagesInWork = [];
function fillPackages(n, min, max){
    for(let i=0; i<n; i++)
        packagesAll.push({id: i, matrix: math.random([15, 15], min, max), result: math.random([15, 1], min, max)});
}

// Obsługa strony - GET
app.get('/web', function(req, res) {
    res.sendFile(path.join(__dirname+'/View/website.html'));
});

// Wysyłanie danych metodą GET
app.get('/', (req, res) => {
    if(packagesAvailable.length === N) {
        console.log("INFO: Do zrobienia: "+packagesAvailable.length);
        startTime = Date.now();
        console.time('TIME');
    }
    let pack = packagesAvailable.shift();
    if(pack) {
        packagesInWork.push({time: Date.now(), data: pack});
        res.json(pack);
        console.log("GET: Zostało do zrobienia: "+ packagesAvailable.length);
    } else {
        res.status(204).send('No more exercises\n');
    }
});

//Odbieranie wyników POST
app.post('/package', (req, res) =>{
    for(let i=0; i<packagesInWork.length; i++){
        if(packagesInWork[i].data.id === req.body.id) {
            packagesInWork.splice(i,1);
            break;
        }
    }
    packagesDone.push(req.body);
    //console.log(req.body);
    console.log("POST: Skończone pakiety = "+packagesDone.length);
    res.status(201).send('Got your result\n');
    if(packagesDone.length === N){
        console.timeEnd('TIME');
    }
});

// Weryfikacja, czy powierzone zadanie zostało wykonane
setInterval(function(){
    for(let i=0; i< packagesInWork.length; i++){
        if(Date.now() - packagesInWork[i].time >  5000){
            packagesAvailable.push(packagesInWork[i].data);
            console.log("CHECK: Niedokończony pakiet wrzucono spowrotem id: "+packagesInWork[i].data.id);
            packagesInWork.splice(i, 1);
            console.log("CHECK: Pakiety do zrobienia "+packagesAvailable.length);

        }
    }
}, 1000);


fillPackages(N,-100,100);
packagesAvailable = packagesAll.slice();

const server = app.listen(port);
console.log('SERVER: started at: '+port);
