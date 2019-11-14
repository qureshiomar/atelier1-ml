let video;

let poseNet;
let nose;

let featureExtractor;
let classifier;
let potato;
let happyImg;
let mehImg;
let sadImg;

let happy;
let meh;
let sad;
let train;
let trained = false;
let save;

function poseNetLoaded() {
  console.log("pose net loaded");
  poseNet.singlePose();
}

function featureExtractorLoaded() {
  console.log("feature extractor loaded");
}

function preload() {
  happyImg = loadImage('assets/happypotato.png');
  mehImg = loadImage('assets/mehpotato.png');
  sadImg = loadImage('assets/sadpotato.png');
}

function setup() {
  createCanvas(400, 400);
  preload();

  video = createCapture(VIDEO);
  video.hide();

  featureExtractor = ml5.featureExtractor('MobileNet', featureExtractorLoaded);
  classifier = featureExtractor.classification();

  poseNet = ml5.poseNet(video, poseNetLoaded);
  poseNet.on('pose', function(results){
    // console.log(results);
    if(results) {
      nose = results[0].pose.nose;
    }
  })
  modelTraining();
}

function draw() {50
  image(video, 0, 0);

  if(trained) {
    classifier.classify(video, function(error, data){
      console.log(data[0].label);
      potato = data[0].label;
    })
  }
  if(nose){
    if(potato == "happy"){
      image(happyImg, nose.x - 200, nose.y - 200, 400, 400);
    } else if (potato == "meh") {
      image(mehImg, nose.x - 200, nose.y - 200, 400, 400);
    } else if (potato == "sad") {
      image(sadImg, nose.x - 200, nose.y - 200, 400, 400);
    }
  }
}

function modelTraining() {
  happy = createButton('happy');
  meh = createButton('meh');
  sad = createButton('sad');
  train = createButton('train');
  save = createButton('save');

  happy.mousePressed(function(){
    classifier.addImage(video, 'happy')
  });
  meh.mousePressed(function(){
    classifier.addImage(video, 'meh')
  });
  sad.mousePressed(function(){
    classifier.addImage(video, 'sad')
  });
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
  save.mousePressed(function(){
    classifier.save();
  });
}