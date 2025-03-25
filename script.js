// Lista das imagens disponíveis
const images = [
    "snake1_0944.JPG",
    "snake2_0997.JPG",
    "snake3_1021.JPG",
    "snake4_1048.JPG",
    "snake5_1165.JPG"
];

let currentIndex = 0;
let timer;
let isAdmin = false;
let hasPlayed = localStorage.getItem("hasPlayed") === "true"; // Impede jogadores normais de jogar mais de uma vez

// Coordenadas dos ROIs para cada imagem
const rois = [
    { x: 1452, y: 1248, width: 324, height: 284 },  
    { x: 3672, y: 810, width: 1806, height: 1200 }, 
    { x: 2828, y: 2120, width: 952, height: 920 },  
    { x: 402, y: 1884, width: 810, height: 936 },  
    { x: 1312, y: 1148, width: 512, height: 540 }  
];

// Função para iniciar o timer de 10s
function startTimer() {
    clearInterval(timer);
    let timeLeft = 10;

    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = `Tempo: ${timeLeft}s`;
    }

    timer = setInterval(() => {
        timeLeft--;
        if (timerElement) {
            timerElement.innerText = `Tempo: ${timeLeft}s`;
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextImage();
        }
    }, 1000);
}

// Função que verifica se o clique está dentro do ROI
function isClickInROI(clickX, clickY, roi) {
    return clickX >= roi.x && clickX <= roi.x + roi.width &&
           clickY >= roi.y && clickY <= roi.y + roi.height;
}

// Função que trata o clique do jogador
document.addEventListener("DOMContentLoaded", function () {
    const gameImage = document.getElementById("game-image");

    if (!gameImage) {
        console.error("Elemento #game-image não encontrado!");
        return;
    }

    // Impede que jogadores normais joguem mais de uma vez
    if (hasPlayed && !isAdmin) {
        mostrarTelaFinal();
        return;
    }

    gameImage.addEventListener("click", function (event) {
        const rect = this.getBoundingClientRect();
        const scaleX = this.naturalWidth / rect.width;
        const scaleY = this.naturalHeight / rect.height;

        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        if (isClickInROI(clickX, clickY, rois[currentIndex])) {
            alert(`Você encontrou a cobra!`);
            clearInterval(timer);
            nextImage();
        } else {
            alert("Tente novamente!");
        }
    });

    // Inicializa o jogo corretamente
    gameImage.src = images[currentIndex];
    startTimer();
});

// Função que muda para a próxima imagem ou exibe a tela final
function nextImage() {
    if (currentIndex >= images.length - 1) {
        mostrarTelaFinal();
        return;
    }

    currentIndex++;
    const gameImage = document.getElementById("game-image");
    if (gameImage) {
        gameImage.src = images[currentIndex];
    }
    startTimer();
}

// Função para exibir a tela final
function mostrarTelaFinal() {
    document.getElementById("game-title").style.display = "none";
    document.getElementById("brightness-warning").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.getElementById("game-container").style.display = "none";

    // Exibe a mensagem final
    document.getElementById("final-message").style.display = "block";
}

