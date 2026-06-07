const STORAGE_KEY = 'danielaFit_mvp_v1';
const APP_VERSION = 'v8.0 real-images';
const todayISO = () => new Date().toISOString().slice(0, 10);
const dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const monthNames = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

const defaultState = {
  profile: {
    name: 'Daniela',
    age: 26,
    height: "5'4\"",
    weightLb: 155,
    goal: 'Bajar grasa, tonificar, mejorar condición física y cuidar espalda/cuello.',
    trainingTime: 'Después de las 5:00 PM',
    weekendOff: true,
    tennisDays: ['Martes', 'Jueves'],
    avoid: 'Lunges/zancadas y cargas pesadas apoyadas en cuello.'
  },
  settings: {
    quickModeMinutes: 25,
    conservativePainLevel: 6,
    weeklyStepTarget: 7000,
    testDayOverride: null
  },
  checkins: {},
  logs: [],
  exerciseProgress: {},
  streak: 0,
  installedAt: todayISO()
};

const exerciseLibrary = {
  legPress: {
    name: 'Prensa de piernas', tag: 'Pierna segura', defaultLb: 90, stepLb: 10,
    prescription: '3 series x 10-12 reps · descanso cómodo',
    technique: 'Pies a ancho de cadera, espalda pegada al respaldo, baja controlado y empuja sin bloquear las rodillas. No busques profundidad si la espalda se despega.'
  },
  hipThrust: {
    name: 'Hip thrust en máquina o banco', tag: 'Glúteos', defaultLb: 70, stepLb: 10,
    prescription: '3 series x 10-12 reps · pausa 1 s arriba',
    technique: 'Mentón ligeramente abajo, costillas cerradas, empuja con talones y aprieta glúteos arriba. Evita arquear la espalda baja.'
  },
  dbRDL: {
    name: 'Peso muerto rumano con mancuernas', tag: 'Posterior', defaultLb: 20, stepLb: 5,
    prescription: '3 series x 8-10 reps · mancuernas por mano',
    technique: 'Rodillas suaves, cadera hacia atrás, mancuernas cerca de las piernas. La espalda se mantiene neutra; si sientes tirón lumbar, baja peso y rango.'
  },
  hamCurl: {
    name: 'Curl femoral sentado', tag: 'Máquina', defaultLb: 40, stepLb: 5,
    prescription: '3 series x 12 reps · movimiento controlado',
    technique: 'Ajusta el asiento para que la rodilla coincida con el eje. Baja lento y no levantes la cadera del asiento.'
  },
  cablePullThrough: {
    name: 'Cable pull-through', tag: 'Glúteo/espalda amable', defaultLb: 30, stepLb: 5,
    prescription: '2 series x 12-15 reps',
    technique: 'La cuerda pasa entre las piernas, cadera hacia atrás y luego extensión fuerte de glúteos. La espalda no debe redondearse.'
  },
  deadBug: {
    name: 'Dead bug', tag: 'Core seguro', defaultLb: 0, stepLb: 0,
    prescription: '3 series x 8 reps por lado',
    technique: 'Espalda baja pegada al piso, mueve brazo y pierna contraria lento. Si la espalda se despega, reduce rango.'
  },
  chestPress: {
    name: 'Chest press en máquina', tag: 'Empuje', defaultLb: 35, stepLb: 5,
    prescription: '3 series x 10-12 reps',
    technique: 'Escápulas estables, hombros lejos de las orejas. Empuja controlado sin despegar la espalda del respaldo.'
  },
  seatedRow: {
    name: 'Remo sentado en polea', tag: 'Postura', defaultLb: 35, stepLb: 5,
    prescription: '3 series x 10-12 reps',
    technique: 'Pecho alto, tira los codos hacia atrás, pausa un segundo juntando escápulas. No balancees el torso.'
  },
  latPulldown: {
    name: 'Jalón al pecho agarre neutral', tag: 'Espalda', defaultLb: 45, stepLb: 5,
    prescription: '3 series x 10 reps',
    technique: 'Tira hacia el pecho, no detrás del cuello. Mantén cuello relajado y hombros abajo.'
  },
  facePull: {
    name: 'Face pull en polea', tag: 'Cuello/hombros', defaultLb: 15, stepLb: 5,
    prescription: '3 series x 12-15 reps',
    technique: 'Codos altos, tira hacia la cara separando manos. Debe sentirse en hombro posterior/espalda alta, no en cuello.'
  },
  dbInclinePress: {
    name: 'Press inclinado con mancuernas', tag: 'Torso', defaultLb: 12, stepLb: 2.5,
    prescription: '2 series x 10 reps · mancuernas por mano',
    technique: 'Banco inclinado bajo, hombros abajo, empuja sin chocar las mancuernas. Si molesta cuello, cambia a máquina.'
  },
  pallof: {
    name: 'Pallof press', tag: 'Core anti-rotación', defaultLb: 15, stepLb: 5,
    prescription: '3 series x 10 reps por lado',
    technique: 'De lado a la polea, aprieta abdomen y empuja al frente sin que el cuerpo rote.'
  },
  gobletBoxSquat: {
    name: 'Goblet squat a banco', tag: 'Pierna funcional', defaultLb: 15, stepLb: 5,
    prescription: '3 series x 10 reps',
    technique: 'Mancuerna al pecho, siéntate suave en el banco y sube. Mantén pecho alto y cuello relajado; no es carga en el cuello.'
  },
  cableRow: {
    name: 'Remo en cable de pie', tag: 'Full body', defaultLb: 30, stepLb: 5,
    prescription: '3 series x 12 reps',
    technique: 'Rodillas suaves, abdomen activo, tira con codos. Mantén costillas abajo para no arquear la espalda.'
  },
  stepUpLow: {
    name: 'Step-up bajo', tag: 'Pierna sin lunges', defaultLb: 0, stepLb: 5,
    prescription: '2 series x 8 reps por pierna',
    technique: 'Usa un escalón bajo, sube controlado y baja lento. Si se siente como lunge o molesta rodilla, cambia a prensa ligera.'
  },
  bikeIntervals: {
    name: 'Bicicleta intervalos', tag: 'Cardio', defaultLb: 0, stepLb: 0,
    prescription: '12 min: 40 s moderado + 20 s rápido',
    technique: 'Rápido significa exigente pero sostenible. No debe destruirte para el tenis.'
  },
  inclineWalk: {
    name: 'Caminadora inclinada', tag: 'Quema grasa', defaultLb: 0, stepLb: 0,
    prescription: '20-30 min · inclinación 5-8 · ritmo conversable',
    technique: 'Camina sin agarrarte fuerte de la máquina. Postura alta y respiración estable.'
  },
  catCow: {
    name: 'Cat-cow + respiración', tag: 'Movilidad', defaultLb: 0, stepLb: 0,
    prescription: '2 min lento',
    technique: 'Mueve columna suave, no fuerces rangos. Úsalo para bajar tensión de espalda/cuello.'
  },
  thoracicOpen: {
    name: 'Rotaciones torácicas', tag: 'Movilidad', defaultLb: 0, stepLb: 0,
    prescription: '2 series x 8 por lado',
    technique: 'Acostada de lado, abre el brazo siguiendo la mano con la mirada. Debe sentirse en espalda alta, no lumbar.'
  },
  bandPullApart: {
    name: 'Band pull-apart', tag: 'Postura', defaultLb: 0, stepLb: 0,
    prescription: '3 series x 15 reps',
    technique: 'Banda al frente, separa manos sin subir hombros. Pausa atrás y vuelve lento.'
  },
  plank: {
    name: 'Plancha modificada', tag: 'Core', defaultLb: 0, stepLb: 0,
    prescription: '3 x 25-35 s',
    technique: 'Codos debajo de hombros, glúteos activos, abdomen firme. Si molesta espalda, hazla con rodillas apoyadas.'
  }
};


