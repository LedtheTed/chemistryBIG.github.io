// ElementBase class
export class ElementBase {
  constructor(options = {}) {
    this.name = options.name || 'H';
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.color = options.color || '#000';
    this.size = options.size || 10;
    this.speed = options.speed || 1;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
  }

  update(canvas) {
    // update position
    this.x += this.vx;
    this.y += this.vy;

    // bounce off walls
    if(this.x - this.size < 0 || this.x + this.size > canvas.width){
      this.vx *= -1;
      this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
    }
    if(this.y - this.size < 0 || this.y + this.size > canvas.height){
      this.vy *= -1;
      this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // draw label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, this.x, this.y);
  }
}