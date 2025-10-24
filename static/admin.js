var socket = io.connect();


let timerInterval = null;
let timeInSeconds = 0;
let isRunning = false;

function timeToSeconds(timeStr) {
    const parts = timeStr.split(":");
    const minutes = parseInt(parts[0] || 0);
    const seconds = parseInt(parts[1] || 0);
    return minutes * 60 + seconds;
}

function secondsToTime(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
    )}`;
}

function startStopTimer() {
    const toggleButton = document.getElementById("timer_toggle");

    if (isRunning) {
        clearInterval(timerInterval);
        toggleButton.textContent = "Iniciar Timer";
        toggleButton.style.background = "#007bff";
        isRunning = false;
    } else {
        // Lógica para carregar o tempo inicial (só na primeira vez ou após reset)
        if (timeInSeconds === 0) {
            const initialTimeStr =
                document.getElementById("initial_time").value;
            timeInSeconds = timeToSeconds(initialTimeStr);
        }

        toggleButton.textContent = "Pausar Timer";
        toggleButton.style.background = "#dc3545";
        isRunning = true;

        timerInterval = setInterval(() => {
            timeInSeconds++;
            const currentTimeStr = secondsToTime(timeInSeconds);

            // Atualiza o input OCULTO (para envio)
            document.getElementById("timer").value = currentTimeStr;
            // Atualiza o DISPLAY DIGITAL
            document.getElementById("realtime_display").textContent =
                currentTimeStr;

            sendTime();
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeInSeconds = 0;

    // O display e o input oculto voltam ao valor do input inicial
    const initialTimeStr = document.getElementById("initial_time").value;
    document.getElementById("timer").value = initialTimeStr;
    document.getElementById("realtime_display").textContent =
        initialTimeStr;

    document.getElementById("timer_toggle").textContent = "Iniciar Timer";
    document.getElementById("timer_toggle").style.background = "#007bff";

    sendTime();
}

function changeScore(id, amount) {
    const input = document.getElementById(id);
    let currentScore = parseInt(input.value);
    currentScore += amount;
    if (currentScore < 0) currentScore = 0;
    input.value = currentScore;
    sendUpdate(); // Envia a atualização do placar ao alterar o score
}

function activateScore() {
    const switchElement = document.getElementById("meuSwitch");
    const data = {
        enable: switchElement.checked,
        extra_time: document.getElementById("extra_time").value || null,
    }
    socket.emit("score_enable", data);
}

// Funções de envio de dados (inalteradas)
function sendUpdate() {
    var data = {
        teamA_name: document.getElementById("teamA_name").value,
        teamA_short: document
            .getElementById("teamA_short")
            .value.toUpperCase(),
        teamA_logo: document.getElementById("teamA_logo").value,
        teamA_score: document.getElementById("teamA_score").value,
        teamA_color: document.getElementById("teamA_color").value,

        teamB_name: document.getElementById("teamB_name").value,
        teamB_short: document
            .getElementById("teamB_short")
            .value.toUpperCase(),
        teamB_logo: document.getElementById("teamB_logo").value,
        teamB_score: document.getElementById("teamB_score").value,
        teamB_color: document.getElementById("teamB_color").value,

        timer: document.getElementById("timer").value,
        extra_time: document.getElementById("extra_time").value || null,
    };
    socket.emit("update_scoreboard", data);
}

function sendTime() {
    var data = {
        timer: document.getElementById("timer").value,
        extra_time: document.getElementById("extra_time").value,
    };
    socket.emit("update_time", data);
}

function extendMode() {
    var data = {
        extend: true,
        teamA_name: document.getElementById("teamA_name").value,
        teamB_name: document.getElementById("teamB_name").value,
        teamA_short: document
            .getElementById("teamA_short")
            .value.toUpperCase(),
        teamB_short: document
            .getElementById("teamB_short")
            .value.toUpperCase(),
    };
    socket.emit("extend_mode", data);
}
function toggleIframe() {
    const iframe = document.getElementById('placar-iframe');
    const button = document.getElementById('toggle-iframe-btn');

    // O método 'toggle' adiciona a classe se ela não existir, e remove se existir.
    iframe.classList.toggle('collapsed');

    // Atualiza o texto do botão
    if (iframe.classList.contains('collapsed')) {
        button.textContent = "Mostrar Overlay";
        button.style.backgroundColor = '#28a745'; // Cor verde quando escondido
    } else {
        button.textContent = "Esconder Overlay";
        button.style.backgroundColor = '#dc3545'; // Cor vermelha quando visível
    }
}
window.onload = function () {
    const initialTimeStr = document.getElementById("initial_time").value;
    document.getElementById("timer").value = initialTimeStr;
    document.getElementById("realtime_display").textContent =
        initialTimeStr;
    sendUpdate();
};