const exerciseImages = {
  legPress: 'exercise-images/legPress.webp',
  hipThrust: 'exercise-images/hipThrust.webp',
  dbRDL: 'exercise-images/dbRDL.webp',
  hamCurl: 'exercise-images/hamCurl.webp',
  cablePullThrough: 'exercise-images/cablePullThrough.webp',
  deadBug: 'exercise-images/deadBug.webp',
  chestPress: 'exercise-images/chestPress.webp',
  seatedRow: 'exercise-images/seatedRow.webp',
  latPulldown: 'exercise-images/latPulldown.webp',
  facePull: 'exercise-images/facePull.webp',
  dbInclinePress: 'exercise-images/dbInclinePress.webp',
  pallof: 'exercise-images/pallof.webp',
  gobletBoxSquat: 'exercise-images/gobletBoxSquat.webp',
  cableRow: 'exercise-images/cableRow.webp',
  stepUpLow: 'exercise-images/stepUpLow.webp',
  bikeIntervals: 'exercise-images/bikeIntervals.webp',
  inclineWalk: 'exercise-images/inclineWalk.webp',
  catCow: 'exercise-images/catCow.webp',
  thoracicOpen: 'exercise-images/thoracicOpen.webp',
  bandPullApart: 'exercise-images/bandPullApart.webp',
  plank: 'exercise-images/plank.webp'
};

const plans = {
  1: {
    title: 'Pierna + glúteos', type: 'gym', focus: 'Bajar grasa, tonificar piernas/glúteos y cuidar espalda.',
    exercises: ['legPress','hipThrust','dbRDL','hamCurl','cablePullThrough','deadBug']
  },
  2: {
    title: 'Tenis + movilidad', type: 'tennis', focus: 'El tenis cuenta como carga. Hoy cuidamos cuello/espalda y sumamos gasto sin sobrecargar.',
    exercises: ['catCow','thoracicOpen','bandPullApart','inclineWalk']
  },
  3: {
    title: 'Torso + postura', type: 'gym', focus: 'Espalda alta, hombros sanos, pecho y core sin peso en cuello.',
    exercises: ['chestPress','seatedRow','latPulldown','facePull','dbInclinePress','pallof']
  },
  4: {
    title: 'Tenis + core', type: 'tennis', focus: 'Mantener condición y estabilidad sin fatigar para tenis.',
    exercises: ['catCow','thoracicOpen','pallof','plank']
  },
  5: {
    title: 'Full body funcional', type: 'gym', focus: 'Sesión completa, moderada y eficiente para tonificación y condición.',
    exercises: ['gobletBoxSquat','cableRow','hipThrust','stepUpLow','bikeIntervals','deadBug']
  },
  6: { title: 'Descanso', type: 'rest', focus: 'Fin de semana libre. Caminar suave cuenta.', exercises: [] },
  0: { title: 'Descanso', type: 'rest', focus: 'Fin de semana libre. Preparar la semana suma.', exercises: [] }
};

