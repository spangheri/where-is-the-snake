// Lista das imagens disponíveis
const images = [
    "snake1_0944.JPG",
    "snake2_0997.JPG",
    "snake3_1021.JPG",
    "snake4_1048.JPG",
    "snake5_1165.JPG"
];

let currentIndex = 0;
let startTime; // Variável para armazenar o tempo inicial
let responseTime; // Variável para armazenar o tempo de resposta

// Coordenadas dos ROIs para cada imagem
const rois = [
    { x: 1452, y: 1248, width: 324, height: 284 }, // ROI para snake1_0944.JPG
    { x: 3672, y: 810, width: 1806, height: 1200 }, // ROI para snake2_0997.JPG
    { x: 2828, y: 2120, width: 952, height: 920 },  // ROI para snake3_1021.JPG
    { x: 2328, y: 1506, width: 1242, height: 1320 }, // ROI para snake4_1048.JPG
    { x: 1312, y: 1148, width: 512, height: 540 }   // ROI para snake5_1165.JPG
];

// Seleciona a imagem do jogo
const gameImage = document.getElementById("game-image");

// Seleciona o elemento do temporizador
const timerElement = document.getElementById("timer");

// Variáveis para armazenar o temporizador e o intervalo
let timeoutId;
let intervalId;

// Função que muda para a próxima imagem
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    gameImage.src = images[currentIndex];
    startTimer(); // Reinicia o temporizador para a nova imagem
}

// Função que inicia o temporizador
function startTimer() {
    let timeLeft = 10; // Tempo inicial: 10 segundos
    timerElement.textContent = `TEMPO RESTANTE: ${timeLeft} SEGUNDOS`;

    // Limpa o temporizador e o intervalo anteriores (se houver)
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    // Inicia o tempo de resposta
    startTime = Date.now();

    // Temporizador principal (muda a imagem após 10 segundos)
    timeoutId = setTimeout(() => {
        responseTime = 10; // Tempo esgotado = 10 segundos
        sendDataToBackend(responseTime); // Envia os dados para o backend
        alert("Tempo esgotado! Mudando para a próxima imagem.");
        nextImage();
    }, 10000); // 10000 milissegundos = 10 segundos

    // Atualiza o contador visual a cada segundo
    intervalId = setInterval(() => {
        timeLeft--; // Diminui o tempo restante
        timerElement.textContent = `TEMPO RESTANTE: ${timeLeft} SEGUNDOS`;

        // Se o tempo acabar, limpa o intervalo
        if (timeLeft <= 0) {
            clearInterval(intervalId);
        }
    }, 1000); // Atualiza a cada 1000 milissegundos (1 segundo)
}

// Função que verifica se o clique está dentro do ROI
function isClickInROI(clickX, clickY, roi) {
    return clickX >= roi.x && clickX <= roi.x + roi.width &&
           clickY >= roi.y && clickY <= roi.y + roi.height;
}

// Função que envia os dados para o backend
function sendDataToBackend(responseTime) {
    const data = {
        ip: "", // O IP será obtido no backend
        image: images[currentIndex], // Nome da imagem atual
        responseTime: responseTime // Tempo de resposta
    };

    // Envia os dados para o backend
    fetch(fetch("https://where-is-the-snake.onrender.com/log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log("Dados enviados com sucesso:", result);
    })
    .catch(error => {
        console.error("Erro ao enviar dados:", error);
    });
}

// Função que muda a imagem ao clicar
gameImage.addEventListener("click", function(event) {
    const rect = gameImage.getBoundingClientRect();
    const scaleX = gameImage.naturalWidth / rect.width;
    const scaleY = gameImage.naturalHeight / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    if (isClickInROI(clickX, clickY, rois[currentIndex])) {
        responseTime = (Date.now() - startTime) / 1000; // Calcula o tempo de resposta em segundos
        alert(`Você encontrou a cobra em ${responseTime.toFixed(2)} segundos!`);
        clearTimeout(timeoutId); // Cancela o temporizador
        clearInterval(intervalId); // Cancela a atualização do contador
        sendDataToBackend(responseTime); // Envia os dados para o backend
        nextImage(); // Muda para a próxima imagem
    } else {
        alert("Tente novamente!"); // Apenas exibe uma mensagem de erro
        // A imagem NÃO muda, e o jogador pode tentar novamente até o tempo acabar
    }
});

// Inicializa a primeira imagem e o temporizador
gameImage.src = images[currentIndex];
startTimer();