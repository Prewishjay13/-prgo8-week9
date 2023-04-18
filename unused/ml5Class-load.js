import { createChart, updateChart } from "../libraries/scatterplot.js";

// Neural Network: Can find complex patterns in data and works with regression
// Regression: When the neural network gives back a numeric value
let nn;

// Getting DOM elements
const memoryInputField = document.getElementById("memory-input-field");
const resoloutionInputField = document.getElementById(
  "resoloution-input-field"
);
const batteryInputField = document.getElementById("battery-input-field");
const coresInputField = document.getElementById("cores-input-field");
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
    document.getElementById("memory-input-field").value;
  let resoloutionInputFieldValue = document.getElementById(
    "resoloution-input-field"
  ).value;
  let batteryInputFieldValue = document.getElementById("battery-input-field").value;
  let coresInputFieldValue = document.getElementById("cores-input-field").value;
  makePrediction(
    +memoryInputFieldValue,
    +resoloutionInputFieldValue,
    +batteryInputFieldValue,
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
    model: "./classModel/model.json",
    metadata: "./classModel/model_meta.json",
    weights: "./classModel/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(length, height, diameter) {
  if (length && height && diameter) {
    const results = await nn.predict(
      {
        memory: length,
        resoloution: height,
        battery: diameter,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].roundness.toFixed(2);
    resultDiv.innerText = `The price of this phone is predicted to be arund: €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in everthing.`;
  }
}

loadData();