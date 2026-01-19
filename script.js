// ===============================
// EchoAI JS - Full Version
// ===============================

// Grab DOM elements
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");
const btnStory = document.getElementById("btnStory");
const btnClear = document.getElementById("btnClear");

// ===============================
// Stories Array
// ===============================
const stories = [
    {
        title: "The Crimson Forest",
        text: "Once upon a time in a crimson forest, shadows danced and whispered secrets only the brave could hear. The trees moved as if alive, and faint whispers called your name...",
        audio: "story1.mp3"
    },
    {
        title: "The Phantom Lighthouse",
        text: "High atop the cliff, the lighthouse stood untouched for centuries. When the storm arrived, its light revealed spectral figures wandering along the rocks, searching for lost sailors...",
        audio: "story2.mp3"
    },
    {
        title: "The Midnight Circus",
        text: "Under the cover of midnight, the circus appeared with no invitation. Creatures of magic performed impossible feats, and every corner of the big top hid a secret too dark to see in the daylight...",
        audio: "story3.mp3"
    },
    {
        title: "The Whispering Tomb",
        text: "Beneath the old city lay tombs that whispered forgotten names. One explorer unlocked a sarcophagus, only to awaken echoes of voices long gone, telling tales of betrayal and revenge...",
        audio: "story4.mp3"
    },
    {
        title: "The Dark Carnival",
        text: "Every hundred years, the Dark Carnival rises from the shadows. Its attractions promise wonder but carry hidden curses. Step inside, and you may never leave the same as you were...",
        audio: "story5.mp3"
    }
];

// ===============================
// AI Random Responses
// ===============================
const aiResponses = [
    "I see... very interesting.",
    "The darkness approves of your words.",
    "EchoAI hears you.",
    "Careful what you ask, mortal.",
    "Your thoughts are deliciously chaotic.",
    "Hmm, a curious mind. I like it.",
    "The shadows are listening closely.",
    "Curiosity has its price, watch out.",
    "Your words echo through eternity.",
    "Fascinating, very fascinating.",
    "I sense mischief in your intentions.",
    "The unseen watches you carefully.",
    "Ah, yes, I know exactly what you mean...",
    "Beware the secrets that speak back.",
    "Interesting thought... tell me more."
];

// ===============================
// Create chat message
// ===============================
function createMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;

    // Add animation for EchoAI messages
    if (sender === "echoai") {
        msg.classList.add("animate-response");
    }

    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===============================
// Play audio for story
// ===============================
function playAudio(audioPath) {
    const audio = new Audio(audioPath);
    audio.volume = 0.7; // slightly softer
    audio.play().catch(err => console.log("Audio error:", err));
}

// ===============================
// Handle user input
// ===============================
function handleUserInput() {
    const input = userInput.value.trim();
    if (!input) return;

    createMessage(input, "user"); // show user message
    userInput.value = "";

    // Determine AI response type
    setTimeout(() => {
        if (input.toLowerCase().includes("story")) {
            tellStory(); // automatically triggers story if user types "story"
        } else {
            // fallback AI response
            const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            createMessage(aiResponse, "echoai");
        }
    }, 500);

    // Optional: tiny suspense delay before AI response
    setTimeout(() => chatContainer.scrollTop = chatContainer.scrollHeight, 100);
}

// ===============================
// Tell random story
// ===============================
function tellStory() {
    const story = stories[Math.floor(Math.random() * stories.length)];

    // EchoAI announces the story title
    createMessage(`📖 ${story.title}`, "echoai");

    // Typewriter-style text effect
    let i = 0;
    const text = story.text;
    const typingSpeed = 20;

    const typeInterval = setInterval(() => {
        if (i < text.length) {
            const msg = document.createElement("div");
            msg.classList.add("message", "echoai");
            msg.innerText = text.substring(0, i + 1);
            chatContainer.appendChild(msg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, typingSpeed);

    // Play audio
    playAudio(story.audio);
}

// ===============================
// Clear chat
// ===============================
function clearChat() {
    chatContainer.innerHTML = "";
}

// ===============================
// Event Listeners
// ===============================
sendBtn.addEventListener("click", handleUserInput);
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") handleUserInput();
});
btnStory.addEventListener("click", tellStory);

// Optional clear button if you add one in HTML
if (btnClear) btnClear.addEventListener("click", clearChat);

// ===============================
// Extra Features
// ===============================

// Animated background effect
function animateBackground() {
    chatContainer.style.background = `radial-gradient(circle at ${Math.random()*100}% ${Math.random()*100}%, #1b1b1b, #000000)`;
}
setInterval(animateBackground, 8000);

// Random AI whispers
function randomWhisper() {
    const whispers = [
        "The shadows move...",
        "Can you hear them?",
        "EchoAI remembers...",
        "The unseen eyes watch...",
        "Beware the unknown..."
    ];
    if (Math.random() < 0.05) { // 5% chance every call
        createMessage(whispers[Math.floor(Math.random() * whispers.length)], "echoai");
    }
}
setInterval(randomWhisper, 7000);
