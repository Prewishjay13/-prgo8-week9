import { createChart, updateChart } from "../libraries/scatterplot.js";

let nn;

// Getting DOM elements
const memoryInputField = document.getElementById("memory-input-field");
const resoloutionInputField = document.getElementById(
  "resoloution-input-field"
);
const batteryInputField = document.getElementById("battery-input-field");
const predictButton = document.getElementById("prediction-btn");
const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");


predictButton.style.display = "none";
saveButton.style.display = "none";


predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let memoryInputFieldValue =
    document.getElementById("memory-input-field").value;
  let resoloutionInputFieldValue = document.getElementById(
    "resoloution-input-field"
  ).value;
  let batteryInputFieldValue = document.getElementById("battery-input-field").value;
  makePrediction(
    +memoryInputFieldValue,
    +resoloutionInputFieldValue,
    +batteryInputFieldValue,
  );
});

/**
 * Save the trained model
 */
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  nn.save();
});

/**
 * Preparing the data
 */
function loadData() {
  Papa.parse("./data/rice.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => createNeuralNetwork(results.data),
  });
}

/**
 * Creating a Neural Network
 */
function createNeuralNetwork(data) {
  data.sort(() => Math.random() - 0.5);
  // Slice data into test and training data
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);
  console.table(testData);

  nn = ml5.neuralNetwork({
    task: "regression",
    debug: true,
  });

  // Adding data to the Neural Network
  for (let mobilePhone of trainData) {
    let inputs = {
      memory: mobilePhone.length.toFixed(1),
      resoloution: mobilePhone.height.toFixed(1),
      battery: mobilePhone.diameter.toFixed(1),
    };

    nn.addData(inputs, { price: mobilePhone.roundness });
  }

  // Normalize
  nn.normalizeData();

  //Pass data to next function
  checkData(trainData, testData);
}

/**
 * Checks if loading of CSV file was succesful
 */
function checkData(trainData, testData) {
  console.table(testData);



  // Prepare the data for the scatterplot
  const chartdata = trainData.map((mobilePhone) => ({
    x: mobilePhone.roundness,
    y: mobilePhone.length,
  }));

  // Create a scatterplot
  createChart(chartdata, "Length", "roundness");

  // Pass data to next function
  startTraining(trainData, testData);
}

/**
 * Trains the neural network
 * epochs: A value that should be as close as possible to value 0
 */
function startTraining(trainData, testData) {
  nn.train({ epochs: 25, batchSize: 12 }, () => finishedTraining(trainData, testData));
}

async function finishedTraining(trainData = false, testData) {
  // Empty array to push all the data in
  let predictions = [];
  // For loop for every possible price in CSV
  for (let pr = 0; pr < 200; pr += 5) {
    const testPhone = {
      memory: testData[0].length.toFixed(1),
      resoloution: testData[0].height.toFixed(1),
      battery: testData[0].diameter.toFixed(1),
    };
    const pred = await nn.predict(testPhone);
    predictions.push({ x: pr, y: pred[0].roundness });
  }

  // Adds the neural network data to the chart
  updateChart("Predictions: ", predictions);
  console.log("Finished training!");

  // Show the DOM elements after loading the scatterplot and neural network
  memoryInputField.style.display = "inline";
  resoloutionInputField.style.display = "inline";
  batteryInputField.style.display = "inline";
  predictButton.style.display = "inline";
  saveButton.style.display = "inline";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(length, height, diameter) {
  if (length && height && diameter) {
    const results = await nn.predict(
      {
        memory: length.toFixed,
        resoloution: height.toFixed,
        battery: diameter.toFixed,
      },
      () => console.log("Successfully predicted!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `The price of this phone is predicted to be arund: €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in everthing.`;
  }
}

loadData();