function loadState() {
  try {
    return { ...clone(defaultState), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return clone(defaultState);
  }
}

let state = loadState();
let currentScreen = 'today';

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTodayCheckin() {
  const key = todayISO();
  if (!state.checkins[key]) {
    state.checkins[key] = {
      date: key,
      sleep: 7,
      energy: 7,
      motivation: 7,
      minutes: 45,
      backPain: 1,
      neckPain: 1,
      weight: state.profile.weightLb,
      steps: 6000,
      hydration: 6,
      breakfastSkipped: true,
      completed: false
    };
  }
  return state.checkins[key];
}

function getEffectiveDayIndex() {
  const override = state.settings?.testDayOverride;
  if (override === null || override === undefined || override === '') return new Date().getDay();
  return Number(override);
}

function getPlanForDate(date = new Date()) {
  const override = state.settings?.testDayOverride;
  if (override === null || override === undefined || override === '') return plans[date.getDay()];
  return plans[Number(override)];
}

function getWeekNumberSinceStart() {
  const start = new Date(state.installedAt + 'T00:00:00');
  const now = new Date(todayISO() + 'T00:00:00');
  const days = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  return Math.floor(days / 7) + 1;
}

function isDeloadWeek() {
  return getWeekNumberSinceStart() % 4 === 0;
}

function lastLogsForExercise(id, limit = 3) {
  return state.logs
    .filter(log => log.exerciseId === id && typeof log.actualWeight === 'number')
    .slice(-limit);
}

function suggestedWeight(id) {
  const ex = exerciseLibrary[id];
  if (!ex || ex.stepLb === 0) return 0;
  const progress = state.exerciseProgress[id];
  let value = progress?.nextWeight ?? ex.defaultLb;
  if (isDeloadWeek()) value = Math.max(ex.stepLb, Math.round(value * 0.85 / ex.stepLb) * ex.stepLb);
  return value;
}

function computeDailyScore(checkin = getTodayCheckin()) {
  let score = 0;
  score += Math.min(25, Math.max(0, checkin.sleep / 8 * 25));
  score += Math.min(20, Math.max(0, checkin.energy / 10 * 20));
  score += Math.min(15, Math.max(0, checkin.motivation / 10 * 15));
  score += Math.min(15, Math.max(0, checkin.steps / 8000 * 15));
  score += Math.min(10, Math.max(0, checkin.hydration / 8 * 10));
  const painPenalty = Math.max(checkin.backPain, checkin.neckPain) * 2.5;
  score += Math.max(0, 15 - painPenalty);
  return Math.round(Math.max(0, Math.min(100, score)));
}

function adaptationStatus(checkin = getTodayCheckin(), plan = getPlanForDate()) {
  const pain = Math.max(Number(checkin.backPain), Number(checkin.neckPain));
  if (pain >= state.settings.conservativePainLevel) return { mode: 'recovery', label: 'Recuperación activa', color: 'red', reason: 'dolor alto' };
  if (checkin.sleep <= 5 || checkin.energy <= 4) return { mode: 'light', label: 'Versión ligera', color: 'yellow', reason: 'sueño/energía baja' };
  if (checkin.minutes <= state.settings.quickModeMinutes) return { mode: 'quick', label: 'Modo rápido', color: 'yellow', reason: 'poco tiempo' };
  if (isDeloadWeek() && plan.type === 'gym') return { mode: 'deload', label: 'Semana suave', color: 'yellow', reason: 'descarga del ciclo' };
  return { mode: 'normal', label: 'Plan normal', color: 'green', reason: 'lista para entrenar' };
}

function planExerciseIds(plan, status) {
  if (plan.type === 'rest') return [];
  if (status.mode === 'recovery') return ['catCow','thoracicOpen','bandPullApart','inclineWalk'];
  const ids = [...plan.exercises];
  if (status.mode === 'quick') return ids.slice(0, 3);
  if (status.mode === 'light' || status.mode === 'deload') return ids.filter(id => !['bikeIntervals'].includes(id)).slice(0, Math.min(ids.length, 4));
  return ids;
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${monthNames[d.getMonth()]}`;
}

function setTitle(title) {
  document.getElementById('screenTitle').textContent = title;
  document.getElementById('dailyScore').textContent = computeDailyScore();
}

function setActiveTab(screen) {
  document.querySelectorAll('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screen));
}

function render() {
  setActiveTab(currentScreen);
  if (currentScreen === 'today') renderToday();
  if (currentScreen === 'workout') renderWorkout();
  if (currentScreen === 'progress') renderProgress();
  if (currentScreen === 'history') renderHistory();
  if (currentScreen === 'profile') renderProfile();
  saveState();
}

function renderToday() {
  setTitle('Hoy');
  const checkin = getTodayCheckin();
  const plan = getPlanForDate();
  const status = adaptationStatus(checkin, plan);
  const score = computeDailyScore(checkin);
  const content = document.getElementById('content');
  content.innerHTML = `
    <section class="card dark hero">
      <p class="eyebrow">${dayNames[getEffectiveDayIndex()]}${state.settings.testDayOverride !== null && state.settings.testDayOverride !== undefined && state.settings.testDayOverride !== '' ? ' · modo prueba' : ''}</p>
      <h2>${plan.title}</h2>
      <p class="muted">${plan.focus}</p>
      <div class="row">
        <span class="badge ${status.color}">${status.label}</span>
        <span class="badge dark">Score ${score}/100</span>
      </div>
    </section>

    <section class="card">
      <div class="space-between">
        <div>
          <h2>Check-in diario</h2>
          <p class="muted small-text">La app ajusta la rutina con estos datos.</p>
        </div>
        <span class="status ${status.color}">${status.reason}</span>
      </div>
      <form id="checkinForm">
        <div class="grid-2">
          <label>Sueño 1-10 <input name="sleep" type="number" min="1" max="10" value="${checkin.sleep}"></label>
          <label>Energía 1-10 <input name="energy" type="number" min="1" max="10" value="${checkin.energy}"></label>
          <label>Motivación 1-10 <input name="motivation" type="number" min="1" max="10" value="${checkin.motivation}"></label>
          <label>Tiempo disponible <input name="minutes" type="number" min="10" max="90" value="${checkin.minutes}"></label>
          <label>Dolor espalda 0-10 <input name="backPain" type="number" min="0" max="10" value="${checkin.backPain}"></label>
          <label>Dolor cuello 0-10 <input name="neckPain" type="number" min="0" max="10" value="${checkin.neckPain}"></label>
          <label>Peso corporal lb <input name="weight" type="number" min="80" max="260" step="0.1" value="${checkin.weight}"></label>
          <label>Pasos <input name="steps" type="number" min="0" step="100" value="${checkin.steps}"></label>
          <label>Agua vasos <input name="hydration" type="number" min="0" max="15" value="${checkin.hydration}"></label>
          <label>Desayuno
            <select name="breakfastSkipped">
              <option value="true" ${checkin.breakfastSkipped ? 'selected' : ''}>Lo salté</option>
              <option value="false" ${!checkin.breakfastSkipped ? 'selected' : ''}>Comí algo</option>
            </select>
          </label>
        </div>
        <button class="primary full" type="submit">Guardar y ajustar rutina</button>
      </form>
    </section>

    <section class="card">
      <h2>Decisión de hoy</h2>
      <p>${decisionCopy(plan, status)}</p>
      <button class="secondary full" id="goWorkout" type="button">Ver rutina de hoy</button>
    </section>
  `;

  document.getElementById('checkinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next = { ...checkin };
    ['sleep','energy','motivation','minutes','backPain','neckPain','weight','steps','hydration'].forEach(key => next[key] = Number(form.get(key)));
    next.breakfastSkipped = form.get('breakfastSkipped') === 'true';
    state.checkins[todayISO()] = next;
    state.profile.weightLb = next.weight;
    saveState();
    renderToday();
  });
  document.getElementById('goWorkout').addEventListener('click', () => { currentScreen = 'workout'; render(); });
}

function decisionCopy(plan, status) {
  if (plan.type === 'rest') return 'Hoy no hay gimnasio programado. Objetivo: caminar suave, hidratarte y llegar fresca al lunes.';
  if (status.mode === 'recovery') return 'Hoy no conviene empujar. La app cambia a movilidad, caminata y postura para proteger espalda/cuello.';
  if (status.mode === 'quick') return 'Tienes poco tiempo. La app deja solo los ejercicios de mayor retorno para no perder consistencia.';
  if (status.mode === 'light') return 'Hay baja energía o poco sueño. Mantendremos técnica, menos volumen y cero ego con el peso.';
  if (status.mode === 'deload') return 'Semana 4 del ciclo: bajamos el volumen/intensidad para recuperarte y volver a progresar.';
  return 'Entrenamiento normal. Usa los pesos sugeridos y registra reps/esfuerzo para que la próxima sesión se ajuste sola.';
}


const visualCues = {
  legPress: ['Espalda al respaldo', 'Pies firmes', 'No bloquear rodillas'],
  hipThrust: ['Pausa arriba', 'Empuja con talones', 'No arquear lumbar'],
  dbRDL: ['Cadera atrás', 'Mancuernas cerca', 'Espalda neutra'],
  hamCurl: ['Ajusta asiento', 'Controla el regreso', 'Cadera quieta'],
  cablePullThrough: ['Bisagra de cadera', 'Glúteos al subir', 'Espalda neutra'],
  deadBug: ['Espalda pegada', 'Lento', 'Rango controlado'],
  chestPress: ['Hombros abajo', 'Empuje controlado', 'Espalda apoyada'],
  seatedRow: ['Pecho alto', 'Codos atrás', 'Pausa escápulas'],
  latPulldown: ['Al pecho', 'No detrás del cuello', 'Cuello relajado'],
  facePull: ['Codos altos', 'Tira hacia la cara', 'No subir hombros'],
  dbInclinePress: ['Banco bajo', 'Control', 'Cuello neutro'],
  pallof: ['No rotar', 'Abdomen firme', 'Empuja al frente'],
  gobletBoxSquat: ['Siéntate al banco', 'Pecho alto', 'Sin peso en cuello'],
  cableRow: ['Rodillas suaves', 'Costillas abajo', 'Tira con codos'],
  stepUpLow: ['Escalón bajo', 'Sube controlado', 'Baja lento'],
  bikeIntervals: ['Moderado/rápido', 'Respira estable', 'Reserva para tenis'],
  inclineWalk: ['Postura alta', 'Sin agarrarte fuerte', 'Ritmo conversable'],
  catCow: ['Suave', 'Respira', 'No fuerces'],
  thoracicOpen: ['Mira la mano', 'Espalda alta', 'No lumbar'],
  bandPullApart: ['Banda al frente', 'Hombros abajo', 'Pausa atrás'],
  plank: ['Abdomen firme', 'Glúteos activos', 'Rodillas si molesta']
};

const visualKinds = {
  legPress: 'machineLeg', hipThrust: 'floorBridge', dbRDL: 'hinge', hamCurl: 'machineLeg', cablePullThrough: 'cableHinge', deadBug: 'floorCore',
  chestPress: 'machinePush', seatedRow: 'cablePull', latPulldown: 'overheadPull', facePull: 'facePull', dbInclinePress: 'inclinePush', pallof: 'pallof',
  gobletBoxSquat: 'squat', cableRow: 'standingPull', stepUpLow: 'stepUp', bikeIntervals: 'bike', inclineWalk: 'walk', catCow: 'floorMobility',
  thoracicOpen: 'floorTwist', bandPullApart: 'band', plank: 'plank'
};

function svgFigure(kind) {
  const body = 'stroke="#21272d" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const accent = 'stroke="#c68a58" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const fill = 'fill="#c68a58"';
  const head = (x, y) => `<circle cx="${x}" cy="${y}" r="18" ${body}/>`;
  const map = {
    machineLeg: `<path d="M75 210 L165 210 L235 130 L360 95" ${accent}/>${head(150,150)}<path d="M165 168 L215 188 L285 168 M285 168 L335 215 M335 215 L390 180 M335 215 L390 235" ${body}/>` ,
    floorBridge: `<rect x="95" y="230" width="160" height="24" rx="8" ${fill}/>${head(245,145)}<path d="M245 163 L245 205 M180 210 L245 205 L330 180 M180 210 L150 260 M310 190 L355 260" ${body}/>` ,
    hinge: `${head(235,115)}<path d="M235 133 L250 200 L330 230 M250 200 L205 255 M330 230 L330 335 M330 230 L410 275 M410 275 L410 335" ${body}/><rect x="318" y="325" width="24" height="52" rx="8" ${fill}/><rect x="398" y="325" width="24" height="52" rx="8" ${fill}/>` ,
    cableHinge: `<path d="M80 105 L80 335 M80 230 L170 235" ${accent}/>${head(265,115)}<path d="M265 133 L295 205 L340 270 M295 205 L200 240 M340 270 L360 360 M200 240 L160 355" ${body}/>` ,
    floorCore: `<path d="M80 340 H420" ${accent}/>${head(170,200)}<path d="M188 212 L245 260 L325 260 M325 260 L405 195 M245 260 L160 340 M325 260 L405 330" ${body}/>` ,
    machinePush: `<rect x="95" y="210" width="55" height="24" rx="7" ${fill}/><rect x="155" y="110" width="22" height="120" rx="8" ${fill}/><rect x="385" y="80" width="24" height="210" rx="8" ${fill}/>${head(230,145)}<path d="M230 163 L260 195 L320 195 M320 195 L375 155 M320 195 L375 235 M260 195 L230 290" ${body}/>` ,
    cablePull: `<rect x="95" y="250" width="90" height="24" rx="7" ${fill}/><rect x="180" y="120" width="20" height="145" rx="7" ${fill}/>${head(250,150)}<path d="M250 168 L285 205 L365 200 M365 200 L430 180" ${body}/><path d="M430 180 H485" ${accent}/><path d="M285 205 L250 310 M365 200 L365 315" ${body}/>` ,
    overheadPull: `<path d="M90 95 H420 M150 95 V155 M360 95 V155 M150 155 H360" ${accent}/>${head(255,220)}<path d="M255 238 L255 310 M255 265 L175 160 M255 265 L335 160 M255 310 L215 390 M255 310 L295 390" ${body}/>` ,
    facePull: `<path d="M80 115 V350 M80 230 L165 230" ${accent}/>${head(270,120)}<path d="M270 138 L270 230 M270 175 L210 195 M270 175 L330 195 M210 195 L155 230 M330 195 L155 240" ${body}/>` ,
    inclinePush: `<path d="M100 340 L200 220" ${accent}/><rect x="190" y="200" width="165" height="24" rx="8" ${fill}/>${head(235,160)}<path d="M235 178 L265 220 L335 220 M335 220 L390 170 M335 220 L390 270" ${body}/><rect x="382" y="150" width="25" height="50" rx="8" ${fill}/><rect x="382" y="255" width="25" height="50" rx="8" ${fill}/>` ,
    pallof: `<path d="M80 110 V350 M80 230 H165" ${accent}/>${head(265,120)}<path d="M265 138 L265 240 M265 180 H365 M365 180 L165 230 M265 240 L230 345 M265 240 L300 345" ${body}/>` ,
    squat: `<rect x="345" y="255" width="110" height="24" rx="8" ${fill}/>${head(235,95)}<path d="M235 113 L245 205 M245 165 L200 180 M245 165 L290 180 M245 205 L210 285 M245 205 L345 255" ${body}/><rect x="220" y="150" width="34" height="48" rx="8" ${fill}/>` ,
    standingPull: `<path d="M80 110 V350 M80 230 H160" ${accent}/>${head(285,100)}<path d="M285 118 L305 210 M305 165 L240 185 M305 165 L370 185 M240 185 L160 230 M370 185 L160 240 M305 210 L270 330 M305 210 L340 330" ${body}/>` ,
    stepUp: `<rect x="330" y="270" width="125" height="26" rx="8" ${fill}/>${head(220,100)}<path d="M220 118 L240 205 M240 165 L195 185 M240 165 L285 185 M240 205 L210 320 M240 205 L355 270" ${body}/>` ,
    bike: `<circle cx="150" cy="310" r="50" ${accent}/><circle cx="395" cy="310" r="50" ${accent}/><path d="M150 310 H245 L330 210 L395 310 M245 310 L280 250 L330 210 M245 310 L210 210 H330" ${accent}/>${head(250,110)}<path d="M250 128 L300 205 L365 205 M365 205 L400 170 M365 205 L405 245 M300 205 L260 290" ${body}/>` ,
    walk: `<path d="M100 330 H355 L425 225 H180 Z" ${accent}/>${head(260,105)}<path d="M260 123 L280 205 M280 165 L230 180 M280 165 L330 180 M280 205 L240 310 M280 205 L340 280" ${body}/>` ,
    floorMobility: `<path d="M90 330 H430" ${accent}/>${head(365,225)}<path d="M345 235 C300 190 245 190 190 245 M210 245 L175 330 M330 240 L365 330" ${body}/>` ,
    floorTwist: `<path d="M90 330 H430" ${accent}/>${head(185,205)}<path d="M203 218 L255 270 L330 270 M255 270 L185 330 M330 270 L390 320 M255 270 L355 205" ${body}/>` ,
    band: `${head(250,100)}<path d="M250 118 V225 M250 165 L155 175 M250 165 L345 175 M135 175 H365 M250 225 L220 340 M250 225 L280 340" ${body}/><path d="M135 175 H365" ${accent}/>` ,
    plank: `<path d="M90 330 H430" ${accent}/>${head(365,220)}<path d="M345 235 L285 255 L200 275 L125 295 M125 295 L105 330 M200 275 L185 330" ${body}/>`
  };
  return map[kind] || map.standingPull;
}

function makeExerciseVisual(id, ex) {
  const cues = visualCues[id] || ['Control', 'Postura', 'Sin dolor'];
  const title = escapeHTML(ex.name);
  const subtitle = escapeHTML(ex.tag);
  const cueRows = cues.map((cue, i) => {
    const y = 155 + i * 64;
    return `<circle cx="560" cy="${y - 7}" r="8" fill="#c68a58"/><text x="582" y="${y}" class="v-small">${escapeHTML(cue)}</text>`;
  }).join('');
  return `<svg class="inline-exercise-svg" viewBox="0 0 760 430" role="img" aria-label="Referencia visual de ${title}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .v-title{font:800 34px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;fill:#21272d}
      .v-sub{font:700 18px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;fill:#945f39;text-transform:uppercase;letter-spacing:.08em}
      .v-small{font:700 22px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;fill:#4b5563}
    </style>
    <rect width="760" height="430" rx="28" fill="#fff8ef"/>
    <rect x="22" y="22" width="716" height="386" rx="24" fill="#ffffff" stroke="#e8e0d7" stroke-width="2"/>
    <text x="48" y="70" class="v-title">${title}</text>
    <text x="48" y="102" class="v-sub">${subtitle}</text>
    <rect x="48" y="125" width="455" height="245" rx="22" fill="#eef3ef"/>
    ${svgFigure(visualKinds[id] || 'standingPull')}
    <rect x="530" y="125" width="180" height="245" rx="22" fill="#fffaf6" stroke="#e8e0d7" stroke-width="2"/>
    <text x="560" y="128" class="v-sub" transform="translate(0 -24)">Claves</text>
    ${cueRows}
  </svg>`;
}

function renderWorkout() {
  setTitle('Rutina');
  const checkin = getTodayCheckin();
  const plan = getPlanForDate();
  const status = adaptationStatus(checkin, plan);
  const exerciseIds = planExerciseIds(plan, status);
  const content = document.getElementById('content');

  if (plan.type === 'rest') {
    content.innerHTML = `
      <section class="card hero">
        <p class="eyebrow">Fin de semana libre</p>
        <h2>${plan.title}</h2>
        <p class="muted">No hay gimnasio hoy. Recomendación: 6,000-8,000 pasos suaves, agua y sueño.</p>
      </section>
    `;
    return;
  }

  content.innerHTML = `
    <section class="card">
      <div class="space-between">
        <div>
          <p class="eyebrow">${status.label}</p>
          <h2>${plan.title}</h2>
          <p class="muted">${plan.focus}</p>
        </div>
        <span class="badge ${status.color}">${exerciseIds.length} bloques</span>
      </div>
      <div class="notice small-text">Evitar: zancadas/lunges y cargas pesadas apoyadas en cuello. Si aparece dolor lumbar o cervical mayor a 5/10, reduce peso o cambia a recuperación.</div>
    </section>
    <section class="content" id="exerciseList"></section>
    <section class="card">
      <label>Nota general del entrenamiento <textarea id="workoutNote" placeholder="Ej: sentí espalda bien, tenis pesado, poco tiempo..."></textarea></label>
      <button class="primary full" id="finishWorkout" type="button">Finalizar entrenamiento</button>
    </section>
  `;

  const list = document.getElementById('exerciseList');
  exerciseIds.forEach(id => list.appendChild(makeExerciseCard(id, status)));
  document.getElementById('finishWorkout').addEventListener('click', finishWorkout);
}

function makeExerciseCard(id, status) {
  const tpl = document.getElementById('exerciseCardTemplate').content.cloneNode(true);
  const ex = exerciseLibrary[id];
  const card = tpl.querySelector('.exercise-card');
  const suggested = suggestedWeight(id);
  const isWeighted = suggested > 0;
  const last = lastLogsForExercise(id, 1)[0];
  tpl.querySelector('.exercise-tag').textContent = ex.tag;
  tpl.querySelector('.exercise-name').textContent = ex.name;
  const image = tpl.querySelector('.exercise-image');
  if (image) {
    image.src = exerciseImages[id] || '';
    image.alt = `Foto de referencia de ${ex.name}`;
  }
  tpl.querySelector('.prescription').textContent = status.mode === 'light' || status.mode === 'deload'
    ? `${ex.prescription} · versión controlada`
    : ex.prescription;
  tpl.querySelector('.weight-line').textContent = isWeighted
    ? `Peso recomendado hoy: ${suggested} lb${isDeloadWeek() ? ' (ajustado suave)' : ''}`
    : 'Peso recomendado hoy: peso corporal / máquina sin carga relevante';
  tpl.querySelector('.technique').textContent = ex.technique;
  const actualWeight = tpl.querySelector('.actual-weight');
  const actualReps = tpl.querySelector('.actual-reps');
  const actualRpe = tpl.querySelector('.actual-rpe');
  actualWeight.value = isWeighted ? suggested : 0;
  actualReps.value = last?.actualReps || '';
  actualRpe.value = last?.rpe || '';
  card.dataset.exerciseId = id;
  tpl.querySelector('.technique-toggle').addEventListener('click', () => card.querySelector('.technique').classList.toggle('hidden'));
  return tpl;
}

function finishWorkout() {
  const date = todayISO();
  const checkin = getTodayCheckin();
  const plan = getPlanForDate();
  const status = adaptationStatus(checkin, plan);
  const note = document.getElementById('workoutNote')?.value || '';
  const cards = [...document.querySelectorAll('.exercise-card')];
  let logged = 0;

  cards.forEach(card => {
    const id = card.dataset.exerciseId;
    const ex = exerciseLibrary[id];
    const actualWeight = Number(card.querySelector('.actual-weight').value || 0);
    const actualReps = Number(card.querySelector('.actual-reps').value || 0);
    const rpe = Number(card.querySelector('.actual-rpe').value || 0);
    if (actualReps === 0 && actualWeight === 0 && rpe === 0) return;
    state.logs.push({
      date,
      planTitle: plan.title,
      mode: status.mode,
      exerciseId: id,
      exerciseName: ex.name,
      actualWeight,
      actualReps,
      rpe,
      backPain: Number(checkin.backPain),
      neckPain: Number(checkin.neckPain),
      note
    });
    updateExerciseProgress(id, actualWeight, actualReps, rpe, checkin);
    logged++;
  });

  checkin.completed = true;
  state.checkins[date] = checkin;
  updateStreak();
  saveState();
  alert(logged ? 'Entrenamiento guardado. Próximos pesos ajustados.' : 'Guardado sin ejercicios registrados.');
  currentScreen = 'history';
  render();
}

function updateExerciseProgress(id, actualWeight, actualReps, rpe, checkin) {
  const ex = exerciseLibrary[id];
  if (!ex || ex.stepLb === 0) return;
  const pain = Math.max(Number(checkin.backPain), Number(checkin.neckPain));
  let next = actualWeight;
  let reason = 'mantener';
  if (pain >= 5 || rpe >= 9 || actualReps < 8) {
    next = Math.max(ex.stepLb, roundToStep(actualWeight * 0.9, ex.stepLb));
    reason = 'bajar por dolor/esfuerzo/reps bajas';
  } else if (actualReps >= 12 && rpe > 0 && rpe <= 7) {
    next = actualWeight + ex.stepLb;
    reason = 'subir por reps buenas y esfuerzo controlado';
  } else if (actualReps >= 10 && rpe <= 8) {
    next = actualWeight;
    reason = 'mantener y consolidar';
  }
  state.exerciseProgress[id] = {
    nextWeight: next,
    previousWeight: actualWeight,
    updatedAt: todayISO(),
    reason
  };
}

function roundToStep(value, step) {
  return Math.round(value / step) * step;
}

function updateStreak() {
  const dates = Object.keys(state.checkins).sort().reverse();
  let streak = 0;
  for (const iso of dates) {
    const d = new Date(iso + 'T00:00:00');
    const plan = plans[d.getDay()];
    if (plan.type === 'rest') continue;
    if (state.checkins[iso].completed) streak++;
    else break;
  }
  state.streak = streak;
}

function renderProgress() {
  setTitle('Progreso');
  const content = document.getElementById('content');
  const checkins = Object.values(state.checkins).sort((a, b) => a.date.localeCompare(b.date));
  const latest = checkins.at(-1) || getTodayCheckin();
  const first = checkins[0] || latest;
  const weightDelta = (Number(latest.weight) - Number(first.weight)).toFixed(1);
  const completed = Object.values(state.checkins).filter(c => c.completed).length;
  const avgScore = checkins.length ? Math.round(checkins.reduce((sum, c) => sum + computeDailyScore(c), 0) / checkins.length) : computeDailyScore();
  const avgSteps = checkins.length ? Math.round(checkins.reduce((sum, c) => sum + Number(c.steps || 0), 0) / checkins.length) : 0;

  content.innerHTML = `
    <section class="grid-2">
      <div class="metric"><strong>${latest.weight || '--'} lb</strong><span>Peso actual</span></div>
      <div class="metric"><strong>${weightDelta} lb</strong><span>Cambio registrado</span></div>
      <div class="metric"><strong>${completed}</strong><span>Sesiones completadas</span></div>
      <div class="metric"><strong>${avgScore}</strong><span>Score promedio</span></div>
    </section>
    <section class="card progress-wrap">
      <div class="space-between">
        <h2>Peso corporal</h2>
        <span class="badge">mensual</span>
      </div>
      <div class="chart" id="weightChart"></div>
      <p class="muted small-text">El objetivo es ver tendencia, no obsesionarse con un día.</p>
    </section>
    <section class="card progress-wrap">
      <h2>Hábitos base</h2>
      ${progressBar('Pasos promedio', avgSteps, 8000, `${avgSteps}/8000`)}
      ${progressBar('Score recuperación', avgScore, 100, `${avgScore}/100`)}
      ${progressBar('Consistencia', completed, 12, `${completed}/12 sesiones objetivo inicial`)}
    </section>
    <section class="card">
      <h2>Próximos pesos</h2>
      <div id="nextWeights"></div>
    </section>
  `;
  renderLineChart('weightChart', checkins.map(c => ({ label: formatDate(c.date), value: Number(c.weight || 0) })).filter(p => p.value > 0));
  renderNextWeights();
}

function progressBar(label, value, target, text) {
  const pct = Math.max(0, Math.min(100, Math.round(value / target * 100)));
  return `<div><div class="space-between"><strong>${label}</strong><span class="muted small-text">${text}</span></div><div class="bar"><span style="width:${pct}%"></span></div></div>`;
}

function renderLineChart(id, points) {
  const el = document.getElementById(id);
  if (!points.length) {
    el.innerHTML = '<p class="muted" style="padding:18px">Registra varios días para ver gráfico.</p>';
    return;
  }
  const values = points.map(p => p.value);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const width = 340, height = 160, pad = 22;
  const coords = points.map((p, i) => {
    const x = points.length === 1 ? width / 2 : pad + i * ((width - pad * 2) / (points.length - 1));
    const y = height - pad - ((p.value - min) / Math.max(1, max - min)) * (height - pad * 2);
    return [x, y];
  });
  const path = coords.map((c, i) => `${i ? 'L' : 'M'} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(' ');
  el.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico de peso">
      <path d="M ${pad} ${height-pad} L ${width-pad} ${height-pad}" stroke="#e8e0d7" stroke-width="2" fill="none" />
      <path d="${path}" stroke="#c68a58" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      ${coords.map((c, i) => `<circle cx="${c[0]}" cy="${c[1]}" r="4" fill="#21272d"><title>${points[i].label}: ${points[i].value} lb</title></circle>`).join('')}
      <text x="${pad}" y="18" font-size="12" fill="#6b7280">${max.toFixed(1)} lb</text>
      <text x="${pad}" y="${height-6}" font-size="12" fill="#6b7280">${min.toFixed(1)} lb</text>
    </svg>`;
}

function renderNextWeights() {
  const el = document.getElementById('nextWeights');
  const entries = Object.entries(state.exerciseProgress);
  if (!entries.length) {
    el.innerHTML = '<p class="muted">Cuando termines la primera rutina, aquí aparecerán los pesos sugeridos.</p>';
    return;
  }
  el.innerHTML = entries.map(([id, progress]) => `
    <div class="history-item">
      <strong>${exerciseLibrary[id]?.name || id}: ${progress.nextWeight} lb</strong>
      <span class="muted small-text">${progress.reason} · actualizado ${formatDate(progress.updatedAt)}</span>
    </div>
  `).join('');
}

function renderHistory() {
  setTitle('Historial');
  const content = document.getElementById('content');
  const grouped = state.logs.slice().reverse().reduce((acc, log) => {
    acc[log.date] ||= [];
    acc[log.date].push(log);
    return acc;
  }, {});
  const dates = Object.keys(grouped);
  content.innerHTML = `
    <section class="card">
      <h2>Resumen</h2>
      <div class="grid-3">
        <div class="metric"><strong>${state.logs.length}</strong><span>Ejercicios</span></div>
        <div class="metric"><strong>${dates.length}</strong><span>Días</span></div>
        <div class="metric"><strong>${state.streak}</strong><span>Racha</span></div>
      </div>
    </section>
    <section class="card" id="historyList">
      ${dates.length ? dates.map(date => `
        <div class="history-item">
          <div class="space-between"><strong>${formatDate(date)}</strong><span class="badge">${grouped[date][0].planTitle}</span></div>
          ${grouped[date].map(log => `<p class="small-text"><strong>${log.exerciseName}</strong>: ${log.actualWeight} lb · ${log.actualReps} reps · esfuerzo ${log.rpe || '-'}/10</p>`).join('')}
          ${grouped[date][0].note ? `<p class="muted small-text">Nota: ${escapeHTML(grouped[date][0].note)}</p>` : ''}
        </div>
      `).join('') : '<p class="muted">Todavía no hay entrenamientos guardados.</p>'}
    </section>
  `;
}

function renderProfile() {
  setTitle('Perfil');
  const p = state.profile;
  const content = document.getElementById('content');
  content.innerHTML = `
    <section class="card">
      <h2>Datos base</h2>
      <form id="profileForm">
        <div class="grid-2">
          <label>Nombre <input name="name" value="${escapeAttr(p.name)}"></label>
          <label>Edad <input name="age" type="number" value="${p.age}"></label>
          <label>Estatura <input name="height" value="${escapeAttr(p.height)}"></label>
          <label>Peso actual lb <input name="weightLb" type="number" step="0.1" value="${p.weightLb}"></label>
        </div>
        <label>Objetivo <textarea name="goal">${escapeHTML(p.goal)}</textarea></label>
        <label>Evitar <textarea name="avoid">${escapeHTML(p.avoid)}</textarea></label>
        <button class="primary full" type="submit">Guardar perfil</button>
      </form>
    </section>
    <section class="card">
      <h2>Reglas del programa</h2>
      <p><strong>Horario:</strong> ${p.trainingTime}</p>
      <p><strong>Tenis:</strong> martes y jueves cuentan como entrenamiento.</p>
      <p><strong>Fines de semana:</strong> libres.</p>
      <p><strong>Ciclo:</strong> 4 semanas. La semana 4 baja un poco la carga para recuperar articulaciones y volver a progresar.</p>
      <p><strong>Peso exacto:</strong> la primera semana calibra. Después, la app sube/mantiene/baja según reps, esfuerzo y dolor.</p>
    </section>
    <section class="card">
      <h2>Modo prueba</h2>
      <p class="muted small-text">Úsalo solo para revisar ejercicios de otros días sin cambiar la fecha del iPhone.</p>
      <form id="testModeForm">
        <label>Ver rutina como si fuera
          <select name="testDayOverride">
            <option value="" ${state.settings.testDayOverride === null || state.settings.testDayOverride === undefined || state.settings.testDayOverride === '' ? 'selected' : ''}>Día real automático</option>
            <option value="1" ${Number(state.settings.testDayOverride) === 1 ? 'selected' : ''}>Lunes · Pierna + glúteos</option>
            <option value="2" ${Number(state.settings.testDayOverride) === 2 ? 'selected' : ''}>Martes · Tenis + movilidad</option>
            <option value="3" ${Number(state.settings.testDayOverride) === 3 ? 'selected' : ''}>Miércoles · Torso + postura</option>
            <option value="4" ${Number(state.settings.testDayOverride) === 4 ? 'selected' : ''}>Jueves · Tenis + core</option>
            <option value="5" ${Number(state.settings.testDayOverride) === 5 ? 'selected' : ''}>Viernes · Full body funcional</option>
            <option value="6" ${Number(state.settings.testDayOverride) === 6 ? 'selected' : ''}>Sábado · Descanso</option>
            <option value="0" ${Number(state.settings.testDayOverride) === 0 ? 'selected' : ''}>Domingo · Descanso</option>
          </select>
        </label>
        <button class="secondary full" type="submit">Aplicar modo prueba</button>
      </form>
    </section>
    <section class="card">
      <h2>Versión y actualización</h2>
      <p class="muted">Versión instalada:</p>
      <p><strong>${APP_VERSION}</strong></p>
      <button class="secondary full" id="forceUpdate" type="button">Forzar actualización de la app</button>
    </section>
    <section class="card">
      <h2>Privacidad</h2>
      <p class="muted">Los datos se guardan en este navegador/dispositivo. No hay login, nube ni servidor.</p>
      <button class="danger full" id="resetData" type="button">Borrar todos los datos</button>
    </section>
  `;
  document.getElementById('profileForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    state.profile = {
      ...state.profile,
      name: String(form.get('name')),
      age: Number(form.get('age')),
      height: String(form.get('height')),
      weightLb: Number(form.get('weightLb')),
      goal: String(form.get('goal')),
      avoid: String(form.get('avoid'))
    };
    saveState();
    alert('Perfil guardado.');
    renderProfile();
  });
  document.getElementById('testModeForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = form.get('testDayOverride');
    state.settings.testDayOverride = value === '' ? null : Number(value);
    saveState();
    currentScreen = 'today';
    render();
  });
  const forceUpdateBtn = document.getElementById('forceUpdate');
  if (forceUpdateBtn) {
    forceUpdateBtn.addEventListener('click', async () => {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(reg => reg.unregister()));
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter(k => k.startsWith('danielafit')).map(k => caches.delete(k)));
        }
      } catch (error) {
        console.warn(error);
      }
      window.location.href = './index.html?v=7.0.0&fresh=' + Date.now();
    });
  }
  document.getElementById('resetData').addEventListener('click', () => {
    if (confirm('¿Borrar todos los datos de DanielaFit en este iPhone/navegador?')) {
      localStorage.removeItem(STORAGE_KEY);
      state = clone(defaultState);
      saveState();
      render();
    }
  });
}

function escapeHTML(str = '') {
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function escapeAttr(str = '') { return escapeHTML(str); }

function bootstrap() {
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentScreen = btn.dataset.screen;
      render();
      document.getElementById('content').focus({ preventScroll: false });
    });
  });
  getTodayCheckin();
  updateStreak();
  render();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=7.0.0').catch(console.warn);
    });
  }
}

bootstrap();
