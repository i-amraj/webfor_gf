    // --- Navigation & Music Persistence ---
    function navigateTo(url) {
        const music = document.getElementById('bgMusic');
        if (music) {
            localStorage.setItem('musicTime', music.currentTime);
            localStorage.setItem('musicPlaying', !music.paused);
        }
        window.location.href = url;
    }

    function startExperience() {
        const splash = document.getElementById('splash-overlay');
        const music = document.getElementById('bgMusic');
        
        if (music) {
            // Apply requested settings
            music.playbackRate = 0.9;
            music.volume = 0;
            if (music.currentTime < 3) music.currentTime = 3;
            
            music.play().then(() => {
                localStorage.setItem('musicPlaying', 'true');
                if (typeof gsap !== 'undefined') {
                    gsap.to(music, { volume: 0.4, duration: 2 });
                } else {
                    music.volume = 0.4;
                }
            }).catch(e => console.warn("Playback failed:", e));
        }

        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.visibility = 'hidden';
                if (typeof gsap !== 'undefined') {
                    gsap.to(".content", { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" });
                } else {
                    document.querySelector('.content').style.opacity = '1';
                }
            }, 1000);
        }
    }

    function enterSite() {
        // Redundant with splash but kept for safety/flow
        navigateTo("letter.html");
    }

    // Music Sync Across Pages (Non-Iframe version)
    function syncMusic() {
        const music = document.getElementById('bgMusic');
        if (!music) return;

        // Apply requested settings
        music.playbackRate = 0.9;
        
        // Load state
        const savedTime = localStorage.getItem('musicTime');
        const isPlaying = localStorage.getItem('musicPlaying') === 'true';

        if (savedTime) music.currentTime = parseFloat(savedTime);
        
        if (isPlaying) {
            music.volume = 0;
            music.play().then(() => {
                gsap.to(music, { volume: 0.4, duration: 2 });
            }).catch(e => console.warn("Auto-play blocked, waiting for interaction."));
        }

        // Save state frequently
        setInterval(() => {
            if (!music.paused) {
                localStorage.setItem('musicTime', music.currentTime);
            }
        }, 500);
    }

    // --- Three.js 3D Heart Environment ---
    const container = document.getElementById('three-container');
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Heart Shape
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const geometry = new THREE.ExtrudeGeometry(heartShape, {
            depth: 2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1,
        });

        const material = new THREE.MeshPhongMaterial({ 
            color: 0xff4d6d, 
            shininess: 100,
            specular: 0xffffff
        });
        
        const heartMesh = new THREE.Mesh(geometry, material);
        heartMesh.scale.set(0.1, 0.1, 0.1);
        heartMesh.rotation.z = Math.PI; // Flip heart correctly
        scene.add(heartMesh);

        // Lights
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 0, 10);
        scene.add(light);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        camera.position.z = 5;

        // Background Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);
        for(let i=0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0xff758c });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        function animate() {
            requestAnimationFrame(animate);
            heartMesh.rotation.y += 0.01;
            particlesMesh.rotation.y += 0.001;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // GSAP Animations
    function initAnimations() {
        if (typeof gsap !== 'undefined') {
            // Landing page reveal
            gsap.to(".content", {
                duration: 2,
                opacity: 1,
                y: 0,
                ease: "power3.out",
                delay: 0.5
            });

            // Page container reveal
            gsap.from(".page-container", {
                duration: 1.5,
                opacity: 0,
                backgroundColor: "#000",
                ease: "none"
            });

            // Card reveals
            gsap.from(".letter-card, .gallery-grid, .timeline, .surprise-card", {
                duration: 1.2,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: "back.out(1.7)",
                delay: 0.3
            });
        }
    }

    // Initialize everything
    window.addEventListener('DOMContentLoaded', () => {
        syncMusic();
        initAnimations();
    });

    // Export functions
    window.startExperience = startExperience;
    window.enterSite = enterSite;
    window.navigateTo = navigateTo;
    window.syncMusic = syncMusic;
