/**
 * Carreras de Caballos - App principal (local + multijugador con registro y salas).
 */
(function() {
  const appEl = document.getElementById('app');
  let state = null;
  let engine = null;
  let autoInterval = null;
  const useOnline = typeof window.API !== 'undefined' && window.API_URL !== undefined;

  function showAuth() {
    appEl.innerHTML = '';
    appEl.className = 'root menu-box';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.style.maxWidth = '480px';
    panel.innerHTML = `
      <h1 class="title">Carreras de Caballos</h1>
      <p class="subtitle">Inicia sesión o regístrate para jugar en salas de 4</p>
      <div class="requirements-box">
        <strong>Requisitos del juego:</strong>
        <ul>
          <li>4 usuarios por sala jugando simultáneamente</li>
          <li>Al registrarte la app te asigna <strong>1000 puntos</strong></li>
          <li>Precio variable por carrera (10–1000 puntos)</li>
          <li>Si ganas: <strong>puntos apostados × 5</strong></li>
          <li>Si se te acaban los puntos: compra paquete de <strong>1000 puntos por $10.000 COP</strong></li>
        </ul>
      </div>
      <div id="authError" class="auth-error" style="display:none;color:#e8a0a0;margin:8px 0;"></div>
      <div class="auth-tabs">
        <button type="button" class="auth-tab active" data-tab="login">Entrar</button>
        <button type="button" class="auth-tab" data-tab="register">Registrarse</button>
      </div>
      <div id="authLogin" class="auth-form">
        <input type="email" id="loginEmail" placeholder="Email" class="auth-input">
        <input type="password" id="loginPassword" placeholder="Contraseña" class="auth-input">
        <button type="button" class="btn btn-primary" id="btnLogin">Entrar</button>
      </div>
      <div id="authRegister" class="auth-form" style="display:none;">
        <input type="text" id="regName" placeholder="Nombre" class="auth-input">
        <input type="email" id="regEmail" placeholder="Email" class="auth-input">
        <input type="password" id="regPassword" placeholder="Contraseña (mín. 6)" class="auth-input">
        <button type="button" class="btn btn-primary" id="btnRegister">Registrarse (recibes 1000 puntos)</button>
      </div>
      <button type="button" class="btn" style="margin-top:12px" id="btnLocal">Jugar sin cuenta (solo local)</button>
    `;
    appEl.appendChild(panel);
    const errEl = panel.querySelector('#authError');
    function showErr(msg) { errEl.textContent = msg || ''; errEl.style.display = msg ? 'block' : 'none'; }
    panel.querySelectorAll('.auth-tab').forEach(t => t.addEventListener('click', () => {
      panel.querySelectorAll('.auth-tab').forEach(x => x.classList.remove('active'));
      panel.querySelector('[data-tab="' + t.dataset.tab + '"]').classList.add('active');
      panel.querySelector('#authLogin').style.display = t.dataset.tab === 'login' ? 'block' : 'none';
      panel.querySelector('#authRegister').style.display = t.dataset.tab === 'register' ? 'block' : 'none';
      showErr('');
    }));
    panel.querySelector('#btnLogin').addEventListener('click', async () => {
      showErr('');
      try {
        await API.login(panel.querySelector('#loginEmail').value, panel.querySelector('#loginPassword').value);
        showMainMenu();
      } catch (e) { showErr(e.message); }
    });
    panel.querySelector('#btnRegister').addEventListener('click', async () => {
      showErr('');
      try {
        await API.register(panel.querySelector('#regEmail').value, panel.querySelector('#regPassword').value, panel.querySelector('#regName').value);
        showMainMenu();
      } catch (e) { showErr(e.message); }
    });
    panel.querySelector('#btnLocal').addEventListener('click', showMenu);
  }

  function showMainMenu() {
    if (useOnline && API.getToken()) {
      appEl.innerHTML = '';
      appEl.className = 'root menu-box';
      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.innerHTML = `
        <h1 class="title">Carreras de Caballos</h1>
        <p class="subtitle">Baraja Española · 🪙 🏆 ⚔️ 🪵</p>
        <p class="points-display" id="menuPoints">👤 Cargando... · <strong>— puntos</strong></p>
        <button type="button" class="btn btn-primary" data-action="new">Partida local</button>
        <button type="button" class="btn btn-primary" data-action="createRoom">Crear sala (4 jugadores)</button>
        <button type="button" class="btn" data-action="joinRoom">Unirse a sala</button>
        <button type="button" class="btn" data-action="config">Configuración</button>
        <button type="button" class="btn" data-action="rules">Ver reglas</button>
        <button type="button" class="btn" data-action="buyPoints">Comprar 1000 puntos ($10.000 COP)</button>
        <button type="button" class="btn btn-danger" data-action="logout">Cerrar sesión</button>
      `;
      appEl.appendChild(panel);
      const pointsEl = panel.querySelector('#menuPoints');
      API.getMe().then(function(u) {
        API.setUser(u);
        pointsEl.innerHTML = '👤 ' + u.displayName + ' · <strong>' + u.points + ' puntos</strong>';
      }).catch(function() {
        const user = API.getUser();
        if (user) pointsEl.innerHTML = '👤 ' + user.displayName + ' · <strong>' + (user.points ?? '—') + ' puntos</strong>';
      });
      panel.querySelector('[data-action="new"]').addEventListener('click', onNewGame);
      panel.querySelector('[data-action="createRoom"]').addEventListener('click', showCreateRoom);
      panel.querySelector('[data-action="joinRoom"]').addEventListener('click', showJoinRoom);
      panel.querySelector('[data-action="config"]').addEventListener('click', showConfig);
      panel.querySelector('[data-action="rules"]').addEventListener('click', showRules);
      panel.querySelector('[data-action="buyPoints"]').addEventListener('click', buyPoints);
      panel.querySelector('[data-action="logout"]').addEventListener('click', () => { API.logout(); showAuth(); });
      return;
    }
    showMenu();
  }

  async function buyPoints() {
    try {
      const data = await API.purchasePoints();
      API.setUser({ ...API.getUser(), points: data.points });
      alert(data.message);
      showMainMenu();
    } catch (e) { alert(e.message); }
  }

  function showCreateRoom() {
    appEl.innerHTML = '';
    appEl.className = 'root';
    const suits = Suit.values();
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <h1 class="title">Crear sala</h1>
      <p class="subtitle">4 jugadores · Precio de entrada variable</p>
      <div class="config-row"><label>Precio entrada (puntos):</label><input type="number" id="entryPrice" value="50" min="10" max="1000" class="auth-input" style="width:100px"></div>
      <div class="config-row"><label>Pista (checkpoints):</label><input type="number" id="trackLen" value="7" min="3" max="15" class="auth-input" style="width:80px"></div>
      <label>Tu caballo:</label>
      <div class="suit-buttons">${suits.map(s => `<button type="button" class="btn suit-btn ${s.key === 'OROS' ? 'primary' : ''}" data-suit="${s.key}">${s.symbol} ${s.displayName}</button>`).join('')}</div>
      <button type="button" class="btn btn-primary" id="btnCreate">Crear</button>
      <button type="button" class="btn" id="backCreate">Volver</button>
    `;
    appEl.appendChild(panel);
    let chosenSuit = 'OROS';
    panel.querySelectorAll('.suit-btn').forEach(b => { b.addEventListener('click', () => { chosenSuit = b.dataset.suit; panel.querySelectorAll('.suit-btn').forEach(x => x.classList.remove('primary')); b.classList.add('primary'); }); });
    panel.querySelector('#btnCreate').addEventListener('click', async () => {
      try {
        const entry = parseInt(panel.querySelector('#entryPrice').value, 10) || 50;
        const track = parseInt(panel.querySelector('#trackLen').value, 10) || 7;
        const data = await API.createRoom(entry, track, chosenSuit);
        showRoomWaiting(data.code, data.entryPrice, data.trackLength);
      } catch (e) { alert(e.message); }
    });
    panel.querySelector('#backCreate').addEventListener('click', showMainMenu);
  }

  function showJoinRoom() {
    appEl.innerHTML = '';
    appEl.className = 'root';
    const panel = document.createElement('div');
    panel.className = 'panel';
    const suits = Suit.values();
    panel.innerHTML = `
      <h1 class="title">Unirse a sala</h1>
      <input type="text" id="roomCode" placeholder="Código de sala (6 letras)" class="auth-input" maxlength="6" style="text-transform:uppercase">
      <label>Elige tu caballo:</label>
      <div class="suit-buttons">${suits.map(s => `<button type="button" class="btn suit-btn" data-suit="${s.key}">${s.symbol} ${s.displayName}</button>`).join('')}</div>
      <button type="button" class="btn btn-primary" id="btnJoin">Entrar</button>
      <button type="button" class="btn" id="backJoin">Volver</button>
    `;
    appEl.appendChild(panel);
    let chosenSuit = 'OROS';
    panel.querySelectorAll('.suit-btn').forEach(b => { b.addEventListener('click', () => { chosenSuit = b.dataset.suit; panel.querySelectorAll('.suit-btn').forEach(x => x.classList.remove('primary')); b.classList.add('primary'); }); });
    panel.querySelector('#btnJoin').addEventListener('click', async () => {
      try {
        const code = panel.querySelector('#roomCode').value.trim();
        if (!code) { alert('Escribe el código'); return; }
        await API.joinRoom(code, chosenSuit);
        showRoomWaiting(code);
      } catch (e) { alert(e.message); }
    });
    panel.querySelector('#backJoin').addEventListener('click', showMainMenu);
  }

  function showRoomWaiting(code, entryPrice, trackLength) {
    if (typeof io === 'undefined') {
      alert('Servicio de salas no disponible. Abre la app desde el servidor.');
      showMainMenu();
      return;
    }
    appEl.innerHTML = '';
    appEl.className = 'root';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <h1 class="title">Sala ${code}</h1>
      <p class="subtitle" id="roomSub">Esperando jugadores (4 por sala)...</p>
      <p class="points-display" id="roomPlayers"></p>
      <p class="code-display">Código: <strong>${code}</strong></p>
      <button type="button" class="btn" id="backRoom">Salir</button>
    `;
    appEl.appendChild(panel);
    const socket = io(window.API_URL || window.location.origin, { path: '/socket.io' });
    const user = API.getUser();
    socket.emit('join-room', { roomCode: code, userId: user.id, displayName: user.displayName });
    socket.on('room-state', (data) => {
      panel.querySelector('#roomPlayers').textContent = data.players.map(p => p.display_name + ' → ' + (Suit.values().find(s => s.key === p.suit)?.symbol || p.suit)).join(' · ') || 'Nadie aún';
      panel.querySelector('#roomSub').textContent = data.status === 'racing' ? 'Carrera en curso...' : data.status === 'finished' ? 'Carrera terminada' : `Entrada: ${data.entryPrice || entryPrice} pts · ${(data.players || []).length}/4`;
    });
    socket.on('race-finished', (data) => {
      const winnerSuit = Suit.values().find(s => s.key === data.winner);
      let html = '<p class="winner-banner">🏇 Ganador: ' + (winnerSuit ? winnerSuit.symbol + ' ' + winnerSuit.displayName : '-') + '</p>';
      html += '<p class="rules-body">Premio: puntos apostados × 5</p>';
      (data.players || []).forEach(p => {
        const s = Suit.values().find(x => x.key === p.suit);
        html += '<p>' + (p.won ? '✅' : '❌') + ' ' + (s ? s.symbol : '') + ' apostaste ' + p.pointsBet + ' pts → ' + (p.won ? '+' + (p.pointsBet * 5) + ' pts' : '0') + '</p>';
      });
      panel.querySelector('#roomSub').innerHTML = html;
      panel.querySelector('#roomSub').classList.add('rules-body');
      API.getMe().then(u => { API.setUser(u); }).catch(() => {});
    });
    socket.on('error', (data) => alert(data.message || 'Error'));
    panel.querySelector('#backRoom').addEventListener('click', () => { socket.disconnect(); showMainMenu(); });
  }

  function showMenu() {
    appEl.innerHTML = '';
    appEl.className = 'root menu-box';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <h1 class="title">Carreras de Caballos</h1>
      <p class="subtitle">Baraja Española · 🪙 Oros  🏆 Copas  ⚔️ Espadas  🪵 Bastos</p>
      <button type="button" class="btn btn-primary" data-action="new">Nueva partida</button>
      <button type="button" class="btn" data-action="config">Configuración</button>
      <button type="button" class="btn" data-action="rules">Ver reglas</button>
      ${useOnline ? '<button type="button" class="btn" data-action="auth">Entrar / Registrarse</button>' : ''}
      <button type="button" class="btn btn-danger" data-action="exit">Salir</button>
    `;
    appEl.appendChild(panel);
    panel.querySelector('[data-action="new"]').addEventListener('click', onNewGame);
    panel.querySelector('[data-action="config"]').addEventListener('click', showConfig);
    panel.querySelector('[data-action="rules"]').addEventListener('click', showRules);
    if (useOnline && panel.querySelector('[data-action="auth"]')) panel.querySelector('[data-action="auth"]').addEventListener('click', showAuth);
    panel.querySelector('[data-action="exit"]').addEventListener('click', () => window.close());
  }

  function showConfig() {
    const cfg = GameConfig;
    appEl.innerHTML = '';
    appEl.className = 'root';
    const panel = document.createElement('div');
    panel.className = 'panel';
    const trackVal = cfg.getTrackLength();
    const playersVal = cfg.getNumPlayers();
    const deckIdx = cfg.getDeckSize() === cfg.DECK_48 ? 1 : 0;
    panel.innerHTML = `
      <h1 class="title">Configuración</h1>
      <div class="config-row">
        <label>Pista (N):</label>
        <input type="range" id="trackLen" min="3" max="15" value="${trackVal}">
        <span class="value" id="trackVal">${trackVal}</span>
      </div>
      <div class="config-row">
        <label>Jugadores:</label>
        <input type="range" id="players" min="1" max="8" value="${playersVal}">
        <span class="value" id="playersVal">${playersVal}</span>
      </div>
      <div class="config-row">
        <label>Baraja:</label>
        <select id="deck">
          <option value="40" ${deckIdx === 0 ? 'selected' : ''}>40 cartas</option>
          <option value="48" ${deckIdx === 1 ? 'selected' : ''}>48 cartas</option>
        </select>
      </div>
      <div class="config-row">
        <label><input type="checkbox" id="bets" ${cfg.isBetsEnabled() ? 'checked' : ''}> Apuestas (fichas)</label>
      </div>
      <div class="config-row">
        <label><input type="checkbox" id="auto" ${cfg.isAutoMode() ? 'checked' : ''}> Modo automático</label>
      </div>
      <div class="buttons-row">
        <button class="btn" id="backConfig">Volver al menú</button>
      </div>
    `;
    const trackLen = panel.querySelector('#trackLen');
    const trackValEl = panel.querySelector('#trackVal');
    trackLen.oninput = () => { trackValEl.textContent = trackLen.value; };
    const players = panel.querySelector('#players');
    const playersValEl = panel.querySelector('#playersVal');
    players.oninput = () => { playersValEl.textContent = players.value; };
    panel.querySelector('#backConfig').onclick = () => {
      cfg.setTrackLength(parseInt(trackLen.value, 10));
      cfg.setNumPlayers(parseInt(players.value, 10));
      cfg.setDeckSize(panel.querySelector('#deck').value === '48' ? 48 : 40);
      cfg.setBetsEnabled(panel.querySelector('#bets').checked);
      cfg.setAutoMode(panel.querySelector('#auto').checked);
      showMenu();
    };
    appEl.appendChild(panel);
  }

  function showRules() {
    appEl.innerHTML = '';
    appEl.className = 'root';
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <h1 class="rules-title">Reglas del juego</h1>
      <div class="rules-scroll">
        <p class="rules-heading">CARRERAS DE CABALLOS - BARAJA ESPAÑOLA</p>
        <p class="rules-body">Hay 4 caballos 🏇, uno por palo: 🪙 Oros, 🏆 Copas, ⚔️ Espadas, 🪵 Bastos (los 4 Ases).</p>
        <p class="rules-heading">LA PISTA</p>
        <p class="rules-body">La pista tiene N casillas (checkpoints). Por defecto N = 7. Las N primeras cartas forman la pista boca abajo. El resto es el mazo de carrera.</p>
        <p class="rules-heading">CADA TURNO</p>
        <p class="rules-body">Se revela 1 carta del mazo.</p>
        <p class="rules-highlight">→ El caballo del palo de esa carta avanza 1 casilla.</p>
        <p class="rules-heading">OBSTÁCULO</p>
        <p class="rules-body">Cuando todos los caballos alcanzan el siguiente checkpoint, se voltea esa carta de pista.</p>
        <p class="rules-highlight">→ El caballo del palo de la carta revelada retrocede 1 casilla.</p>
        <p class="rules-heading">VICTORIA</p>
        <p class="rules-highlight">Gana el primer caballo que sobrepase el último checkpoint (posición > N).</p>
        <p class="rules-heading">REBARAJAR</p>
        <p class="rules-body">Si el mazo se agota, se rebaraja el descarte y se continúa.</p>
        <p class="rules-heading">APUESTAS (OPCIONAL)</p>
        <p class="rules-body">Cada jugador elige un palo. Al final se muestran ganador y fichas.</p>
      </div>
      <div class="buttons-row">
        <button class="btn" id="backRules">Volver al menú</button>
      </div>
    `;
    panel.querySelector('#backRules').onclick = showMenu;
    appEl.appendChild(panel);
  }

  function onNewGame() {
    try {
      state = new GameState(GameConfig);
      const numPlayers = GameConfig.getNumPlayers();
      for (let i = 0; i < numPlayers; i++) {
        const bet = GameConfig.isBetsEnabled() ? Suit.values()[i % 4] : null;
        state.addPlayer(new Player(i + 1, 'Jugador ' + (i + 1), bet, 100));
      }
      engine = new GameEngine(state);
      engine.initNewRace();
      showRaceView();
    } catch (err) {
      console.error('Error al iniciar partida:', err);
      alert('Error al iniciar partida: ' + (err.message || err));
    }
  }

  function showRaceView() {
    appEl.innerHTML = '';
    appEl.className = 'root';

    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.textContent = '← Menú';
    backBtn.onclick = () => { clearAuto(); showMenu(); };

    const cardBox = document.createElement('div');
    cardBox.className = 'card-revealed-box';
    cardBox.innerHTML = '<span class="card-revealed-label">Carta:</span> <span class="card-revealed-value" id="cardRevealed">—</span>';

    const checkLabel = document.createElement('span');
    checkLabel.className = 'checkpoint-msg';
    checkLabel.id = 'checkpointLabel';

    topBar.appendChild(backBtn);
    topBar.appendChild(cardBox);
    topBar.appendChild(checkLabel);

    const trackDiv = document.createElement('div');
    trackDiv.className = 'track-container track-grid';
    trackDiv.id = 'trackGrid';

    const logArea = document.createElement('pre');
    logArea.className = 'log-area';
    logArea.id = 'logArea';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = 'Siguiente turno';
    nextBtn.onclick = doOneTurn;

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn';
    exportBtn.textContent = 'Exportar log';
    exportBtn.onclick = () => {
      const blob = new Blob([state.logMessages.join('\n')], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'carrera_log.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    };

    const buttons = document.createElement('div');
    buttons.className = 'buttons-row';
    buttons.append(nextBtn, exportBtn);

    appEl.append(topBar, trackDiv, logArea, buttons);

    renderTrack();
    refreshLog();

    if (GameConfig.isAutoMode()) {
      autoInterval = setInterval(() => {
        doOneTurn();
      }, 600);
    }
  }

  function clearAuto() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  function doOneTurn() {
    if (state.winner) {
      clearAuto();
      showResults();
      return;
    }
    if (!engine.canContinue()) {
      state.log('No hay más cartas. Partida terminada sin ganador.');
      clearAuto();
      showResults();
      return;
    }
    const result = engine.runOneTurn();
    const checkEl = document.getElementById('checkpointLabel');
    const cardVal = document.getElementById('cardRevealed');
    if (cardVal) cardVal.textContent = result.drawnCard ? result.drawnCard.toShortString() : '—';
    if (checkEl) {
      checkEl.textContent = result.checkpointFlipped && result.flippedCard
        ? 'Checkpoint: ' + result.flippedCard.toShortString() + ' → ' + result.flippedCard.suit.displayName + ' retrocede'
        : '';
    }
    renderTrack();
    refreshLog();
    if (engine.hasWinner() || !engine.canContinue()) {
      clearAuto();
      showResults();
    }
  }

  function renderTrack() {
    const grid = document.getElementById('trackGrid');
    if (!grid) return;
    const track = state.track;
    const n = track.getLength();
    const headers = ['Salida', ...Array.from({ length: n }, (_, i) => 'CP' + (i + 1)), 'Meta'];
    const colCount = headers.length;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${colCount}, minmax(52px, 1fr))`;

    headers.forEach((h, col) => {
      const cell = document.createElement('div');
      cell.className = 'track-header';
      cell.textContent = h;
      grid.appendChild(cell);
    });

    for (const s of Suit.values()) {
      const horse = state.horses[s.key];
      if (!horse) continue;
      for (let col = 0; col < colCount; col++) {
        const cell = document.createElement('div');
        cell.className = 'track-cell';
        if (col === 0) cell.classList.add('start');
        else if (col > n) cell.classList.add('finish');
        if (horse.position === col) {
          cell.textContent = '🏇';
          cell.classList.add('horse-' + s.key.toLowerCase());
        }
        grid.appendChild(cell);
      }
    }
  }

  function refreshLog() {
    const el = document.getElementById('logArea');
    if (el) el.textContent = state.logMessages.join('\n');
  }

  function showResults() {
    appEl.innerHTML = '';
    appEl.className = 'root';
    const panel = document.createElement('div');
    panel.className = 'panel';

    const winner = state.winner;
    const winnerText = document.createElement('p');
    winnerText.className = 'winner-banner';
    winnerText.textContent = winner ? '🏇 Ganador: ' + winner.symbol + ' ' + winner.displayName : 'Sin ganador (mazo agotado)';
    panel.appendChild(winnerText);

    const stats = document.createElement('div');
    stats.className = 'stats-grid';
    stats.innerHTML = `
      <span>Turnos:</span><span class="stat-value">${state.turnCount}</span>
      <span>Cartas reveladas:</span><span class="stat-value">${state.totalCardsRevealed}</span>
    `;
    for (const s of Suit.values()) {
      stats.innerHTML += `<span>Retrocesos ${s.symbol} ${s.displayName}:</span><span class="stat-value">${state.retreatsBySuit[s.key]}</span>`;
    }
    panel.appendChild(stats);

    if (GameConfig.isBetsEnabled() && state.players.length > 0) {
      const betsTitle = document.createElement('p');
      betsTitle.className = 'subtitle';
      betsTitle.textContent = 'Apuestas (fichas)';
      panel.appendChild(betsTitle);
      state.players.forEach(p => {
        const change = state.winner && p.betSuit && p.betSuit.key === state.winner.key ? 10 : -5;
        p.addChips(change);
        const t = document.createElement('p');
        t.textContent = p.name + ' apostó a ' + (p.betSuit ? p.betSuit.symbol + ' ' + p.betSuit.displayName : '-') + ' → ' + (change >= 0 ? '+' : '') + change + ' → ' + p.chips + ' fichas';
        panel.appendChild(t);
      });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.textContent = 'Volver al menú';
    backBtn.onclick = showMenu;
    panel.appendChild(backBtn);

    appEl.appendChild(panel);
  }

  if (useOnline && window.API && !API.getToken()) showAuth();
  else showMainMenu();
})();
