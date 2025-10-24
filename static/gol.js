let state = { oldA: 0, oldB: 0 };

function playGoalAnimation(nome, logo, cor) {
    console.log(nome, logo, cor)
    const goalImg = document.getElementById('goal-img');
    goalImg.src = logo;

    const nameTeam = document.getElementById('name-team-gol');
    nameTeam.textContent = nome;
    const lowerThird = document.querySelector('.lower-third');
    lowerThird.style.setProperty('--team-color', cor);

    const box = document.querySelector('.box');
    lowerThird.style.background = cor;
    box.style.background = cor;
    const img = document.querySelector('.info-box');
    const txt = document.querySelector('.text-container');
    const line = document.querySelector('.foto-placeholder');
    line.style.background = cor;
    line.style.borderColor = cor;

    txt.style.color = cor;
    lowerThird.classList.add('animate-goal-lower-third');
    box.classList.add('animate-goal-box');
    img.classList.add('animate-goal-img');
    txt.classList.add('animate-goal-txt');
    [lowerThird, box, img, txt].forEach(el =>
        el.addEventListener('animationend', () => el.className = el.className.replace(/animate-goal-\S+/g, ''), { once: true })
    );
    console.log(`Gol de ${nome}`);
}

socket.on("data_updated", data => {
    document.querySelector('#teamA_short').textContent = data.teamA_short;
    document.querySelector('#teamB_short').textContent = data.teamB_short;
    const newA = parseInt(data.teamA_score);
    const newB = parseInt(data.teamB_score);
    if (newA > state.oldA) playGoalAnimation(data.teamA_name, data.teamA_logo, data.teamA_color);
    if (newB > state.oldB) playGoalAnimation(data.teamB_name, data.teamB_logo, data.teamB_color);
    state.oldA = newA;
    state.oldB = newB;
});
