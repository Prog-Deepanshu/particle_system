const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.drag = 0.98;
        this.isClicked = false;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();

        if (this.isClicked) {
            this.velocity.x += (mouse.x - this.x) * 0.1;
            this.velocity.y += (mouse.y - this.y) * 0.1;
        } else {
            this.velocity.x *= this.drag;
            this.velocity.y *= this.drag;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.velocity.x > 5) this.velocity.x = 5;
        if (this.velocity.x < -5) this.velocity.x = -5;
        if (this.velocity.y > 5) this.velocity.y = 5;
        if (this.velocity.y < -5) this.velocity.y = -5;

        if (this.x > canvas.width + this.radius ||
            this.x < -this.radius ||
            this.y > canvas.height + this.radius ||
            this.y < -this.radius) {
            this.x = this.baseX;
            this.y = this.baseY;
            this.velocity.x = (Math.random() - 0.5) * 2;
            this.velocity.y = (Math.random() - 0.5) * 2;
            this.alpha = 1;
        }

        this.alpha -= 0.005;
    }

    blast() {
        this.velocity.x = (Math.random() - 0.5) * 20;
        this.velocity.y = (Math.random() - 0.5) * 20;
    }
}

let particles = [];

let mouse = {
    x: undefined,
    y: undefined,
    clicked: false
};

canvas.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('mousedown', () => {
    mouse.clicked = true;
});

canvas.addEventListener('mouseup', () => {
    mouse.clicked = false;
    particles.forEach(particle => {
        particle.blast();
    });
});

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();

        if (mouse.clicked && !particle.isClicked) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < particle.radius) {
                particle.isClicked = true;
            }
        } else if (!mouse.clicked && particle.isClicked) {
            particle.isClicked = false;
        }
    });

    if (particles.length < 100) {
        for (let i = particles.length; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 5 + 1;
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            const velocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            };

            particles.push(new Particle(x, y, radius, color, velocity));
        }
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
});

animate();
