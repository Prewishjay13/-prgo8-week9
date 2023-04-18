import { createChart, updateChart } from "../libraries/scatterplot.js";
let nn;
// length-memory
// height-resoloution
// diameter-cores
// area-battery
// roundness-price
// Getting DOM elements
const memoryInputField = document.getElementById("length");
const resoloutionInputField = document.getElementById("height");
const batteryInputField = document.getElementById("area");
const coresInputField = document.getElementById("diameter");
const predictButton = document.getElementById("submit-button");
const resultDiv = document.getElementById("result");


function loadData() {
  nn = ml5.neuralNetwork({
    task: "regression",
    debug: true,
  });

  predictButton.addEventListener("click", (e) => {
    e.preventDefault();
    let memoryInputFieldValue = document.getElementById("length").value;
    let resoloutionInputFieldValue = document.getElementById("height").value;
    let batteryInputFieldValue = document.getElementById("area").value;
    let coresInputFieldValue = document.getElementById("diameter").value;
  
    makePrediction(
      +memoryInputFieldValue,
      +resoloutionInputFieldValue,
      +batteryInputFieldValue,
      +coresInputFieldValue
    );
  });

  const modelInfo = {
    model: "regression/model.json",
    metadata: "regression/model_meta.json",
    weights: "regression/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(memory, resoloution, battery, cores) {
    //let resultDiv = document.getElementById("result");

  if (memory && resoloution && battery && cores) {
    let results = await nn.predict(
      {
        memory: memory,
        resoloution: resoloution,
        battery: battery,
        cores: cores,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `With a roundness of: ${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in everthing.`;
  }
}



  
loadData();
