localStorage.debug = 'socket.io-client:socket';
var socket = io.connect();

let oldScoreA = 0;
let oldScoreB = 0;


function getElement(idOrClass, isQuerySelectorAll = false) {
    if (idOrClass.startsWith('#')) {
        return document.getElementById(idOrClass.substring(1));
    }
    if (isQuerySelectorAll) {
        return document.querySelectorAll(idOrClass);
    }
    return document.querySelector(idOrClass);
}

function triggerGoalAnimation(teamName) {
    const goalDiv = getElement('#goal-animation');
    if (!goalDiv) return;

    getElement('#goal-team-name').textContent = teamName;

    goalDiv.classList.remove("hidden");
    goalDiv.classList.add("animate-goal");

    setTimeout(() => {
        goalDiv.classList.add("hidden");
        goalDiv.classList.remove("animate-goal");
    }, 5000);
}

function triggerScoreUpdate(elementId) {
    const scoreElement = getElement('#' + elementId);
    if (!scoreElement) return;

    scoreElement.classList.add("animate-score-update");
    setTimeout(() => {
        scoreElement.classList.remove("animate-score-update");
    }, 1000);
}

function extraTimed(extra) {
    const extaTimeDiv = getElement('#extra-time');
    if (!extaTimeDiv) return;

    if (extra) {
        getElement('#extra-timer').textContent = extra;
        extaTimeDiv.classList.remove("extra-time-animate-out", "hidden");
        extaTimeDiv.classList.add("extra-time-animate");
    } else if (extra === null || extra === "") {
        extaTimeDiv.classList.remove("extra-time-animate");
        extaTimeDiv.classList.add("extra-time-animate-out");
        // Remove a classe 'hidden' após a animação de saída
        setTimeout(() => {
            extaTimeDiv.classList.add("hidden");
        }, 800); // 800ms é a duração da sua animação de saída de tempo extra no CSS
    }
}

// --- Handlers de Socket ---

socket.on("data_updated", function (data) {
    // console.log(data); // Deixei o log comentado para um ambiente de produção

    getElement('#teamA_logo').src = data.teamA_logo;
    getElement('#teamB_logo').src = data.teamB_logo;

    getElement('#teamA_short').textContent = data.teamA_short;
    getElement('#teamB_short').textContent = data.teamB_short;

    // Aplicação de Cores de Fundo (com verificação de segurança)
    const colorElementA = getElement(".color-teamA");
    const colorElementB = getElement(".color-teamB");

    if (colorElementA) colorElementA.style.background = data.teamA_color;
    if (colorElementB) colorElementB.style.background = data.teamB_color;

    const newScoreA = parseInt(data.teamA_score);
    const newScoreB = parseInt(data.teamB_score);

    // Lógica de GOL/REVERSÃO
    if (newScoreA > oldScoreA) {
        triggerGoalAnimation(data.teamA_name);
    }
    if (newScoreA !== oldScoreA) {
        triggerScoreUpdate("teamA_score");
    }

    if (newScoreB > oldScoreB) {
        triggerGoalAnimation(data.teamB_name);
    }
    if (newScoreB !== oldScoreB) {
        triggerScoreUpdate("teamB_score");
    }

    extraTimed(data.extra_time); // Chama a função para lidar com o tempo extra

    getElement('#teamA_score').textContent = data.teamA_score;
    getElement('#teamB_score').textContent = data.teamB_score;

    oldScoreA = newScoreA;
    oldScoreB = newScoreB;
});

socket.on("data_timed", function (data) {
    // CORRIGIDO: O placar deve ser visível antes de receber o tempo, 
    // mas a classe 'hidden' deve ser removida pela animação 'in-score'
    // Apenas atualiza o tempo
    getElement('#timer').textContent = data.timer;
});

socket.on("score_enable", function (data) {
    console.log(data)
    const scoreboard = getElement('#scoreboard-container');
    const extaTimeDiv = getElement('#extra-time');

    if (data.enable) {

        if (data.extra_time) {
            scoreboard.classList.remove("hidden");
            scoreboard.classList.remove("out-score");
            scoreboard.classList.add("in-score");
            setTimeout(() => {
                extaTimeDiv.classList.remove("extra-time-animate-out", "hidden");
                extaTimeDiv.classList.add("extra-time-animate");
            }, 1000);
        } else {
            scoreboard.classList.remove("hidden");
            scoreboard.classList.remove("out-score");
            scoreboard.classList.add("in-score");
        }
    } else {

        if (data.extra_time) {

            extaTimeDiv.classList.remove("extra-time-animate"); extaTimeDiv.classList.add("extra-time-animate-out");

            setTimeout(() => {
                scoreboard.classList.remove("in-score");
                scoreboard.classList.add("out-score");
            }, 1000);

        } else {
            scoreboard.classList.remove("in-score");
            scoreboard.classList.add("out-score");
        }
    }
});

socket.on("extend_mode", function (data) {
    if (data.extend) {
        const teamA = getElement('#teamA_short');
        const teamB = getElement('#teamB_short');
        const teamClasses = getElement(".name", true);

        const duration = 1000;
        const displayTime = 5000; // 5 segundos de exibição do nome completo

        // FASE 1: MOSTRA OS NOMES COMPLETOS

        // 1. Inicia a animação de SAÍDA dos nomes atuais
        teamClasses.forEach(el => {
            el.classList.remove("team-name-in");
            el.classList.add("team-name-out");
        });

        // 2. Espera a animação de SAÍDA terminar (1000ms)
        setTimeout(() => {
            // Troca o texto e inicia a ENTRADA
            teamA.textContent = data.teamA_name;
            teamB.textContent = data.teamB_name;

            teamClasses.forEach(el => {
                el.classList.remove("team-name-out");
                el.classList.add("team-name-in");
            });

            // FASE 2: RETORNA PARA OS NOMES CURTOS (após o tempo de exibição)

            // 3. Agenda o retorno (1000ms animação + 5000ms exibição)
            setTimeout(() => {
                // Inicia a animação de SAÍDA dos nomes completos
                teamClasses.forEach(el => {
                    el.classList.remove("team-name-in");
                    el.classList.add("team-name-out");
                });

                // 4. Espera a segunda animação de SAÍDA (1000ms)
                setTimeout(() => {
                    // Troca o texto de volta e inicia a ENTRADA do nome curto
                    teamA.textContent = data.teamA_short;
                    teamB.textContent = data.teamB_short;

                    teamClasses.forEach(el => {
                        el.classList.remove("team-name-out");
                        el.classList.add("team-name-in");
                    });
                }, duration);
            }, duration + displayTime);
        }, duration);
    }
});

// Adiciona um pequeno delay na inicialização para garantir que o DOM esteja pronto
document.addEventListener('DOMContentLoaded', () => {
    // Esconde o extra-time por padrão, pois o CSS inicial não faria isso.
    const extaTimeDiv = getElement('#extra-time');
    if (extaTimeDiv) {
        extaTimeDiv.classList.add("hidden");
    }
});