const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const math = require('mathjs');

const N = 20000;
let packagesAll = [];
let packagesAvailable = [];
let packagesDone = [];

function fillPackages(n, min, max){
    for(let i=0; i<n; i++)
        packagesAll.push({matrix: math.random([3, 3], min, max), result: math.random([3, 1], min, max)});
}

function getElementsFromFile(path){
    let lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(path)
    });
    lineReader.on('line', function (line) {
        let matrix = line.split(';');
        let exercise = [];
        for(let i=0; i<funs.length; i++)
            exercise.push(funs[i]);
        packagesAll.push(exercise);
    });
}



app.get('/', (req, res) => {
    let pack = packagesAvailable.shift();
    if(pack)
        res.json(pack);
    else
        res.status(204).send('No more exercises\n');
});

app.post('/package', (req, res) =>{
      packagesDone.push(req.body);
      console.log(req.body);
      console.log(packagesDone.length);
      res.status(201).send('Got your result\n');
});


fillPackages(N,-100,100);
packagesAvailable = packagesAll.slice();

app.listen(port);
console.log('Server started at: '+port);
