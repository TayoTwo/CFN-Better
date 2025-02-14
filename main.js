document.getElementById("submit").onclick = onClickSubmit;

function onClickSubmit(){

  const page = document.getElementById("page").value;
  const region = document.getElementById("region").value;
  const currentURL = document.URL;
  const requestURL = currentURL + "CFN/region/" + region + "/page/" + page;

  console.log("Submit clicked");
  location.replace(requestURL);
}