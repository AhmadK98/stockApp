// const fetch = require('node-fetch');
// const fs = require('fs')

// const url = new URL(
//     "https://api.worldtradingdata.com/api/v1/history"
// );

// let params = {
//     "symbol": "TSLA",
//     "api_token": "UsQhjjiFOodsCYt8eWSmRqY7qquA9yqlH2A9uhqv1UvotS00D6AqSeBg8VVf",
//     "date_from":"2008-03-16"
// };
// Object.keys(params)
//     .forEach(key => url.searchParams.append(key, params[key]));

// fetch(url, {
//     method: "GET",
// })
//     .then(response => response.json())
//     .then(json => {
//         fs.writeFile("output.json", JSON.stringify(json), 'utf8', function (err) {
            
//     })});
