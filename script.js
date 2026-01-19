// ===============================
// EchoAI JS - Compatible Version
// ===============================

// Grab DOM elements
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");
const btnStory = document.getElementById("btnStory");

// ===============================
// Stories
// ===============================
const stories = [
    { title: "The Crimson Forest", text: "Once upon a time in a crimson forest, shadows danced and whispered secrets only the brave could hear...", audio: "story1.mp3" },
    { title: "The Phantom Lighthouse", text: "High atop the cliff, the lighthouse stood untouched for centuries. When the storm arrived, its light revealed spectral figures wandering along the rocks...", audio: "story2.mp3" },
    { title: "The Midnight Circus", text: "Under the cover of midnight, the circus appeared with no invitation. Creatures of magic performed impossible feats...", audio: "story3.mp3" },
    { title: "The Whispering Tomb", text: "Beneath the old city lay tombs that whispered forgotten names. One explorer unlocked a sarcophagus, only to awaken echoes of voices long gone...", audio: "story4.mp3" },
    { title: "The Dark Carnival", text: "Every hundred years, the Dark Carnival rises from the shadows. Its attractions promise wonder but carry hidden curses...", audio: "story5.mp3" }
];

// ===============================
// AI Responses
// ===============================
const aiResponses = [
    "I see... very interesting.",
    "The darkness approves of your words.",
    "EchoAI hears you.",
    "Careful what you ask, mortal.",
    "Your thoughts are deliciously chaotic.",
    "Hmm, a curious mind. I like it.",
    "The shadows are listening closely.",
    "Curiosity has its price, watch out."
];

// ===============================
// Chat message function
// ===============================
function createMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    if (sender === "echoai") msg.classList.add("animate-response");
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===============================
// Audio playback with mobile fix
// ===============================
let audioAllowed = false;
let pendingAudio = null;

function playAudio(path) {
    const audio = new Audio(path);
    audio.volume = 0.7;
    if (!audioAllowed) {
        pendingAudio = audio;
        return;
    }
    audio.play().catch(err => console.log("Audio error:", err));
}

function enableAudio() {
    if (!audioAllowed) {
        audioAllowed = true;
        if (pendingAudio) pendingAudio.play().catch(err => console.log("Audio error after interaction:", err));
        pendingAudio = null;
        document.removeEventListener("click", enableAudio);
        document.removeEventListener("touchstart", enableAudio);
    }
}
document.addEventListener("click", enableAudio);
document.addEventListener("touchstart", enableAudio);

// ===============================
// User input
// ===============================
function handleUserInput() {
    const input = userInput.value.trim();
    if (!input) return;
    createMessage(input, "user");
    userInput.value = "";

    setTimeout(() => {
        if (input.toLowerCase().includes("story")) tellStory();
        else {
            const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            createMessage(aiResponse, "echoai");
        }
    }, 500);
}

// ===============================
// Tell a story
// ===============================
function tellStory() {
    const story = stories[Math.floor(Math.random() * stories.length)];
    createMessage(`📖 ${story.title}`, "echoai");

    // Typewriter effect
    let i = 0;
    const text = story.text;
    const speed = 20;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            const msg = document.createElement("div");
            msg.classList.add("message", "echoai");
            msg.innerText = text.substring(0, i + 1);
            chatContainer.appendChild(msg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            i++;
        } else clearInterval(typeInterval);
    }, speed);

    playAudio(story.audio);
}

// ===============================
// Event listeners
// ===============================
sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") handleUserInput(); });
btnStory.addEventListener("click", tellStory);

// ===============================
// Extra: animated background
// ===============================
function animateBackground() {
    chatContainer.style.background = `radial-gradient(circle at ${Math.random()*100}% ${Math.random()*100}%, #1b1b1b, #000000)`;
}
setInterval(animateBackground, 8000);

// Extra: random whispers
function randomWhisper() {
    const whispers = ["The shadows move...", "Can you hear them?", "EchoAI remembers...", "The unseen eyes watch...", "Beware the unknown..."];
    if (Math.random() < 0.05) createMessage(whispers[Math.floor(Math.random() * whispers.length)], "echoai");
}
setInterval(randomWhisper, 7000);
