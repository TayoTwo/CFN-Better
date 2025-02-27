document.getElementById("submit").onclick = onClickSubmit;

async function requestCFNDataPage(region,page){

  const currentURL = document.URL;
  const requestURL = currentURL + "/region/" + region + "/page/" + page;
  console.log(requestURL);

  try {
    const response = await fetch(requestURL, {
      method: "GET",
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

async function requestCFNPlayers(region,playerCount){

  const currentURL = document.URL;
  const requestURL = currentURL + "/region/" + region + "/playercount/" + playerCount;
  console.log(requestURL);

  try {
    const response = await fetch(requestURL, {
      method: "GET",
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

async function createWebpage(region,page,playercount){

  document.getElementById("fighters").innerHTML = "Loading...";

  const filteredData = await requestCFNPlayers(region,playercount);

  document.getElementById("fighters").innerHTML = "";

  // Generate some divs
  for(let i = 0; i < playercount;i++){

    const item = filteredData[i];

    console.log(filteredData);

    if(item != null){

      const fighterName = item.fighter_banner_info.personal_info.fighter_id;
      const rank = i +1;
      const rating = item.rating;
      const characterToolName = item.character_tool_name;
      const characterImageUrl = `https://www.streetfighter.com/6/buckler/assets/images/material/character/character_${characterToolName}_l.png`

      const currentDiv = document.getElementById("fighters");
      const fighterDiv = document.createElement("div");

      /*var fighterRank = document.createElement("span");
      fighterRank.textContent = ``;
      fighterRank.className = "fighterRank";*/

      var fighterText = document.createElement("span");
      fighterText.textContent = `#${rank} - ${fighterName} | ${rating} MR`;
      fighterText.className = "fighterText";

      var fighterImg = document.createElement("img");
      fighterImg.src = characterImageUrl;
      fighterImg.className = "fighterImg";

      // add the text node to the newly created div
      //fighterDiv.appendChild(fighterRank);

      // add the image node to the newly created div
      fighterDiv.appendChild(fighterImg);

      // add the text node to the newly created div
      fighterDiv.appendChild(fighterText);

      fighterDiv.className = "fighter";

      // add the newly created element and its content into the DOM
      currentDiv.appendChild(fighterDiv);
    }
    else {
      return;
    }
  }
}

function onClickSubmit(){

  const region = document.getElementById("region").value;
  const page = -1;
  const playerCount = document.getElementById("playercount").value;

  console.log("Submit clicked");

  createWebpage(region,page,playerCount);
}