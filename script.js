// ==========================
// EchoAI - script.js
// Author: Joshua
// Version: 1.0
// ==========================

// Grab DOM elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const storyAudio = document.getElementById('story-audio');

const btnStory = document.getElementById('btn-story');
const btnSound = document.getElementById('btn-sound');
const btnFun = document.getElementById('btn-fun');
const btnMood = document.getElementById('btn-mood');
const btnSurprise = document.getElementById('btn-surprise');

// ==========================
// Utility Functions
// ==========================

// Scroll chat to bottom
function scrollChat() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Create a message bubble
function createMessage(message, type='echoai') {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = message;
    chatContainer.appendChild(msg);
    scrollChat();
}

// Play audio with optional loop
function playAudio(src, loop=false) {
    storyAudio.src = src;
    storyAudio.loop = loop;
    storyAudio.play().catch(err => console.error("Audio playback failed:", err));
}

// Stop audio
function stopAudio() {
    storyAudio.pause();
    storyAudio.currentTime = 0;
}

// ==========================
// AI Responses & Stories
// ==========================

// Sample dynamic responses
const responses = [
    "I see... very interesting.",
    "The darkness approves of your words.",
    "Hmm... EchoAI hears you.",
    "Careful what you ask, mortal.",
    "Your thoughts are deliciously chaotic.",
    "Ah, a curious mind. I like it.",
    "The night is alive, and so am I.",
    "EchoAI whispers secrets you can't imagine.",
    "Interesting choice of words...",
    "Do you dare ask more?"
];

// Bedtime stories array
const stories = [
    {
        title: "The Crimson Forest",
        text: "Once upon a time, in a forest painted in crimson, shadows danced and whispered secrets only the brave could hear. Deep inside, a lone wanderer discovered a glowing orb that held the power to bend reality itself...",
        audio: "audio/crimson_forest.mp3"
    },
    {
        title: "The Phantom Lighthouse",
        text: "High atop the cliff, the lighthouse stood, untouched for centuries. But when the storm arrived, its light revealed spectral figures roaming the cliffs, guiding some to safety and luring others into the abyss...",
        audio: "audio/phantom_lighthouse.mp3"
    },
    {
        title: "The Midnight Circus",
        text: "Under the cover of midnight, the circus appeared with no invitation. Creatures of magic performed impossible feats, and one boy discovered that the ringmaster had the power to see into his very soul...",
        audio: "audio/midnight_circus.mp3"
    },
    {
        title: "The Whispering Tomb",
        text: "Beneath the old city lay tombs that whispered forgotten names. One explorer, drawn by curiosity, unlocked a sarcophagus only to awaken the echoes of a civilization lost to time...",
        audio: "audio/whispering_tomb.mp3"
    },
    {
        title: "The Dark Carnival",
        text: "Every hundred years, the Dark Carnival rises from the shadows. Its attractions promise wonder but carry hidden curses. Only those who face their fears could leave unscathed...",
        audio: "audio/dark_carnival.mp3"
    }
];

// Random utility
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// EchoAI response to user input
function handleUserInput(input) {
    input = input.trim();
    if (!input) return;

    createMessage(input, 'user');

    // Special commands
    if (input.toLowerCase().includes('story')) {
        tellStory();
    } else if (input.toLowerCase().includes('sound')) {
        playRandomSound();
    } else if (input.toLowerCase().includes('mood')) {
        playMoodMusic();
    } else if (input.toLowerCase().includes('surprise')) {
        surpriseAction();
    } else {
        // Default AI response
        const response = getRandomItem(responses);
        setTimeout(() => createMessage(response, 'echoai'), 700);
    }

    userInput.value = '';
}

// ==========================
// Feature Functions
// ==========================

function tellStory() {
    const story = getRandomItem(stories);
    storyText.textContent = story.text;
    playAudio(story.audio, false);
    createMessage(`EchoAI tells a story: "${story.title}"`, 'echoai');
}

function playRandomSound() {
    const sounds = [
        'audio/sound1.mp3',
        'audio/sound2.mp3',
        'audio/sound3.mp3'
    ];
    const sound = getRandomItem(sounds);
    playAudio(sound);
    createMessage('EchoAI plays a mysterious sound...', 'echoai');
}

function playMoodMusic() {
    const music = [
        'audio/mood_dark.mp3',
        'audio/mood_chill.mp3'
    ];
    const track = getRandomItem(music);
    playAudio(track, true);
    createMessage('EchoAI sets the mood...', 'echoai');
}

function surpriseAction() {
    const actions = [
        'A shadow flickers across the room...',
        'Whispers fill your ears...',
        'A chill runs down your spine...',
        'EchoAI laughs softly in the dark...',
        'Something stirs in the corner of your eye...'
    ];
    createMessage(getRandomItem(actions), 'echoai');
    const surpriseSound = 'audio/surprise.mp3';
    playAudio(surpriseSound);
}

// ==========================
// Event Listeners
// ==========================

sendBtn.addEventListener('click', () => handleUserInput(userInput.value));
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserInput(userInput.value);
});

btnStory.addEventListener('click', tellStory);
btnSound.addEventListener('click', playRandomSound);
btnMood.addEventListener('click', playMoodMusic);
btnSurprise.addEventListener('click', surpriseAction);
btnFun.addEventListener('click', () => {
    createMessage('EchoAI performs a playful trick!', 'echoai');
    playAudio('audio/fun_trick.mp3');
});

// ==========================
// Initial Setup
// ==========================

createMessage("EchoAI is online. Speak wisely, mortal...", 'echoai');

// ==========================
// Additional Dynamic Features
// ==========================

// Typewriter effect for story text
function typeWriter(text, element, speed=30) {
    element.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Override tellStory to include typewriter
function tellStory() {
    const story = getRandomItem(stories);
    typeWriter(story.text, storyText, 35);
    playAudio(story.audio, false);
    createMessage(`EchoAI tells a story: "${story.title}"`, 'echoai');
}

// ==========================
// Background animations (optional)
// ==========================

document.body.style.background = "radial-gradient(circle at top, #0f0f0f, #1a1a1a)";
setInterval(() => {
    const r = Math.floor(Math.random() * 50 + 50);
    const g = 0;
    const b = Math.floor(Math.random() * 50);
    document.body.style.background = `radial-gradient(circle at top, rgb(${r},${g},${b}), #1a1a1a)`;
}, 10000);

// ==========================
// END OF SCRIPT
// ==========================
