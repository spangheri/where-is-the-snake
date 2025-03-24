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
    { x: 726, y: 624, width: 324, height: 284 },
    { x: 1836, y: 405, width: 1000, height: 666 },
    { x: 1414, y: 1060, width: 952, height: 920 },
    { x: 201, y: 942, width: 810, height: 936 },
    { x: 656, y: 574, width: 512, height: 540 }
];

// Função para desenhar o ROI na imagem
function drawROI() {
    const imageElement = document.getElementById("game-image");
    const canvas = document.getElementById("roi-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o desenho anterior

    const scaleX = imageElement.width / imageElement.naturalWidth;
    const scaleY = imageElement.height / imageElement.naturalHeight;

    const roi = rois[currentIndex];
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(roi.x * scaleX, roi.y * scaleY, roi.width * scaleX, roi.height * scaleY);
}

// Atualiza o canvas sempre que a imagem carrega
document.getElementById("game-image").addEventListener("load", drawROI);

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
    drawROI();
}

// Inicializa o jogo corretamente
document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    // Criar o canvas para os ROIs
    const canvas = document.createElement("canvas");
    canvas.id = "roi-canvas";
    canvas.style.position = "absolute";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.pointerEvents = "none"; // Não interfere nos cliques
    gameContainer.appendChild(canvas);

    if (!document.getElementById("game-image")) {
        console.error("Elemento #game-image não encontrado!");
        return;
    }

    document.getElementById("game-image").src = images[currentIndex];
});
