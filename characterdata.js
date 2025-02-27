const characterNames = ["all","aki","blanka","cammy","chunli","deejay","dhalsim","ed","gouki","guile","honda","jamie","jp","juri","ken","kimberly","lily","luke","manon","marisa","rashid","ryu","terry","vega","zangief"]

const timePeriodArray = ["20230601","20230701","20230801","20230901","20231001","20231101","20231201","20240101","20240201","20240301","20240401","20240501","20240601","20240701","20240801","20240901","20241001","20241101","20241201","20250101"]

document.getElementById("characterSelect").onchange = onSelectOption;
const characterImg = document.getElementById("fighterImg");

const canvas = document.getElementById("dataChartCanvas");

var CurrentChart;

async function RequestPatchDateData(){

  const requestURL = document.URL.replace("characterdata","") + "patchdates.json";
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

async function RequestCharacterData(character){

  const currentURL = document.URL;
  const requestURL = currentURL + "/" + character;
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

async function GenerateCharacterChart(characterIndex){

  const characterToolName = characterNames[characterIndex];

  patchData = await RequestPatchDateData();
  characterData = await RequestCharacterData(characterNames[characterIndex]);

  console.log(characterData);

  timePeriodLabels = Object.keys(characterData);
  playRateValues = Object.values(characterData);

  timePeriodValues = [];

  for(let i = 0; i < timePeriodLabels.length; i++)

    timePeriodValues.push(parseInt(timePeriodLabels[i]));

  console.log(timePeriodValues);
  console.log(playRateValues);

  if(CurrentChart != null){

    CurrentChart.destroy();
  }

  const characterImageUrl = `https://www.streetfighter.com/6/buckler/assets/images/material/character/character_${characterToolName}_l.png`
  characterImg.src = characterImageUrl;

  CurrentChart = new Chart("dataChartCanvas", {
    type: "line",
    data: {
      labels: timePeriodValues,
      datasets: [{
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(0,0,255,1.0)",
        borderColor: "rgba(0,0,255,0.1)",
        data: playRateValues
      }]
    },
    options: {
      legend: {display: false},
    }
  });
}

async function GenerateAllCharactersChart()
{
  const patchData = await RequestPatchDateData();
  const characterData = await RequestCharacterData("all");

  console.log("Patch data");
  console.log(patchData);

  console.log("Character data");
  console.log(characterData);

  if(CurrentChart != null){

    CurrentChart.destroy();
  }

  const characterImageUrl = "https://www.streetfighter.com/6/buckler/assets/images/material/character/character_random_l.png"
  characterImg.src = characterImageUrl;

  const patchDatesDataset = {
    label : "Patches",
    data : Object.values(patchData),
    backgroundColor: "#000000",
    borderColor: "#000000",
    tension: 0.1,
    fill: false,
  }

  console.log("Patch dates dataset");
  console.log(patchDatesDataset);

  var dataSets = [];

  for(character in characterData)
  {
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);

    var dataSet = {
      label : character,
      data : Object.values(characterData[character]),
      backgroundColor: randomColor,
      borderColor: randomColor,
      tension: 0.1,
      fill: false,
    }

    dataSets.push(dataSet);
  }

  console.log("Datasets");
  console.log(dataSets);

  CurrentChart = new Chart("dataChartCanvas", {
    type: "line",
    data: {
      labels: timePeriodArray,
      datasets: dataSets
    },
    options: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: 'black'
        }
      }
    }
  });
}

function onSelectOption(){

  const characterIndex = document.getElementById("characterSelect").value;

  console.log("Submit clicked");

  if(characterIndex == 0)
  {
    GenerateAllCharactersChart();
  }
  else
  {
    GenerateCharacterChart(characterIndex);
  }

}