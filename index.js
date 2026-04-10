/* index.js - Interactivity & Animations */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 1b. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });
    }

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksList.classList.remove('active');
        });
    });

    // 2. Typing Effect
    const typingText = document.querySelector('.typing');
    const roles = [
        'Full Stack Developer',
        'AI/ML Developer',
        'Cybersecurity Enthusiast',
        'Freelancer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingText) type();

    // 3. Reveal on Scroll
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Advanced 'Circuit Board' Background Engine
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let packets = [];
    const particleCount = 180;
    const connectionDistance = 180;
    const mouse = { x: null, y: null, radius: 200 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
            this.type = Math.random() > 0.8 ? (Math.random() > 0.5 ? 'plus' : 'square') : 'dot';
        }

        init() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() * 0.4 - 0.2);
            this.speedY = (Math.random() * 0.4 - 0.2);
            this.color = Math.random() > 0.5 ? '#4f46e5' : '#9333ea';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;

            if (this.type === 'plus') {
                ctx.beginPath();
                ctx.moveTo(this.x - 4, this.y);
                ctx.lineTo(this.x + 4, this.y);
                ctx.moveTo(this.x, this.y - 4);
                ctx.lineTo(this.x, this.y + 4);
                ctx.stroke();
            } else if (this.type === 'square') {
                ctx.strokeRect(this.x - 3, this.y - 3, 6, 6);
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    class DataPacket {
        constructor(start, end) {
            this.start = start;
            this.end = end;
            this.progress = 0;
            this.speed = 0.02 + Math.random() * 0.02;
            this.color = '#2dd4bf'; // Neon Teal
        }

        update() {
            this.progress += this.speed;
        }

        draw() {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;
            
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        particles = [];
        packets = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    // Circuit-style connections (Orthogonal hint)
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 * (1 - distance/connectionDistance)})`;
                    
                    // Randomly spawn data packets
                    if (Math.random() > 0.998 && packets.length < 10) {
                        packets.push(new DataPacket(particles[i], particles[j]));
                    }

                    ctx.moveTo(particles[i].x, particles[i].y);
                    // Mid-point orthogonal step
                    ctx.lineTo(particles[i].x, particles[j].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            particles[i].update();
            particles[i].draw();
        }

        // Draw and update packets
        packets = packets.filter(p => p.progress < 1);
        packets.forEach(p => {
            p.update();
            p.draw();
        });

        // Mouse connection logic remains for depth
        if (mouse.x) {
            particles.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance/mouse.radius)})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            });
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();
});
