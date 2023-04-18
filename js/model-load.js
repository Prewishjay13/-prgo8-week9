import { createChart, updateChart } from "../libraries/scatterplot.js";

// Neural Network: Can find complex patterns in data and works with regression
// Regression: When the neural network gives back a numeric value
let nn;

// Getting DOM elements
const memoryInputField = document.getElementById("length");
const resoloutionInputField = document.getElementById(
  "height"
);
const batteryInputField = document.getElementById("thick");
const coresInputField = document.getElementById("input");
const predictButton = document.getElementById("prediction-btn");
const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
predictButton.style.display = "none";

/**
 * Fires the prediction and shows it in the viewport
 */
predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let memoryInputFieldValue =
    document.getElementById("length").value;
  let resoloutionInputFieldValue = document.getElementById("height").value;
  let batteryInputFieldValue = document.getElementById("thick").value;
  let coresInputFieldValue = document.getElementById("roundness").value;
  makePrediction(
    +memoryInputFieldValue,
    +resoloutionInputFieldValue,
    +batteryInputFieldValue,
    +coresInputFieldValue
  );
});

function loadData() {
  nn = ml5.neuralNetwork({
    task: "regression",
    debug: true,
  });

  /**
   * Loads in the model
   */
  const modelInfo = {
    model: "./model2/model.json",
    metadata: "./model2/model_meta.json",
    weights: "./model2/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(memory, resoloution, battery, cores) {
  if (memory && resoloution && battery && cores) {
    const results = await nn.predict(
      {
        memory: memory,
        resoloution: resoloution,
        battery: battery,
        cores: cores,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `The roundness of this grain is around: ${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `For the love of.... Fill everything in!.`;
  }
}

loadData();
