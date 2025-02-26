const characterNames = ["all","aki","blanka","cammy","chunli","deejay","dhalsim","ed","gouki","guile","honda","jamie","jp","juri","ken","kimberly","lily","luke","manon","marisa","rashid","ryu","terry","vega","zangief"]
const timePeriodArray = ["202306","202307","202308","202309","202310","202311","202312","202401","202402","202403","202404","202405","202406","202407","202408","202409","202410","202411","202412","202501"]

document.getElementById("characterSelect").onchange = onSelectOption;
const characterImg = document.getElementById("fighterImg");

const canvas = document.getElementById("dataChartCanvas");

var currentChart;

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
  characterData = await RequestCharacterData(characterNames[characterIndex]);

  console.log(characterData);

  timePeriodLabels = Object.keys(characterData);
  playRateValues = Object.values(characterData);

  timePeriodValues = [];

  for(let i = 0; i < timePeriodLabels.length; i++)

    timePeriodValues.push(parseInt(timePeriodLabels[i]));

  console.log(timePeriodValues);
  console.log(playRateValues);

  if(currentChart != null){

    currentChart.destroy();
  }

  const characterImageUrl = `https://www.streetfighter.com/6/buckler/assets/images/material/character/character_${characterToolName}_l.png`
  characterImg.src = characterImageUrl;

  currentChart = new Chart("dataChartCanvas", {
    type: "line",
    data: {
      labels: timePeriodValues,
      datasets: [{
        fill: false,
        lineTension: 0,
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
  characterData = await RequestCharacterData("all");

  console.log(characterData);

  if(currentChart != null){

    currentChart.destroy();
  }

  const characterImageUrl = "https://www.streetfighter.com/6/buckler/assets/images/material/character/character_random_l.png"
  characterImg.src = characterImageUrl;

  var dataSets = [];

  for(character in characterData)
  {
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);

    dataSet = {
      label : character,
      data : Object.values(characterData[character]),
      backgroundColor: randomColor,
      borderColor: randomColor,
      lineTension: 0,
      fill: false,
    }

    dataSets.push(dataSet);
  }

  console.log(dataSets);

  currentChart = new Chart("dataChartCanvas", {
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