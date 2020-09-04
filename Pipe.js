function Pipe() {
  this.gap = 100;
  this.top = random(height-this.gap);
  this.bottom = this.top+this.gap
  this.highlight = false;
  this.x = width;
  this.w = 50;
  this.speed = 1;


  this.show = function() {
    fill(255);
    if(this.highlight) {
      fill(255,0,0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height-this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.offscreen = function() {
    return this.x < -this.w;
  }


}
