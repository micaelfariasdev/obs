document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view'); // Vai ser 'placar', 'lower', ou null

    if (view === 'placar') {
        document.body.classList.add('placar-only');
    } else if (view === 'lower') {
        document.body.classList.add('lower-only');
    }
    // Se 'view' for null (URL normal), ele não adiciona classe e mostra tudo.
});

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

// Funções de envio de dados
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

        half: document.getElementById("half").value,
        timer: document.getElementById("timer").value,
        extra_time: document.getElementById("extra_time").value || null,
    };

    // --- SALVANDO NO LOCALSTORAGE ---
    // Salva os dados do placar no localStorage
    localStorage.setItem('scoreboardData', JSON.stringify(data));
    // --- FIM DA ADIÇÃO ---

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

// --- FUNÇÃO ONLOAD ATUALIZADA ---
window.onload = function () {
    
    // --- CARREGANDO DO LOCALSTORAGE ---
    // Carrega os dados salvos do placar
    const savedData = localStorage.getItem('scoreboardData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Popula os campos do Time A
        document.getElementById("teamA_name").value = data.teamA_name || '';
        document.getElementById("teamA_short").value = data.teamA_short || '';
        document.getElementById("teamA_logo").value = data.teamA_logo || '';
        document.getElementById("teamA_score").value = data.teamA_score || 0;
        document.getElementById("teamA_color").value = data.teamA_color || '#000000';

        // Popula os campos do Time B
        document.getElementById("teamB_name").value = data.teamB_name || '';
        document.getElementById("teamB_short").value = data.teamB_short || '';
        document.getElementById("teamB_logo").value = data.teamB_logo || '';
        document.getElementById("teamB_score").value = data.teamB_score || 0;
        document.getElementById("teamB_color").value = data.teamB_color || '#000000';

        // Popula outros campos
        document.getElementById("half").value = data.half || '1T';
        document.getElementById("extra_time").value = data.extra_time || '';
    }
    // --- FIM DA ADIÇÃO ---

    // Código original do timer (importante manter)
    const initialTimeStr = document.getElementById("initial_time").value;
    document.getElementById("timer").value = initialTimeStr;
    document.getElementById("realtime_display").textContent =
        initialTimeStr;
    
    // Envia os dados (carregados ou padrão) para o overlay
    sendUpdate();
};


// --- 1. Seleção de Elementos ---
const input = document.getElementById('text-lower');
const select = document.getElementById('type-lower');
const saveBtn = document.getElementById('save-btn');
const items = document.getElementById('items');
const enviarTodosBtn = document.getElementById('enviar-todos-btn');
const novoBtn = document.getElementById('novo-btn');
const addForm = document.getElementById('add-form');

// --- 2. Estado da Aplicação ---
let lowers = JSON.parse(localStorage.getItem('lowers')) || [];

// --- 3. Funções ---

/** Salva o array 'lowers' no localStorage */
function saveToStorage() {
    localStorage.setItem('lowers', JSON.stringify(lowers));
}

/** Renderiza a lista de itens na tela */
function render() {
    if (!items) return; // Checagem de segurança caso 'items' não exista
    items.innerHTML = ''; // Limpa a lista atual

    // Mapeia os tipos para nomes mais amigáveis (CORRIGIDO)
    const typeMap = {
        cardRed: 'Cartão Vermelho',
        cardYellow: 'Cartão Amarelo',
        secondyellow: 'Segundo Amarelo'
    }
    lowers.forEach((l, i) => {
        const div = document.createElement('div');
        div.className = 'lower-row'; // Usa a classe CSS
        
        div.innerHTML = `
            <span>${l.texto}</span>
            <span>${typeMap[l.tipo] || l.tipo}</span>
            <button class="btn btn-primary" onclick="sendLower(${i})">Enviar</button>
            <button class="btn btn-danger" onclick="removeLower(${i})">Excluir</button>
        `;
        
        items.appendChild(div);
    });
}

/** Salva um novo item */
function salvar() {
    if (!input || !select || !addForm) return; // Checagem de segurança
    const texto = input.value.trim();
    if (!texto) return; // Não salva se o texto estiver vazio

    lowers.push({ texto: texto, tipo: select.value });
    
    input.value = ''; // Limpa o input
    addForm.style.display = 'none'; // Esconde o formulário após salvar
    
    saveToStorage(); // Salva no storage
    render(); // Atualiza a tela
}

/** Remove um item pelo seu índice (i) */
function removeLower(i) {
    lowers.splice(i, 1); // Remove o item do array
    saveToStorage(); // Salva no storage
    render(); // Atualiza a tela
}

/** Envia um item específico via socket */
function sendLower(i) {
    const data = lowers[i];
    socket.emit('lower-third', data); 
}

/** Envia todos os itens via socket */
function sendAllLowers() {
    lowers.forEach(data => socket.emit('lower-third', data));
}

/** Mostra ou esconde o formulário de adição */
function toggleAddForm() {
    if (!addForm) return; // Checagem de segurança
    const isVisible = addForm.style.display === 'block';
    addForm.style.display = isVisible ? 'none' : 'block';
}

// Event listener para o render dos lowers
window.addEventListener('load', render);