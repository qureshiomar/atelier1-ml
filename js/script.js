function setup(){
    let rnn = new mm.musicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn');
    rnn.initialize();
    let player = new mm.Player();
}

function draw() {

}