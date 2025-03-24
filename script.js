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
    { x: 726, y: 624, width: 324, height: 284 },  // ROI para snake1_0944.JPG
    { x: 1836, y: 405, width: 1000, height: 666 }, // ROI para snake2_0997.JPG (limitando width a 1000)
    { x: 1414, y: 1060, width: 952, height: 920 }, // ROI para snake3_1021.JPG
    { x: 201, y: 942, width: 810, height: 936 },  // ROI para snake4_1048.JPG 
    { x: 656, y: 574, width: 512, height: 540 }   // ROI para snake5_1165.JPG
];

// ⚡ Verifica se o jogador já jogou e não é admin
const JOGADOR_AUTORIZADO = localStorage.getItem("admin") === "true";

if (!JOGADOR_AUTORIZADO && localStorage.getItem("jogou")) {
    mostrarTelaFinal();
} else if (!JOGADOR_AUTORIZADO) {
    localStorage.setItem("jogou", "true");
}

// 🚀 Função para pedir senha e autorizar admin
function pedirSenha() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha === "senha_12") {  // Substitua pela sua senha real
        localStorage.setItem("admin", "true");
        alert("Acesso concedido! Você pode jogar quantas vezes quiser.");
        verificarAdmin();
        location.reload(); // Recarrega a página
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
verificarAdmin();

// ⏳ Função que inicia o temporizador corretamente
function startTimer() {
    let timeLeft = 10;
    const timerElement = document.getElementById("timer");

    if (!timerElement) {
        console.error("Elemento #timer não encontrado!");
        return;
    }

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
        setTimeout(mostrarTelaFinal, 500);
        return;
    }

    currentIndex++;
    document.getElementById("game-image").src = images[currentIndex];
    startTimer();
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

// 🎯 Função que verifica se o clique está dentro do ROI
function isClickInROI(clickX, clickY, roi) {
    return clickX >= roi.x && clickX <= roi.x + roi.width &&
           clickY >= roi.y && clickY <= roi.y + roi.height;
}

// 🖱️ Função que trata o clique do jogador
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
        sendDataToBackend(responseTime);
        nextImage();
    } else {
        alert("Tente novamente!");
    }
});

// 📌 Função para exibir apenas "Obrigado por jogar!" e manter os botões de admin
function mostrarTelaFinal() {
    document.body.innerHTML = `
        <h1>Obrigado por jogar!</h1>
        <div id="admin-controls" style="position: absolute; top: 10px; right: 10px;">
            <button id="admin-login" onclick="pedirSenha()">Entrar como Admin</button>
            <button id="admin-logout" onclick="sairAdmin()" style="display: none;">Sair</button>
        </div>
    `;
    verificarAdmin();
}

// ✅ Inicializa o jogo corretamente
document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("game-image")) {
        console.error("Elemento #game-image não encontrado!");
        return;
    }
    
    document.getElementById("game-image").src = images[currentIndex];
    startTimer();
});
