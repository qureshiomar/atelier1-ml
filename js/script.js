let video;

let poseNet;
let nose;

let featureExtractor;
let potato;

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

function setup() {
  createCanvas(400, 400);

  video = createCapture(VIDEO);
  video.hide();

  featureExtractor = ml5.featureExtractor('MobileNet', featureExtractorLoaded);

  poseNet = ml5.poseNet(video, poseNetLoaded);
  poseNet.on('pose', function(results){
    console.log(results);
    if(results) {
      nose = results[0].pose.nose;
    }
  })
  modelTraining();
}

function draw() {
  image(video, 0, 0);

  if(trained) {
    classifier.classify(video, function(error, data){
      console.log(data[0].label);
      potato = data[0].label;
    })
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