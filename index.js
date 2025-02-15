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

  // Not sure what home filter is but use 1 if the region is all, otherwise use 2
  var homeFilter;
  if(region == 0){
    homeFilter = 1;
  }
  else {
    homeFilter = 2;
  }
  const url =`https://www.streetfighter.com/6/buckler/_next/data/${urlToken}/en/ranking/master.json?home_category_id=${region}&page=${page}&home_filter=${homeFilter}`;
  const referer = `https://www.streetfighter.com/6/buckler/ranking/master?home_category_id=${region}&page=${page}&home_filter=${homeFilter}`;

  try {
    const response = await fetch(url, {

      method: "GET",
      headers:{
        "Cookie": `buckler_id=${bucklerId}; buckler_praise_date=1739566722445;`,
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
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
  var fighterList = data.pageProps.master_rating_ranking.ranking_fighter_list;

  return fighterList;
}

app.get('/leaderboard/region/:region/page/:page', async (req, res) => {

  console.log("Recieved a request for CFN data");
  console.log(`Request page: ${req.params.page} Region: ${regionName[req.params.region]}`);
  console.log("Getting data from CFN...");

  const cfnData = await getCFNData(req.params.region,req.params.page);

  console.log("Sending CFN data");

  const filteredData = filterData(cfnData);

  res.send(filteredData);
})

app.get('/leaderboard/region/:region/playercount/:playercount', async (req, res) => {

  console.log("Recieved a request for CFN data");
  console.log(`Region: ${regionName[req.params.region]} Player Count: ${req.params.playercount}`);
  console.log("Getting data from CFN...");

  const pageRequests = Math.ceil(req.params.playercount / 20);
  var requestDataArray;

  for(let i = 1; i <= pageRequests;i++){
    const pageData = await getCFNData(req.params.region,i);
    const filteredData = filterData(pageData);

    if(requestDataArray != null){
      for (var key in filteredData) {
        requestDataArray[requestDataArray.length] = filteredData[key];
      }
    }
    else {
      requestDataArray = filteredData;
    }
  }

  console.log("Sending CFN data");

  res.send(requestDataArray);
})

app.get('/leaderboard', async (req, res) => {
  // Send our homepage
  res.sendFile(path.join(__dirname,'leaderboard.html'));
})

app.get('/', async (req, res) => {
  // Send our homepage
  res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/leaderboard.js', async (req, res) => {
  // Send our main javascript file
  res.sendFile(path.join(__dirname,'leaderboard.js'));
})

app.get('/styles.css', async (req, res) => {
  // Send our main javascript file
  res.sendFile(path.join(__dirname,'styles.css'));
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})