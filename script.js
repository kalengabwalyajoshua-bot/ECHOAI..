// =======================================
// ECHOAI JAVASCRIPT – FULL VERSION
// =======================================

// ===== GLOBAL VARIABLES =====
let currentScreen = 'home';
let isVoiceCommandActive = false;
let conversationLog = [];
let responseHistory = [];

// ===== ELEMENT SELECTORS =====
const screens = document.querySelectorAll('.screen');
const buttons = document.querySelectorAll('button');
const storyButton = document.getElementById('bedtimeStoryButton');
const storyDisplay = document.getElementById('storyDisplay');

// ===== VOICE RECOGNITION SETUP =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    conversationLog.push(transcript);
    handleVoiceCommand(transcript);
};

recognition.onerror = (event) => console.error('Voice recognition error:', event.error);

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    screens.forEach(screen => screen.style.display = 'none');
    const target = document.getElementById(screenId);
    if(target) target.style.display = 'block';
    currentScreen = screenId;
}

// Initialize default screen
showScreen('home');

// ===== BUTTON EVENT LISTENERS =====
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        if(target) showScreen(target);
        if(button.id === 'voiceCommandBtn') toggleVoiceCommand();
        if(button.id === 'bedtimeStoryButton') tellBedtimeStory();
    });
});

// ===== VOICE COMMAND HANDLER =====
function toggleVoiceCommand() {
    isVoiceCommandActive = !isVoiceCommandActive;
    if(isVoiceCommandActive) recognition.start();
    else recognition.stop();
}

function handleVoiceCommand(command) {
    console.log('Voice command received:', command);

    // Navigation
    if(command.includes('go to home')) showScreen('home');
    else if(command.includes('go to explore')) showScreen('explore');
    else if(command.includes('go to profile')) showScreen('profile');
    else if(command.includes('bedtime story')) tellBedtimeStory();
    else if(command.includes('stop voice')) toggleVoiceCommand();
    else if(command.includes('suggest')) provideSuggestions(command);
    else respondToUser(command);
}

// ===== BEDTIME STORIES WITH LAYERED SOUND & SPEECH =====
const bedtimeStories = [
    "Once upon a time, in a land of sparkling stars, there lived a little fox who loved to dance under the moonlight.",
    "A tiny owl named Ollie wanted to see the world. One night, he flew past mountains and rivers and discovered the beauty of the forest.",
    "Deep in the ocean, a curious little dolphin named Daisy learned that friendship and kindness were the greatest treasures of all.",
    "In a quiet village, a magical tree told stories to children who believed in dreams, filling their hearts with wonder.",
    "In a mysterious forest, a glowing firefly guided a young adventurer through shadows, teaching courage and curiosity."
];

// Online thrilling sound effects
const soundEffects = [
    "https://www.soundjay.com/horror/sounds/horror-1.mp3",
    "https://www.soundjay.com/horror/sounds/horror-2.mp3",
    "https://www.soundjay.com/horror/sounds/horror-3.mp3",
    "https://www.soundjay.com/misc/sounds/magic-chime-1.mp3"
];

function playLayeredSounds() {
    soundEffects.forEach(url => {
        const audio = new Audio(url);
        audio.volume = 0.3;
        audio.play();
    });
}

function tellBedtimeStory() {
    const storyIndex = Math.floor(Math.random() * bedtimeStories.length);
    const story = bedtimeStories[storyIndex];

    if(storyDisplay) storyDisplay.innerText = story;
    showScreen('bedtimeStoryScreen');

    // Play layered sounds
    playLayeredSounds();

    // Read story aloud
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(story);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, 500);
}

// ===== DYNAMIC AI-STYLE RESPONSES =====
const genericResponses = [
    "Interesting! Can you tell me more?",
    "Wow, I never thought of that!",
    "Hmm… let's explore that idea further.",
    "Fascinating! Do you want me to suggest something?",
    "I like your creativity. Want a related story?"
];

const questionResponses = [
    "That's a great question! Let me think...",
    "I think I have an idea for that.",
    "Hmm… let's figure this out together.",
    "Interesting question! I can also suggest a fun fact."
];

const suggestionResponses = [
    "Here’s something fun you can try!",
    "I have an idea for you!",
    "How about this activity?",
    "This might spark your interest!"
];

function respondToUser(text) {
    conversationLog.push({user: text});

    let response = "";

    if(text.includes('hello') || text.includes('hi')) {
        response = "Hello there! Would you like a bedtime story or some suggestions?";
    } else if(text.includes('story')) {
        response = "I have some thrilling bedtime stories ready. Want me to tell one?";
    } else if(text.includes('suggest')) {
        response = "Sure! I can give you some interesting suggestions.";
        provideSuggestions();
        return;
    } else if(text.includes('how') || text.includes('what') || text.includes('why')) {
        response = questionResponses[Math.floor(Math.random() * questionResponses.length)];
    } else {
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }

    responseHistory.push(response);

    // Speak response
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.pitch = 1.1 + Math.random() * 0.2; // slightly dynamic
    utterance.rate = 0.9 + Math.random() * 0.2;
    window.speechSynthesis.speak(utterance);
}

// ===== SUGGESTIONS FEATURE =====
const suggestionsList = [
    "Try a thrilling bedtime story tonight!",
    "Explore a new science topic.",
    "Play an educational game to sharpen your mind.",
    "Read an interesting short story.",
    "Try a mini challenge or puzzle.",
    "Learn a fun fact about space or animals."
];

function provideSuggestions() {
    const suggestionIndex = Math.floor(Math.random() * suggestionsList.length);
    const suggestion = suggestionsList[suggestionIndex];

    const utterance = new SpeechSynthesisUtterance(suggestion);
    utterance.pitch = 1.1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
}

// ===== CHAT INTERACTION ENHANCEMENTS =====
function interactiveFollowUp() {
    // Pick a random follow-up after each response
    const followUps = [
        "Do you want another story?",
        "Should I give you another suggestion?",
        "Do you want to explore a new screen?",
        "Do you want me to explain more?"
    ];

    const followUpIndex = Math.floor(Math.random() * followUps.length);
    const followUp = followUps[followUpIndex];

    const utterance = new SpeechSynthesisUtterance(followUp);
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    setTimeout(() => window.speechSynthesis.speak(utterance), 1000);
}

// ===== BACK BUTTON HANDLING =====
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') showScreen('home');
});

// ===== FUTURE PROOF PLACEHOLDER =====
// You can later add:
// - Quizzes & exercises
// - Music playlist integration
// - More interactive stories
// - Adaptive AI learning user preferences

console.log("EchoAI JS loaded – ready for full interaction!");
