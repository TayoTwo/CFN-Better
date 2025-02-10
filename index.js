require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;

const bucklerId = process.env.BUCKLER_ID;
const bucklerRId = process.env.BUCKLER_RID;
const urlToken = process.env.URL_TOKEN;
const league = "All";
const page = "1";
const referer = "https://www.streetfighter.com/6/buckler/ranking/league?character_filter=1&character_id=luke&platform=1&user_status=1&home_filter=1&home_category_id=0&home_id=1&league_rank=1&page=1";

var url =`https://www.streetfighter.com/6/buckler/_next/data/${urlToken}/en/ranking/league.json?`;

async function getCFNData() {
  try {
    const response = await fetch(url, {

      method: "GET",
      headers:{
        "Cookie": `buckler_r_id=${bucklerRId}; buckler_praise_date=1739206388785; buckler_id=${bucklerId}`,
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0"
      }
    }
    );
    if (!response.ok) {
      return `Response status: ${response.status}`;
    }

    const json = await response.json();
    return json;
  } catch (error) {
    return error.message;
  }
}

function filterData(data){
  return data.league_point_ranking;
}

app.get('/', async (req, res) => {
  const cfnData = await getCFNData();
  console.log("Recieved a request for CFN data");
  console.log("Printing CFN data");
  console.log(cfnData);
  const filteredData = filterData(cfnData.pageProps);
  res.send(filteredData);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
