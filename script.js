document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const wish = document.getElementById('wish').value;
    const generatedLink = `${window.location.href}?name=${name}&age=${age}&wish=${wish}`;
    document.getElementById('generatedLink').value = generatedLink;
    document.getElementById('linkContainer').style.display = 'block';
});

function copyLink() {
    const copyText = document.getElementById('generatedLink');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Link copied to clipboard');
}

function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        name: urlParams.get('name'),
        age: urlParams.get('age'),
        wish: urlParams.get('wish')
    };
}

function displayCelebration() {
    const params = getQueryParams();
    if (params.name && params.age && params.wish) {
        document.getElementById('formContainer').style.display = 'none';
        document.getElementById('celebration').style.display = 'block';
        document.getElementById('displayName').textContent = `Happy Birthday, ${params.name}!`;
        document.getElementById('displayAge').textContent = `You are now ${params.age} years old!`;
        document.getElementById('displayWish').textContent = `${params.wish}`;
        gsap.fromTo('.flame', { scale: 1 }, { scale: 1.2, yoyo: true, repeat: -1, duration: 0.5 });
    }
}

function blowOutCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => {
        gsap.to(flame, { opacity: 0, duration: 1, onComplete: () => flame.style.display = 'none' });
    });
    setTimeout(() => {
        document.querySelectorAll('.candle').forEach(candle => {
            candle.innerHTML = '';
        });
        showWishAndSparkles();
    }, 1000);
}

function showWishAndSparkles() {
    document.getElementById('displayWish').style.display = 'block';
    document.getElementById('sparkles').style.display = 'block';
    createSparkles();
}

function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    for (let i = 0; i < 100; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparklesContainer.appendChild(sparkle);

        gsap.fromTo(sparkle, {
            opacity: 1,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        }, {
            opacity: 0,
            duration: 2,
            delay: Math.random() * 2,
            onComplete: () => sparklesContainer.removeChild(sparkle)
        });
    }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    if (transcript.toLowerCase().includes('blow out the candles') || e.results[0].isFinal) {
        blowOutCandles();
    }
});

recognition.start();
displayCelebration();
