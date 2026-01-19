/* ===========================================
   ECHOAI SCRIPT.JS
   Full functionality
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------
       VARIABLES
    ----------------------------- */
    const screens = document.querySelectorAll(".screen");
    const navButtons = document.querySelectorAll("#bottom-navigation button");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const chatLog = document.getElementById("chat-log");
    const voiceBtn = document.getElementById("chat-voice-btn");
    const voiceOverlay = document.getElementById("voice-overlay");
    const permissionModal = document.getElementById("permission-modal");
    const permissionAllowBtn = permissionModal?.querySelector("[data-permission='allow']");
    const permissionDenyBtn = permissionModal?.querySelector("[data-permission='deny']");
    const recoveryScreen = document.getElementById("screen-recovery");
    const recoveryBtn = recoveryScreen?.querySelector("[data-recovery='restart']");
    const bootScreen = document.getElementById("screen-boot");
    const bootProgress = document.querySelector(".boot-progress");
    const backgroundHeartbeat = document.getElementById("background-heartbeat");

    let currentScreen = "boot";

    /* -----------------------------
       FUNCTIONS
    ----------------------------- */
    function showScreen(screenId){
        screens.forEach(screen => {
            if(screen.dataset.screen === screenId){
                screen.classList.add("screen-active");
                screen.setAttribute("aria-hidden", "false");
            } else {
                screen.classList.remove("screen-active");
                screen.setAttribute("aria-hidden", "true");
            }
        });

        navButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.nav === screenId);
        });

        currentScreen = screenId;
    }

    function sendMessage(){
        if(!chatInput.value.trim()) return;

        const userMsg = document.createElement("div");
        userMsg.classList.add("message","user");
        userMsg.textContent = chatInput.value.trim();
        chatLog.appendChild(userMsg);

        chatInput.value = "";
        chatLog.scrollTop = chatLog.scrollHeight;

        const echoMsg = document.createElement("div");
        echoMsg.classList.add("message","echo");
        echoMsg.textContent = "EchoAI will respond here...";
        chatLog.appendChild(echoMsg);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /* -----------------------------
       BOTTOM NAVIGATION
    ----------------------------- */
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => showScreen(btn.dataset.nav));
    });

    /* -----------------------------
       CHAT EVENTS
    ----------------------------- */
    chatSendBtn?.addEventListener("click", sendMessage);
    chatInput?.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });

    /* -----------------------------
       VOICE OVERLAY
    ----------------------------- */
    voiceBtn?.addEventListener("click", () => {
        voiceOverlay.classList.toggle("active");
    });

    /* -----------------------------
       PERMISSION MODAL
    ----------------------------- */
    permissionAllowBtn?.addEventListener("click", () => {
        permissionModal.classList.remove("active");
        console.log("Permission allowed");
    });
    permissionDenyBtn?.addEventListener("click", () => {
        permissionModal.classList.remove("active");
        console.log("Permission denied");
    });

    /* -----------------------------
       RECOVERY SCREEN
    ----------------------------- */
    recoveryBtn?.addEventListener("click", () => {
        recoveryScreen.classList.remove("screen-active");
        showScreen("home");
    });

    /* -----------------------------
       ANDROID / BACK BUTTON
    ----------------------------- */
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        if(currentScreen !== "home"){
            showScreen("home");
            window.history.pushState(null, "", window.location.href);
        }
    });

    /* -----------------------------
       BOOT LOADER
    ----------------------------- */
    if(bootScreen && bootProgress){
        let progress = 0;
        bootScreen.classList.add("screen-active");

        const bootInterval = setInterval(() => {
            progress += Math.random() * 5;
            if(progress >= 100){
                progress = 100;
                clearInterval(bootInterval);
                bootScreen.classList.remove("screen-active");
                showScreen("home");
            }
            bootProgress.style.width = `${progress}%`;
        }, 100);
    }

    /* -----------------------------
       BACKGROUND HEARTBEAT
    ----------------------------- */
    if(backgroundHeartbeat){
        setInterval(() => {
            backgroundHeartbeat.dataset.heartbeat = Date.now();
        }, 2000);
    }

    /* -----------------------------
       DEVELOPER HOOKS
    ----------------------------- */
    window.devEchoAI = {
        showScreen: showScreen,
        toggleVoice: () => voiceOverlay.classList.toggle("active"),
        sendMessage: sendMessage,
        showRecovery: () => recoveryScreen.classList.add("screen-active")
    };

    /* -----------------------------
       INITIAL LOAD
    ----------------------------- */
    document.body.dataset.appState = "ready";
    showScreen("boot");

});
