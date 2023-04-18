import { DecisionTree } from "./libraries/decisiontree.js";
//import { VegaTree } from "./libraries/vegatree.js";

function addEventListenerToSubmitButton() {
    let length = document.getElementById("length");
    let height = document.getElementById("height");
    let thick = document.getElementById("diameter");
    let area = document.getElementById("area");
    let submitBtn = document.getElementById("submit-button");
  
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!length.value || !height.value || !thick.value || !area.value) {
        alert("Fill everything in");
      } else {
        let rice = {
          MajorAxisLength: length.value, 
          MinorAxisLength: height.value, 
          EquivDiameter: thick.value,
          Area: thick.area,
      };
      loadSavedModel(rice);
      }
    });
  }
  
  addEventListenerToSubmitButton();
  
  function loadSavedModel(rice) {
    fetch("model2/model.json")
      .then((response) => response.json())
      .then((model) => {
        modelLoaded(model, rice);
        console.log(model);
      });
  }
  
  function modelLoaded(model, rice) {
    let decisionTree = new DecisionTree(model);
    let prediction = decisionTree.predict(rice);

    let userInput = document.getElementById("userInput");
 
    
    let value;
    if (prediction === "1") {
      value = 'Jasmine Rice';
      // Replace with the actual image filename
    } else if (prediction === "0") {
      value = 'Gonen Rice';
    }
    if (userInput !== null && prediction !== undefined) {
        userInput.innerText = `The computer is around  99.6% sure that you're eating ${value}`;
    }
      
   // let visual = new VegaTree("#view", 900, 500, decisionTree.toJSON());
  }
    loadSavedModel();