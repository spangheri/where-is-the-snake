// Lista das imagens disponíveis
const images = [
    "snake1_0944.JPG",
    "snake2_0997.JPG",
    "snake3_1021.JPG",
    "snake4_1048.JPG",
    "snake5_1165.JPG"
];

let currentIndex = 0;
let startTime;
let responseTime;
let timeoutId;
let intervalId;

// Coordenadas dos ROIs para cada imagem
const rois = [
    { x: 1452, y: 1248, width: 324, height: 284 },  
    { x: 3672, y: 810, width: 1806, height: 1200 }, 
    { x: 2828, y: 2120, width: 952, height: 920 },  
    { x: 402, y: 1884, width: 810, height: 936 },  
    { x: 1312, y: 1148, width: 512, height: 540 }  
];

// Função para iniciar o timer
function startTimer() {
    clearInterval(intervalId);
    startTime = Date.now();
    
    intervalId = setInterval(() => {
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
        document.getElementById("timer").innerText = `Tempo: ${elapsedTime} s`;
    }, 100);
}

// Função que verifica se o clique está dentro do ROI
function isClickInROI(clickX, clickY, roi) {
    return clickX >= roi.x && clickX <= roi.x + roi.width &&
           clickY >= roi.y && clickY <= roi.y + roi.height;
}

// Função que trata o clique do jogador
document.getElementById("game-image").addEventListener("click", function(event) {
    const rect = this.getBoundingClientRect();
    const scaleX = this.naturalWidth / rect.width;
    const scaleY = this.naturalHeight / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    if (isClickInROI(clickX, clickY, rois[currentIndex])) {
        responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
        alert(`Você encontrou a cobra em ${responseTime} segundos!`);
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        nextImage();
    } else {
        alert("Tente novamente!");
    }
});

// Função que muda para a próxima imagem ou encerra o jogo
function nextImage() {
    if (currentIndex >= images.length - 1) {
        setTimeout(mostrarTelaFinal, 500);
        return;
    }

    currentIndex++;
    document.getElementById("game-image").src = images[currentIndex];
    startTimer();
}

// Inicializa o jogo corretamente
document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    if (!document.getElementById("game-image")) {
        console.error("Elemento #game-image não encontrado!");
        return;
    }

    document.getElementById("game-image").src = images[currentIndex];
    startTimer();
});
