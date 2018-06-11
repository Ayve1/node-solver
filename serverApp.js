const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const math = require('mathjs');
let startTime;
const N = 20000;
let packagesAll = [];
let packagesAvailable = [];
let packagesDone = [];
let packagesInWork = [];
function fillPackages(n, min, max){
    for(let i=0; i<n; i++)
        packagesAll.push({id: i, matrix: math.random([3, 3], min, max), result: math.random([3, 1], min, max)});
}


app.get('/', (req, res) => {
    if(packagesAvailable.length === N) {
        console.log("INFO: Do zrobienia: "+packagesAvailable.length);
        startTime = Date.now();
        console.log("TIMER: start");
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
        console.log("TIMER: STOP, TIME: "+(Date.now()-startTime));
    }
});


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
