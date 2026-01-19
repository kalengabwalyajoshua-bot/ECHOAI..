/* ========= CORE ========= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec, listening = false, awakened = false;

const log = document.getElementById("log");
const dot = document.getElementById("dot");
const status = document.getElementById("status");
const emotionEl = document.getElementById("emotion");

/* ========= MEMORY ========= */
const memKey = "echoai_memory";
let mem = JSON.parse(localStorage.getItem(memKey)) || {
  visits: 0,
  lastEmotion: "Neutral",
  favorite: "home",
  commands: {}
};
mem.visits++; saveMem();

function saveMem() {
  localStorage.setItem(memKey, JSON.stringify(mem));
}

/* ========= SPEAK ========= */
function speak(text, rate = 1) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  speechSynthesis.speak(u);
}

/* ========= LOG ========= */
function write(text, user = false) {
  const p = document.createElement("p");
  p.innerHTML = user ? `<strong>You:</strong> ${text}` : `<strong>EchoAI:</strong> ${text}`;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

/* ========= EMOTION ========= */
function detectEmotion(t) {
  t = t.toLowerCase();
  if (/happy|great|awesome|excited|good/.test(t)) return "Happy";
  if (/sad|tired|down|lonely|upset/.test(t)) return "Sad";
  if (/angry|mad|hate|stressed|annoyed/.test(t)) return "Angry";
  return "Neutral";
}

function applyEmotion(e) {
  emotionEl.textContent = "Emotion: " + e;
  emotionEl.style.color =
    e === "Happy" ? "var(--happy)" :
    e === "Sad" ? "var(--sad)" :
    e === "Angry" ? "var(--angry)" : "var(--neutral)";
  mem.lastEmotion = e;
  saveMem();
}

/* ========= START / STOP ========= */
function start() {
  if (!SR) return alert("Speech not supported");
  if (listening) return;

  rec = new SR();
  rec.continuous = true;
  rec.lang = "en-US";

  rec.onstart = () => {
    listening = true;
    dot.classList.add("active");
    status.textContent = "Listening for wake word";
    write("Listening started");
    if (mem.visits > 1) speak("Welcome back");
  };

  rec.onresult = e => {
    const t = e.results[e.results.length - 1][0].transcript.trim();
    write(t, true);
    processSpeech(t);
  };

  rec.onend = () => { if (listening) rec.start(); };
  rec.start();
}

function stop() {
  listening = false;
  rec?.stop();
  dot.classList.remove("active");
  status.textContent = "Stopped";
  speak("Voice control stopped");
  write("Stopped");
}

/* ========= PROCESS ========= */
function processSpeech(text) {
  const t = text.toLowerCase();

  if (!awakened) {
    if (t.includes("echo")) {
      awakened = true;
      status.textContent = "Awakened";
      speak("Yes Joshua");
      write("Wake word detected");
    }
    return;
  }
  awakened = false;

  const emo = detectEmotion(t);
  applyEmotion(emo);

  if (t.includes("home")) cmd("home");
  else if (t.includes("dashboard")) cmd("dashboard");
  else if (t.includes("messages")) cmd("messages");
  else if (t.includes("friends")) cmd("friends");
  else if (t.includes("profile")) cmd("profile");
  else if (t.includes("hello")) respond("Hello Joshua", emo);
  else respond("I heard you", emo);
}

function respond(msg, emo) {
  const rate = emo === "Happy" ? 1.05 : emo === "Sad" ? 0.9 : 1;
  speak(msg, rate);
  write(msg);
}

/* ========= COMMAND ========= */
function cmd(page) {
  mem.commands[page] = (mem.commands[page] || 0) + 1;
  mem.favorite = page;
  saveMem();
  respond("Opening " + page, mem.lastEmotion);
  activate(page);
}

function activate(page) {
  document.querySelectorAll(".nav button").forEach(b => {
    b.classList.remove("active");
    if (b.textContent.toLowerCase().includes(page)) b.classList.add("active");
  });
  write("Opened " + page);
}

function go(page) {
  activate(page);
}
