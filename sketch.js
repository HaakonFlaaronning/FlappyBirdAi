const POPSIZE = 300;
var highscore = 0;
var birds = [];
var savedBirds = [];
var pipes = [];
var generation = 0;
let counter = 0;
let cycles = 100;
let slider;

//--------------------------------------------------------------------------------
function keyPressed() {
  if(key === 's') {
    let b = birds[0];
    saveJSON(bird.brain, 'bird.json');
  }
}

function setup() {
  createCanvas(600,400);
  slider = createSlider(1, 100, 1);
  for(let i = 0; i < POPSIZE; i++) {
    birds[i] = new Bird();
  }
}
//--------------------------------------------------------------------------------

function draw() {

  for(let n = 0; n < slider.value(); n++) {
    if(counter % 250 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (bird of birds) {
      if(bird.hitWall()) {
        var index = birds.indexOf(bird);
        savedBirds.push(birds.splice(index, 1)[0]);
      }
    }

    for(var i=pipes.length-1; i >= 0; i--) {
      for (bird of birds) {
        if(bird.hitPipe(pipes[i])) {
          var index = birds.indexOf(bird);
          savedBirds.push(birds.splice(index, 1)[0]);
        }
      }
      pipes[i].update();
      if(pipes[i].offscreen()) {
        pipes.splice(i,1);
      }
    }
    //--------------------------------------------------------------------------------

    for (bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if(birds.length == 0) {
      counter = 0;
      nextGeneration();
      tempMax = getGenMax();

      if(tempMax > highscore) {
        highscore = tempMax;
      }


      generation++;
      console.log(generation, tempMax, highscore);
      pipes = [];
    }
  }

  //All drawing stuff - not logic
  background(0);
  for(let bird of birds) {
    bird.show();
  }

  for(let pipe of pipes) {
    pipe.show();
  }

}

//--------------------------------------------------------------------------------

/*
function keyPressed() {
if(key == ' ') {
bird.up();
}
}*/
