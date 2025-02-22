const characterNames = ["aki","blanka","cammy","chunli","deejay","dhalsim","ed","gouki","guile","honda","jamie","jp","juri","ken","kimberly","lily","luke","manon","marisa","rashid","ryu","terry","vega","zangief"]

document.getElementById("characterSelect").onchange = onSelectOption;
const characterImg = document.getElementById("fighterImg");

const canvas = document.getElementById("dataChartCanvas");

var currentChart;

async function requestCharacterData(character){

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

async function generateChart(characterIndex){

  const characterToolName = characterNames[characterIndex];
  characterData = await requestCharacterData(characterNames[characterIndex]);

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

function onSelectOption(){

  const characterIndex = document.getElementById("characterSelect").value;

  console.log("Submit clicked");

  generateChart(characterIndex);
}