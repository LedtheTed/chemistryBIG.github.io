import { Particle } from "./particle.js";

// This module owns the FX list
export const reactionFX = [];

// helpers
function hexToRgb(hex) {
    if (!hex) return null;
    let h = hex.toString().trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    if (h.length !== 6) return null;

    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function mixColors(c1, c2) {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    if (!a && !b) return "#ffffff";
    if (!a) return c2;
    if (!b) return c1;

    const r = Math.round((a.r + b.r) / 2);
    const g = Math.round((a.g + b.g) / 2);
    const bl = Math.round((a.b + b.b) / 2);
    return `rgb(${r}, ${g}, ${bl})`;
}

// Simple shockwave ring + optional sparkles
export class ReactionFX {
  constructor(x, y, opts = {}) {
    this.x = x;
    this.y = y;

    this.life = 1.0;
    this.decay = opts.decay ?? 0.06;

    this.ringAge = 0;
    this.ringDuration = opts.ringDuration ?? 2.5;
    this.startR = opts.startR ?? 8;
    this.endR = opts.endR ?? 180;

    this.r = this.startR;
    this.lineW = opts.lineW ?? 3;

    this.color = opts.color ?? "#ffffff";
    this.sparkRadius = opts.sparkRadius ?? 2.2;

    this.sparks = [];
    const sparkCount = opts.sparkCount ?? 10;
    const sparkSpeed = opts.sparkSpeed ?? 2.2;

    for (let i = 0; i < sparkCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = sparkSpeed * (0.5 + Math.random());
      this.sparks.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1.0,
        radius: this.sparkRadius * (0.7 + Math.random() * 0.9)
      });
    }

    this.label = opts.label ?? "";
    this.labelLife = this.label ? 1.0 : 0.0;
  }

  update(dt = 1 / 60) {
    // Ring progress 0 -> 1
    this.ringAge += dt;
    const t = Math.min(1, this.ringAge / this.ringDuration);

    // Ease-out so it starts fast then slows (looks nice)
    const ease = 1 - Math.pow(1 - t, 2); // easeOutQuad

    // Radius grows over time
    this.r = this.startR + (this.endR - this.startR) * ease;

    // Ring alpha fades slowly (still visible while expanding)
    this.ringLife = 1 - t;

    // Sparks + label can still use decay, but make them dt-based too:
    const d = (this.decay ?? 0.06) * (dt * 60);

    for (const sp of this.sparks) {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.98;
      sp.vy *= 0.98;
      sp.life -= d * 1.2;
    }
    this.sparks = this.sparks.filter(sp => sp.life > 0);

    if (this.labelLife > 0) this.labelLife -= d * 0.9;

    return (this.ringAge < this.ringDuration) || this.sparks.length > 0 || this.labelLife > 0;
  }

  draw(ctx) {
    const a = Math.max(0, this.ringLife);

    // ring
    ctx.save();
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.lineWidth = this.lineW * (0.6 + a);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();

    // sparks
    for (const sp of this.sparks) {
      const sa = Math.max(0, sp.life);
      ctx.save();
      ctx.globalAlpha = sa;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // label
    if (this.label && this.labelLife > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.labelLife);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(this.label, this.x + 10, this.y - 10);
      ctx.restore();
    }
  }
}

/**
 * Spawns a reaction FX at (x,y).
 */
export function triggerReactionEffect(x, y, reaction, e1, e2, particlesArray = null) {
    const label = reaction?.note
      ? reaction.note
      : `${e1?.name ?? ""} + ${e2?.name ?? ""} → ${(reaction?.products ?? []).join(" + ")}`;

    // Pull colors from the colliding elements (your ElementBase likely has `.color`)
    // Fallbacks included just in case.
    const c1 = e1?.color || e1?.def?.color || "#7dd3fc";
    const c2 = e2?.color || e2?.def?.color || "#a78bfa";
    const mixed = mixColors(c1, c2);

    reactionFX.push(new ReactionFX(x, y, {
      color: mixed,
      decay: 0.05,
      ringDuration: 3.0,
      startR: 10,
      endR: 220,  
      lineW: 4,
      sparkCount: 26,      // more
      sparkSpeed: 3.4,     // faster
      sparkRadius: 3.2,    // bigger
      label
    }));

    if (particlesArray) {
      for (let i = 0; i < 14; i++) {
        const p = new Particle(x, y);

        // Make them punchier
        p.vx *= 1.8;
        p.vy *= 1.8;
        p.size = (p.size ?? 3) * 1.6;

        // Override Particle color to match the reaction
        p.color = mixed;

        particlesArray.push(p);
      }
    }
}