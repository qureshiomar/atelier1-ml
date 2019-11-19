//declare all variables
let video;
let pg;

//posenet variables
let poseNet;
let nose;

//feature extractor variables
let featureExtractor;
let classifier;
let potato;
let happyImg;
let mehImg;
let sadImg;

//training variables
let happy;
let meh;
let sad;
let train;
let trained = false;
let save;

//callback function for initializing posenet
function poseNetLoaded() {
  console.log("pose net loaded");
  //load pre-trained model
  classifier.load('assets/model.json', loadTrainedModel);
  //tell posenet to look for one pose
  poseNet.singlePose();
}

//callback function for intializing feature extractor
function featureExtractorLoaded() {
  console.log("feature extractor loaded");
}

//callback function for intializing the trained model
function loadTrainedModel(){
  //set trained to true
  trained = true;
  console.log("custom model loaded");
}

//preload all images for p5
function preload() {
  happyImg = loadImage('assets/happypotato.png');
  mehImg = loadImage('assets/mehpotato.png');
  sadImg = loadImage('assets/sadpotato.png');
}

function setup() {
  createCanvas(640, 480);
  preload();

  //enable webcam, hide html5 player
  video = createCapture(VIDEO);
  video.hide();

  //load feature extractor
  featureExtractor = ml5.featureExtractor('MobileNet', featureExtractorLoaded);
  //setup classifier
  classifier = featureExtractor.classification();

  //load posenet, 
  poseNet = ml5.poseNet(video, poseNetLoaded);
  //turns posenet on, tells it to start looking for poses
  poseNet.on('pose', function(results){
    //if a pose is found, then
    if(results) {
      //set the variable nose to an object that is equal to the x and y coordinates of the users nose
      nose = results[0].pose.nose;
    }
  })
  // uncomment line below to enable training mode (brings button back to the screen to train and save a new model)
  // modelTraining();
}

function draw() {
  //displays the video camera using p5 image
  image(video, 0, 0);

  //if the model is trained, then
  if(trained) {
    //start classifying using the model
    classifier.classify(video, function(error, data){
      //console log the users current feeling
      console.log(data[0].label);
      //set the variable potato to be equal to the users current feeling
      potato = data[0].label;
    })
  }
  //if nose coordinates are found then
  if(nose){
    //depending on the users current feeling, the respective potato image will be placed over their face using the x and y coordiantes of the users nose.
    if(potato == "happy"){
      image(happyImg, nose.x - 200, nose.y - 200, 400, 400);
    } else if (potato == "meh") {
      image(mehImg, nose.x - 200, nose.y - 200, 400, 400);
    } else if (potato == "sad") {
      image(sadImg, nose.x - 200, nose.y - 200, 400, 400);
    }
  }
}

//used to train a new model
function modelTraining() {
  //create a new button for each feeling that featureextractor should be able to classify
  happy = createButton('happy');
  meh = createButton('meh');
  sad = createButton('sad');
  //create a train button to train the model
  train = createButton('train');
  //create a save button tosave the model
  save = createButton('save');

  //when 'x' button is pressed, save an image into the model with the keyword
  happy.mousePressed(function(){
    classifier.addImage(video, 'happy')
  });
  meh.mousePressed(function(){
    classifier.addImage(video, 'meh')
  });
  sad.mousePressed(function(){
    classifier.addImage(video, 'sad')
  });
  //when train is pressed, start training the model until loss is 0
  train.mousePressed(function(){
    classifier.train(function(loss){
      if(!loss){
        console.log('model is trained');
        trained = true;
      } else {
        console.log(loss);
      }
    })
  });
  //when save is pressed, save the model
  save.mousePressed(function(){
    classifier.save();
  });
}