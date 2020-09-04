function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
  constructor(brain) {
    this.y = height/2;
    this.x = 64;
    this.radius = 16;
    this.bestBird = false;

    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  // Create a copy of this bird
  copy() {
    return new Bird(this.brain);
  }

  //Mutation
  mutateBrain() {
    this.brain.mutate(mutate);
  }



  //--------------------------------------------------------------------------------
  think(pipes) {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Create the inputs to the neural network
      let inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velocity, -5, 5, 0, 1);

      //inputs[5] = map(closest.x+closest.w, this.x, width, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  //--------------------------------------------------------------------------------
  show = function() {
    if(this.bestBird) {
      fill(0,255,0);
      ellipse(this.x,this.y,32 ,32);
    } else{
      fill(255);
      ellipse(this.x,this.y,32 ,32);
    }
  }

  //--------------------------------------------------------------------------------
  update = function() {

    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    this.score++;
  }

  //--------------------------------------------------------------------------------
  up = function() {
    this.velocity += this.lift;
  }

  //--------------------------------------------------------------------------------
  hitPipe = function(pipe) {
    let radius = 16;
    for(var alpha = 0; alpha < 2*Math.PI; alpha += Math.PI/12) {
      let tempX = radius*Math.cos(alpha);
      let tempY = radius*Math.sin(alpha);
      if(this.y+tempY < pipe.top || this.y+tempY > pipe.bottom) {
        if(this.x+tempX >= pipe.x && this.x+tempX <= pipe.x+pipe.w) {
          pipe.highlight = true;
          return true;
        }
      }
    }
    pipe.highlight = false;
    return false;
  }


  hitWall = function() {
    if(this.y-16 < 0 || this.y+16 > height) {
      return true;
    }
    return false;
  }




}

//--------------------------------------------------------------------------------
