// ===== GLOBAL VARIABLES =====
let currentScreen = 'home';
let isVoiceCommandActive = false;
let conversationLog = [];

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
    if(command.includes('go to home')) showScreen('home');
    else if(command.includes('go to explore')) showScreen('explore');
    else if(command.includes('bedtime story')) tellBedtimeStory();
    else if(command.includes('stop voice')) toggleVoiceCommand();
    else if(command.includes('suggest')) provideSuggestions(command);
    else respondToUser(command);
}

// ===== BEDTIME STORIES WITH LAYERED SOUNDS =====
const bedtimeStories = [
    "Once upon a time, in a land of sparkling stars, there lived a little fox who loved to dance under the moonlight.",
    "A tiny owl named Ollie wanted to see the world. One night, he flew past mountains and rivers and discovered the beauty of the forest.",
    "Deep in the ocean, a curious little dolphin named Daisy learned that friendship and kindness were the greatest treasures of all.",
    "In a quiet village, a magical tree told stories to children who believed in dreams, filling their hearts with wonder."
];

// Multiple online sound effects
const soundEffects = [
    "https://www.soundjay.com/horror/sounds/horror-1.mp3",
    "https://www.soundjay.com/horror/sounds/horror-2.mp3",
    "https://www.soundjay.com/horror/sounds/horror-3.mp3"
];

// Play multiple sounds layered
function playLayeredSounds() {
    soundEffects.forEach(url => {
        const sound = new Audio(url);
        sound.volume = 0.3; // lower volume for layering
        sound.play();
    });
}

function tellBedtimeStory() {
    const storyIndex = Math.floor(Math.random() * bedtimeStories.length);
    const story = bedtimeStories[storyIndex];

    if(storyDisplay) storyDisplay.innerText = story;
    showScreen('bedtimeStoryScreen');

    // Play layered sounds immediately
    playLayeredSounds();

    // Small delay so sounds start before story
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(story);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }, 500);
}

// ===== RESPOND TO EVERYTHING USER SAYS =====
function respondToUser(text) {
    conversationLog.push({user: text});
    let response = "";
    if(text.includes('hello') || text.includes('hi')) response = "Hello! Would you like a bedtime story or some suggestions?";
    else if(text.includes('story')) response = "I have some thrilling bedtime stories ready. Want me to tell one?";
    else if(text.includes('suggest')) response = "I can suggest games, exercises, or interesting trivia for you!";
    else response = "That's interesting! I can tell a story, give suggestions, or just chat.";

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
}

// ===== PROVIDE SUGGESTIONS =====
function provideSuggestions(command) {
    const suggestions = [
        "Try a thrilling bedtime story tonight!",
        "How about exploring a new topic in science?",
        "You could play an educational game to sharpen your mind.",
        "Want me to tell a fun fact?"
    ];
    const suggestionIndex = Math.floor(Math.random() * suggestions.length);
    const suggestion = suggestions[suggestionIndex];

    const utterance = new SpeechSynthesisUtterance(suggestion);
    window.speechSynthesis.speak(utterance);
}

// ===== BACK BUTTON =====
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') showScreen('home');
});
