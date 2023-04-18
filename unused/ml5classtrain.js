import { createChart, updateChart } from "../libraries/scatterplot.js";
// Step 1: set your neural network options
const options = {
    dataUrl: "data/rice.csv",
    task: 'classification',
    inputs:['length', 'height', 'diameter'],
    outputs:['class'],
    debug: true
  }
  
  // Step 2: initialize your neural network
  const nn = ml5.neuralNetwork(options, dataLoaded);
  
  // Step 3: normalize data and train the model
  function dataLoaded(){
    nn.normalizeData();
    trainModel();
  }
  
  // Step 4: train the model
  function trainModel(){
    const trainingOptions = {
      epochs: 20,
      batchSize: 12
    }
    nn.train(trainingOptions, finishedTraining);
  }
  
  // Step 5: use the trained model
  function finishedTraining(){
    classify();
  }
  
  // Step 6: make a classification
  function classify(){
    const input = {
     length: 23,
     height: 44,
     diameter: 34,
    }
    nn.classify(input, handleResults);
  }
  
  // Step 7: define a function to handle the results of your classification
  function handleResults(error, result) {
      if(error){
        console.error(error);
        return;
      }
      console.log(result); // {label: 'red', confidence: 0.8};
  }