document.getElementById("submit").onclick = onClickSubmit;

async function requestCFNData(region,page){

  const currentURL = document.URL;
  const requestURL = currentURL + "CFN/region/" + region + "/page/" + page;
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

async function createWebpage(region,page){

  const filteredData = await requestCFNData(region,page);
  console.log(filteredData);

  document.getElementById("fighters").innerHTML = "";

    // Generate some divs
  for(let i = 0; i < filteredData.ranking_fighter_list.length;i++){

    const item = filteredData.ranking_fighter_list[i];
    const fighterName = item.fighter_banner_info.personal_info.fighter_id;
    const rating = item.rating;

    const currentDiv = document.getElementById("fighters");
    const fighterDiv = document.createElement("div");

    // and give it some content
    const newContent = document.createTextNode(`Fighter: ${fighterName} Master Rate: ${rating}`);

    // add the text node to the newly created div
    fighterDiv.appendChild(newContent);
    // add the newly created element and its content into the DOM
    currentDiv.appendChild(fighterDiv);
  }
}

function onClickSubmit(){

  const region = document.getElementById("region").value;
  const page = document.getElementById("page").value;

  console.log("Submit clicked");

  createWebpage(region,page);
}