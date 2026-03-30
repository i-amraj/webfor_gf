{
    function enterSite() {
        const music = document.getElementById('bgMusic');
        if (music) {
            music.play().then(() => {
                console.log("Music playing...");
            }).catch(e => {
                console.warn("Music play blocked by browser or missing file:", e);
            });
        }
        
        // Add fade out effect
        const container = document.querySelector('.landing-container');
        if (container) {
            container.classList.add('page-transition');
        }
        
        setTimeout(() => {
            window.location.href = "letter.html";
        }, 800);
    }

    // Heart Particle System for Landing Page
    const canvas = document.getElementById('heartCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const hearts = [];

        class Heart {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.size = Math.random() * 15 + 5;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 1 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                if (this.y < -this.size) {
                    this.y = canvas.height + this.size;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(255, 117, 140, ${this.opacity})`;
                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(this.x, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size);
                ctx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < 50; i++) {
                hearts.push(new Heart());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hearts.forEach(heart => {
                heart.update();
                heart.draw();
            });
            requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Export function to window
    window.enterSite = enterSite;
}
