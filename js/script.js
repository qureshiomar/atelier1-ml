let video;
let poseNet;
let nose = [];
let img;

function preload() {
  img = loadImage('assets/happypotato.png');
}

function setup() {
  createCanvas(640, 480);
  preload();
  //turns on webcam
  video = createCapture(VIDEO);
  video.hide();

  //initialize poseNet
  poseNet = ml5.poseNet(video, modelLoaded);

  //look for new poses
  poseNet.on("pose", function(results) {
    if(results){
      for(var i = 0; i < results.length; i++){
        nose[i] = results[0].pose.nose;
      };
    };
  });
}

function draw() {
  //draws the video input onto the canvas
  image(video, 0, 0);
  
  //draws circles on everyones nose
  if(nose){
    // console.log(nose.length);
    for(var i = 0; i < nose.length; i++){
      // ellipse(nose[i].x, nose[i].y, 50);
      image(img, nose[i].x-150, nose[i].y-190, 370, 350);
    };
  };
}

function modelLoaded() {
  console.log("poseNet has loaded");

  poseNet.multiPose(video);
}