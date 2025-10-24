// --- Cache dos elementos do Cartão (ATUALIZADO) ---
const cardLT = document.getElementById('card-lt');
const cardLogo = document.getElementById('card-team-logo');
const cardName = document.getElementById('card-player-name');
const cardTitleText = document.getElementById('card-title-text');

// Os 3 novos elementos
const cardGraphic1 = document.getElementById('card-graphic-1');
const cardGraphic2 = document.getElementById('card-graphic-2');
const cardGraphicRed = document.getElementById('card-graphic-red');


/**
 * Toca a animação do lower third de cartão.
 * @param {string} nome - Nome do jogador.
 * @param {string} logo - URL do logo do time.
 * @param {string} cor - Cor principal do time (para o fundo).
 * @param {string} tipo - 'yellow', 'red' ou 'second-yellow'.
 */
function playCardAnimation(nome, logo, cor, tipo) {
    console.log(`Cartão ${tipo} para ${nome}`);

    // --- 1. Atualizar Conteúdo Fixo ---
    cardLogo.src = logo;
    cardName.textContent = nome;
    cardLT.style.backgroundColor = cor;

    // --- 2. Limpar Animações e Cartões (CORRIGIDO) ---
    cardLT.classList.remove('animate-single-card', 'animate-second-yellow');
    
    // Esconde todos os cartões (reset)
    cardGraphic1.style.animation = 'none';
    cardGraphic2.style.animation = 'none';
    cardGraphicRed.style.animation = 'none';

    // Remove classes de cor (CORRIGIDO)
    cardGraphic1.classList.remove('yellow');
    cardGraphic2.classList.remove('yellow'); // <-- Faltava esta linha


    // --- 3. Configurar e Tocar a Animação Correta ---
    
    // Força o "reflow"
    void cardLT.offsetWidth; 

    if (tipo === 'yellow') {
        cardTitleText.textContent = 'CARTÃO AMARELO';
        cardGraphic1.classList.add('yellow'); 
        cardGraphic1.style.animation = ''; 
        cardLT.classList.add('animate-single-card'); 

    } else if (tipo === 'red') {
        cardTitleText.textContent = 'CARTÃO VERMELHO';
        cardGraphicRed.style.animation = ''; 
        cardLT.classList.add('animate-single-card'); 

    } else if (tipo === 'second-yellow') {
        cardTitleText.textContent = 'CARTÃO VERMELHO';
        
        cardGraphic1.classList.add('yellow');
        cardGraphic2.classList.add('yellow');

        cardGraphic1.style.animation = '';
        cardGraphic2.style.animation = '';
        cardGraphicRed.style.animation = '';

        cardLT.classList.add('animate-second-yellow');
    }

    // --- 4. Limpeza Pós-Animação ---
    cardLT.addEventListener('animationend', () => {
        cardLT.classList.remove('animate-single-card', 'animate-second-yellow');
    }, { once: true });
}

// --- Listener do Socket (COMPLETO) ---
socket.on('lower-third', (data) => {
    // data = { texto: "Neymar Jr. 22'", tipo: "cardYellow" }
    
    // ATENÇÃO: Logo e cor ainda estão "chumbados" (hard-coded).
    // O ideal seria o admin.js enviar o ID do time.
    const logoDoTime = 'https://upload.wikimedia.org/wikipedia/pt/5/53/Arsenal_FC.svg';
    const corDoTime = 'rgb(52, 127, 212)';
    const corElementParaGol = { style: { background: corDoTime } }; // Simula o elemento de cor para a função de gol

    if (data.tipo === 'cardYellow') {
        playCardAnimation(data.texto, logoDoTime, corDoTime, 'yellow');
    } 
    else if (data.tipo === 'cardRed') {
        playCardAnimation(data.texto, logoDoTime, corDoTime, 'red');
    }
    // --- LÓGICA FALTANTE ADICIONADA ---
    else if (data.tipo === 'secondyellow') { 
        playCardAnimation(data.texto, logoDoTime, corDoTime, 'second-yellow');
    }
    else if (data.tipo === 'goal') {
        // Assume que você tem a função playGoalAnimation() neste arquivo também
        if (typeof playGoalAnimation === 'function') {
            playGoalAnimation(data.texto, logoDoTime, corElementParaGol);
        } else {
            console.error('Função playGoalAnimation não encontrada!');
        }
    }
});