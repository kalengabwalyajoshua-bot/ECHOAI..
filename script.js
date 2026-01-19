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

recognition.onerror = (event) => {
    console.error('Voice recognition error:', event.error);
};

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
    if(isVoiceCommandActive) {
        recognition.start();
        console.log('Voice command activated');
    } else {
        recognition.stop();
        console.log('Voice command deactivated');
    }
}

function handleVoiceCommand(command) {
    console.log('Voice command received:', command);

    // Navigation commands
    if(command.includes('go to home')) showScreen('home');
    else if(command.includes('go to explore')) showScreen('explore');
    else if(command.includes('bedtime story')) tellBedtimeStory();
    else if(command.includes('stop voice')) toggleVoiceCommand();

    // Auto-suggestions
    else if(command.includes('suggest')) provideSuggestions(command);

    // Default: respond to everything
    else {
        respondToUser(command);
    }
}

// ===== BEDTIME STORIES WITH SOUND =====
const bedtimeStories = [
    "Once upon a time, in a land of sparkling stars, there lived a little fox who loved to dance under the moonlight.",
    "A tiny owl named Ollie wanted to see the world. One night, he flew past mountains and rivers and discovered the beauty of the forest.",
    "Deep in the ocean, a curious little dolphin named Daisy learned that friendship and kindness were the greatest treasures of all.",
    "In a quiet village, a magical tree told stories to children who believed in dreams, filling their hearts with wonder."
];

const soundEffects = [
    "sounds/thrill1.mp3",
    "sounds/thrill2.mp3",
    "sounds/thrill3.mp3"
];

function tellBedtimeStory() {
    // Random story
    const storyIndex = Math.floor(Math.random() * bedtimeStories.length);
    const story = bedtimeStories[storyIndex];
    
    // Random sound effect
    const soundIndex = Math.floor(Math.random() * soundEffects.length);
    const sound = new Audio(soundEffects[soundIndex]);
    sound.volume = 0.6;
    sound.play();

    if(storyDisplay) storyDisplay.innerText = story;
    showScreen('bedtimeStoryScreen');
}

// ===== RESPOND TO EVERYTHING USER SAYS =====
function respondToUser(text) {
    // Log conversation
    conversationLog.push({user: text});

    // Simple AI-style response
    let response = "";
    if(text.includes('hello') || text.includes('hi')) response = "Hello! Would you like a bedtime story or some suggestions?";
    else if(text.includes('story')) response = "I have some thrilling bedtime stories ready. Want me to tell one?";
    else if(text.includes('suggest')) response = "I can suggest games, exercises, or interesting trivia for you!";
    else response = "That's interesting! I can tell a story, give suggestions, or just chat.";

    // Output response visually
    alert(response); // Replace with fancy chat display later if needed
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

    alert("Suggestion: " + suggestion);
}

// ===== BACK BUTTON HANDLING =====
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') showScreen('home');
});

// ===== EXTRA FEATURES =====
// Future AI enhancements, quizzes, music, exercises, and interactive chats can be added here
