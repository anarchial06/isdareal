// Color Memory Game
let colorSequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let isPlaying = false;

const colors = ['red', 'blue', 'green', 'yellow'];
const colorButtons = document.querySelectorAll('.color-btn');
const colorScoreElement = document.getElementById('colorScore');

// Sound frequencies for different drums
const soundFrequencies = {
    kick: 60,
    snare: 200,
    hihat: 800,
    cymbal: 1200
};

// Fun facts array
const funFacts = [
    "Octopuses have three hearts and blue blood! 🐙",
    "A group of flamingos is called a 'flamboyance'! 🦩",
    "Bananas are berries, but strawberries aren't! 🍌🍓",
    "Honey never spoils - archaeologists have found 3000-year-old honey that's still edible! 🍯",
    "A day on Venus is longer than its year! 🪐",
    "Butterflies taste with their feet! 🦋",
    "A cloud can weigh more than a million pounds! ☁️",
    "There are more stars in the universe than grains of sand on Earth! ⭐",
    "A single strand of spaghetti is called a 'spaghetto'! 🍝",
    "Dolphins have names for each other! 🐬",
    "The Great Wall of China isn't visible from space without aid! 🏯",
    "A shrimp's heart is in its head! 🦐",
    "There are more possible games of chess than atoms in the observable universe! ♟️",
    "A group of porcupines is called a 'prickle'! 🦔",
    "The human eye can distinguish about 10 million different colors! 👁️"
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeColorGame();
    initializeSoundMachine();
    initializeParticleCanvas();
});

function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Color Memory Game Functions
function initializeColorGame() {
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (isPlaying) {
                const color = this.dataset.color;
                playerSequence.push(color);
                animateColorButton(this);
                checkPlayerSequence();
            }
        });
    });
}

function startColorGame() {
    colorSequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    isPlaying = true;
    updateScore();
    nextRound();
}

function nextRound() {
    playerSequence = [];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    colorSequence.push(randomColor);
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i < colorSequence.length) {
            const button = document.querySelector(`[data-color="${colorSequence[i]}"]`);
            animateColorButton(button);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 600);
}

function animateColorButton(button) {
    button.classList.add('active');
    playSound(soundFrequencies.kick);
    setTimeout(() => {
        button.classList.remove('active');
    }, 300);
}

function checkPlayerSequence() {
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] !== colorSequence[currentIndex]) {
        gameOver();
        return;
    }
    
    if (playerSequence.length === colorSequence.length) {
        score += level * 10;
        updateScore();
        level++;
        setTimeout(() => {
            nextRound();
        }, 1000);
    }
}

function gameOver() {
    isPlaying = false;
    alert(`Game Over! Your score: ${score}`);
}

function updateScore() {
    colorScoreElement.textContent = score;
}

// Sound Machine Functions
function initializeSoundMachine() {
    const soundButtons = document.querySelectorAll('.sound-btn');
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sound = this.dataset.sound;
            playSound(soundFrequencies[sound]);
            animateSoundButton(this);
        });
    });
}

function playSound(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function animateSoundButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1.05)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }, 100);
}

// Particle Canvas Functions
function initializeParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createParticles(x, y);
    });
    
    function createParticles(x, y) {
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0
            });
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.size *= 0.98;
            
            if (p.life <= 0 || p.size < 0.5) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Fun Facts Generator
function generateFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const factElement = document.getElementById('funFact');
    
    // Fade out
    factElement.style.opacity = '0';
    
    setTimeout(() => {
        factElement.textContent = funFacts[randomIndex];
        // Fade in
        factElement.style.opacity = '1';
    }, 300);
}

// Add smooth transitions for fun facts
document.getElementById('funFact').style.transition = 'opacity 0.3s ease';
