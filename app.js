
const axios = require('axios');
const math = require('mathjs');

const url = 'http://127.0.0.1:3000';
let count = 0;

async function getCalculatePost() {
    let data = await axios.get(url);
    data = data.data;
    if(data) {
        count++;
        console.log(count);
        let result = {id: data.id, result: math.lsolve(data.matrix, data.result)};
        await axios.post(url + '/package', result);
        await getCalculatePost();
    }
}

getCalculatePost();