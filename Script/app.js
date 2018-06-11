const url = 'http://127.0.0.1:3000';
let count = 0;

// Funkcja odbierająca, wykonująca obliczenia i wysyłająca dane
async function getCalculatePost() {
    let data = await axios.get(url);
    data = data.data;
    if(data) {
        count++;
        console.log(count);

        //Pętla opóźniająca
        for(let i=0; i<1000; i++){
            let result = {id: data.id, result: math.lusolve(data.matrix, data.result)};
        }

        let result = {id: data.id, result: math.lsolve(data.matrix, data.result)};
        await axios.post(url + '/package', result);
        await getCalculatePost();
    }
}

//Obsługa strony internetowej
function websiteAction() {
    let a = document.getElementById("number1").value;
    let b = document.getElementById("number2").value;
    document.getElementById("result").innerText = Math.pow(a,b);
}

getCalculatePost();