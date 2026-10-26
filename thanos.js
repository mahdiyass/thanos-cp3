const video = document.getElementById('player-cena');

const audio = document.getElementById('musica');

const btnReviver = document.getElementById('reviver');

let desintegrou = false;

video.addEventListener('timeupdate', () => {

  const tempo = video.currentTime;

  if (tempo >= 48 && audio.paused && !desintegrou) {

    audio.volume = 0.2;

    audio.play().catch(e => console.log(e));

  }

  if (tempo >= 75 && audio.volume < 1.0) {

    audio.volume = Math.min(1.0, audio.volume + 0.1);

  }

  if (tempo >= 78 && !desintegrou) {

    desintegrou = true;

    video.pause();

    iniciarDesintegracaoSuave();

    rolarParaOTopo();

    soltarPoeira();

  }

});

function iniciarDesintegracaoSuave() {

  const ordem = ['.faixa-4', '.faixa-3', '.faixa-2', '.faixa-1', 'header', '.menu-fixo', '.voltar', '.botao-topo'];

  ordem.forEach((seletor, i) => {

    const el = document.querySelector(seletor);

    if (!el) return;

    el.style.transition = `opacity 9s ease-in-out ${i * 4}s, filter 9s ease-in-out ${i * 4}s`;

    el.style.opacity = '0';

    el.style.filter = 'blur(10px) grayscale(1)';

    el.style.pointerEvents = 'none';

  });

  setTimeout(() => {

    if (btnReviver) {

      btnReviver.hidden = false;

    }

  }, 40000);

}

function rolarParaOTopo() {

  const inicio = performance.now();

  const partida = window.scrollY;

  const duracao = 30000;

  document.documentElement.style.scrollBehavior = 'auto';

  function passo(agora) {

    const p = Math.min(1, (agora - inicio) / duracao);

    window.scrollTo(0, partida * (1 - p));

    if (p < 1) {

      requestAnimationFrame(passo);

    }

  }

  requestAnimationFrame(passo);

}

function soltarPoeira() {

  const canvas = document.getElementById('poeira');

  const ctx = canvas.getContext('2d');

  const largura = window.innerWidth;

  const altura = window.innerHeight;

  canvas.width = largura;

  canvas.height = altura;

  const sorteio = (min, max) => min + Math.random() * (max - min);

  const cores = ['#9a8fb0', '#c9bfe0', '#6d5a8f', '#e8e0f5', '#f5c518'];

  const porQuadro = largura < 720 ? 6 : 14;

  const duracao = 40000;

  const inicio = performance.now();

  let particulas = [];

  function animar(agora) {

    ctx.clearRect(0, 0, largura, altura);

    if (agora - inicio < duracao) {

      for (let i = 0; i < porQuadro; i++) {

        particulas.push({

          x: Math.random() * largura,

          y: Math.random() * altura,

          vx: sorteio(0.3, 1.2),

          vy: sorteio(-0.8, -0.1),

          tamanho: sorteio(1, 4),

          cor: cores[Math.floor(Math.random() * cores.length)],

          vida: 1,

          taxa: sorteio(0.003, 0.008)

        });

      }

    }

    particulas = particulas.filter(p => p.vida > 0);

    particulas.forEach(p => {

      p.x += p.vx;

      p.y += p.vy;

      p.vida -= p.taxa;

      ctx.globalAlpha = Math.max(0, p.vida) * 0.9;

      ctx.fillStyle = p.cor;

      ctx.fillRect(p.x, p.y, p.tamanho, p.tamanho);

    });

    if (agora - inicio < duracao || particulas.length > 0) {

      requestAnimationFrame(animar);

    } else {

      ctx.clearRect(0, 0, largura, altura);

    }

  }

  requestAnimationFrame(animar);

}

if (btnReviver) {

  btnReviver.addEventListener('click', () => location.reload());

}
 