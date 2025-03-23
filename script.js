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

// Coordenadas dos ROIs para cada imagem
const rois = [
    { x: 1452, y: 1248, width: 324, height: 284 },
    { x: 3672, y: 810, width: 1806, height: 1200 },
    { x: 2828, y: 2120, width: 952, height: 920 },
    { x: 2328, y: 1506, width: 1242, height: 1320 },
    { x: 1312, y: 1148, width: 512, height: 540 }
];

// ⚡ Verifica se o jogador é admin ou já jogou
const JOGADOR_AUTORIZADO = localStorage.getItem("admin") === "true";

if (!JOGADOR_AUTORIZADO && localStorage.getItem("jogou")) {
    alert("Você já jogou! O jogo só pode ser jogado uma vez.");
    document.getElementById("game-container").innerHTML = "<h1>Obrigado por jogar!</h1>";
} else if (!JOGADOR_AUTORIZADO) {
    localStorage.setItem("jogou", "true"); // Marca que o jogador já jogou
}

// 🚀 Função para pedir senha e autorizar admin
function pedirSenha() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === "senha_12") { // Altere para sua senha real
        localStorage.setItem("admin", "true");
        alert("Acesso concedido! Você pode jogar quantas vezes quiser.");
        verificarAdmin();
        location.reload(); // Recarrega a página para permitir o jogo
    } else {
        alert("Senha incorreta!");
    }
}

// 🚪 Função para sair do modo admin
function sairAdmin() {
    localStorage.removeItem("admin");
    alert("Você saiu do modo administrador.");
    verificarAdmin();
    location.reload(); // Recarrega a página
}

// 🔍 Função para mostrar/esconder botões de admin
function verificarAdmin() {
    const botaoLogin = document.getElementById("admin-login");
    const botaoLogout = document.getElementById("admin-logout");

    if (localStorage.getItem("admin") === "true") {
        botaoLogin.style.display = "none";
        botaoLogout.style.display = "inline-block";
    } else {
        botaoLogin.style.display = "inline-block";
        botaoLogout.style.display = "none";
    }
}
verificarAdmin(); // Inicializa a verificação dos botões

// Seleciona a imagem do jogo
const gameImage = document.getElementById("game-image");

// Seleciona o elemento do temporizador
const timerElement = document.getElementById("timer");

// Variáveis para armazenar o temporizador e o intervalo
let timeoutId;
let intervalId;

// ⏳ Função que inicia o temporizador
function startTimer() {
    let timeLeft = 10;
    timerElement.textContent = `TEMPO RESTANTE: ${timeLeft} SEGUNDOS`;

    clearTimeout(timeoutId);
    clearInterval(intervalId);

    startTime = Date.now();

    timeoutId = setTimeout(() => {
        responseTime = 10;
        sendDataToBackend(responseTime);
        alert("Tempo esgotado! Mudando para a próxima imagem.");
        nextImage();
    }, 10000);

    intervalId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `TEMPO RESTANTE: ${timeLeft} SEGUNDOS`;

        if (timeLeft <= 0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

// 📸 Função que muda para a próxima imagem ou encerra o jogo
function nextImage() {
    if (currentIndex >= images.length - 1) {
        alert("Fim do jogo! Obrigado por jogar.");
        document.getElementById("game-container").innerHTML = "<h1>Obrigado por jogar!</h1>";
        return;
    }

    currentIndex++;
    gameImage.src = images[currentIndex];
    startTimer();
}

// 🧐 Função que verifica se o clique está dentro do ROI
function isClickInROI(clickX, clickY, roi) {
    return clickX >= roi.x && clickX <= roi.x + roi.width &&
           clickY >= roi.y && clickY <= roi.y + roi.height;
}

// 📡 Função que envia os dados para o backend
function sendDataToBackend(responseTime) {
    const data = {
        ip: "",
        image: images[currentIndex],
        responseTime: responseTime
    };

    fetch("https://where-is-the-snake.onrender.com/log", {
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

// 🖱️ Função que trata o clique do jogador
gameImage.addEventListener("click", function(event) {
    const rect = gameImage.getBoundingClientRect();
    const scaleX = gameImage.naturalWidth / rect.width;
    const scaleY = gameImage.naturalHeight / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    if (isClickInROI(clickX, clickY, rois[currentIndex])) {
        responseTime = (Date.now() - startTime) / 1000;
        alert(`Você encontrou a cobra em ${responseTime.toFixed(2)} segundos!`);
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        sendDataToBackend(responseTime);
        nextImage();
    } else {
        alert("Tente novamente!");
    }
});

// Inicializa a primeira imagem e o temporizador
gameImage.src = images[currentIndex];
startTimer();
