import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//data inladen
const csvFile = "data/riceClassification.csv";
//waarop getraind wordt 
const trainingLabel = "Class";  
//ignored comlumns
const ignored = ["id", "Eccentricity", "ConvexArea", "Extent", "Perimeter", "AspectRation", "Roundness" ]  

                
let amountCorrect = 0;
let totalAmount = 0;
let decisionTree;
//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => {console.log(results.data) 
            trainModel(results.data) }
            // gebruik deze data om te trainen
  // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    //data rond shuffelen
    data.sort(() => (Math.random() - 0.5));
    //splits data in traindata en testdata
    let trainingData = data.slice(0, Math.floor(data.length * 0.8));
    let testingData = data.slice(Math.floor(data.length * 0.8) + 1);

    console.log("train data: "+ trainingData);
    console.log("test data: "+ testingData);

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainingData,
        categoryAttr: trainingLabel
    })

      // Model opslaan als JSON
  let json = decisionTree.stringify();
  console.log('model')
  console.log(json);

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    predictAll(testingData)

    // todo : bereken de accuracy met behulp van alle test data
    calculateAccuracy()
}

function predictAll(testingData){
    amountCorrect = 0
    totalAmount = testingData.length
  
    let actualPositive = 0
    let actualNegative = 0
    let predictedWrongPositive = 0
    let predictedWrongNegative = 0
    
    for (const item of testingData) {
      let testDataNoLabel = Object.assign({}, item)
      delete testDataNoLabel[trainingLabel]
  
      let prediction = decisionTree.predict(testDataNoLabel)
  
      if(prediction == item[trainingLabel]) {
        amountCorrect++
  
        if(prediction == 0){
          actualNegative++
        }
  
        if(prediction == 1){
          actualPositive++
        }
      }
      if(prediction == 0 && item[trainingLabel] == 1){
        console.log("predicted having items correctly")
        predictedWrongNegative++
      }
      if(prediction == 1 && item[trainingLabel] == 0){
        console.log("predicted no items but was wrong")
        predictedWrongPositive++
      }
    }
    
    showMatrix(actualPositive,actualNegative,predictedWrongPositive,predictedWrongNegative)
  }



    // todo : bereken de accuracy met behulp van alle test data
    function calculateAccuracy(){

        let accuracy = (amountCorrect / totalAmount) * 100

        console.log("Accuracy:" + accuracy)

        let accDiv = document.getElementById("accuracy")
        accDiv.innerHTML = `Accuracy: ${accuracy}`
}

function showMatrix(actualMalignent,actualBenign,predictedWrongMalignent,predictedWrongBenign){
    document.getElementById("total").innerHTML = totalAmount +" tested in total."
    document.getElementById("total-correct").innerHTML = amountCorrect +" predicted correctly!"

    document.getElementById("actual-d").innerHTML = actualMalignent
    document.getElementById("actual-no-d").innerHTML = actualBenign
    document.getElementById("predicted-wrong-no-d").innerHTML = predictedWrongMalignent
    document.getElementById("predicted-wrong-d").innerHTML = predictedWrongBenign
}

loadData() 



