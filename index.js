require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

const bucklerId = process.env.BUCKLER_ID;
const bucklerRId = process.env.BUCKLER_RID;
const urlToken = process.env.URL_TOKEN;

const regionName = ["All","Africa","Asia","Europe","South America","North America","Oceania","Specific Region"]

async function getCFNData(region,page) {

  const url =`https://www.streetfighter.com/6/buckler/_next/data/${urlToken}/en/ranking/master.json?page=${page}&home_category_id=${region}`;
  const referer = `https://www.streetfighter.com/6/buckler/ranking/master?home_category_id=${region}&page=${page}`;

  try {
    const response = await fetch(url, {

      method: "GET",
      headers:{
        "Cookie": `buckler_id=${bucklerId}; buckler_praise_date=1739566722445;`,
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
  
  // Get our master ratings list
  var masterRatingRanking = data.pageProps.master_rating_ranking;

  delete masterRatingRanking.my_ranking_info;

  return masterRatingRanking;
}

app.get('/CFN/region/:region/page/:page', async (req, res) => {

  const cfnData = await getCFNData(req.params.region,req.params.page);

  console.log("Recieved a request for CFN data");
  console.log(`Request page: ${req.params.page} Region: ${regionName[req.params.region]}`);
  console.log("Sending CFN data");

  const filteredData = filterData(cfnData);

  res.send(filteredData);
})

app.get('/fighters', async (req, res) => {
  // Send our homepage
  res.sendFile(path.join(dirname,'fighters.html'));
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