export class Environment {
    constructor() {
        this.id;
        this.name;
        this.width;
        this.height;
        this.canvas;
        this.ctx;
        this.max_particles;
        this.particles;
        this.effects;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.ctx;
    }
}