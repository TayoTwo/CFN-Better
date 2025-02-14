require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

const bucklerId = process.env.BUCKLER_ID;
const bucklerRId = process.env.BUCKLER_RID;
const urlToken = process.env.URL_TOKEN;

const regionName = ["All","Africa","Asia","Europe","South America","North America","Oceania","Specific Region"]
const referer = "https://www.streetfighter.com/6/buckler/ranking/league";
var myInfo;

async function getCFNData(page,region) {

  const url =`https://www.streetfighter.com/6/buckler/_next/data/${urlToken}/en/ranking/master.json?season_type=1&page=${page}&home_category_id=${region}`;

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

function processData(data){
  
  // Get our master ratings list
  var masterRatingRanking = data.master_rating_ranking;

  // Store our info if we want to do something with it later
  myInfo = masterRatingRanking.my_ranking_info;

  delete masterRatingRanking.my_ranking_info;

  return masterRatingRanking;
}

app.get('/CFN/region/:region/page/:page', async (req, res) => {
  const requestPage = req.params.page;
  const requestRegion = req.params.region;
  const cfnData = await getCFNData(requestPage,requestRegion);
  console.log("Recieved a request for CFN data");
  console.log(`Request page: ${requestPage} Region: ${regionName[requestRegion]}`);
  console.log("Sending CFN data");
  const processedData = processData(cfnData.pageProps);
  res.send(processedData);
})

app.get('/', async (req, res) => {
  // Send our homepage
  res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/main.js', async (req, res) => {
  // Send our main javascript file
  res.sendFile(path.join(__dirname,'main.js'));
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
