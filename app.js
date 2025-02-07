const express = require('express')
const app = express()
const port = 3000

const bucklerId = "";
const bucklerRId = "";
const urlToken = "";
const league = "";
const page = "";

var url =`https://www.streetfighter.com/6/buckler/_next/data/${urlToken}/en/ranking/league.json?character_filter=1&character_id=luke&platform=1&user_status=1&home_filter=1&home_category_id=0&home_id=1&league_rank=${league}&page=${page}`;

async function getCFNData(){
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `Response status: ${response.status}`;
    }

    const json = await response.json();
    return json;
  } catch (error) {
    return error.message;
  }
}

app.get('/', (req, res) => {
  res.send(getCFNData())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
