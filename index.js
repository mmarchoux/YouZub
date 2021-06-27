const restUrl = "http://rushmore.freeboxos.fr:8000/yuzeub";
const restPartyUrl = restUrl + "/party";


function getInputValue() {
  // Selecting the input element and get its value 
  var inputValue = document.getElementById("inputValue").value;
  document.getElementById("inputValue").value = "";
  console.log(inputValue);
  return inputValue;
}


function createParty()
{
  axios.post(restPartyUrl)
        .then(response => {
          console.log(response.data)
        })
}

function joinParty()
{
  var input = getInputValue();
  if (input) {
    axios.get(restPartyUrl+"?"+input)
         .then(response => {
           console.log(response.data)
         })
  }
}