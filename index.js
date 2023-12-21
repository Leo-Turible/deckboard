import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

document.getElementById('connectBtn').addEventListener('click', connectToOBS);
document.getElementById('disconnectBtn').addEventListener('click', disconnectFromOBS);
document.getElementById('startStreamBtn').addEventListener('click', startStreaming);
document.getElementById('stopStreamBtn').addEventListener('click', stopStreaming);
document.getElementById('changeToIntroBtn').addEventListener('click', changeToIntroScene);
document.getElementById('changeToPauseBtn').addEventListener('click', changeToPauseScene);
document.getElementById('changeToOutroBtn').addEventListener('click', changeToOutroScene);
document.getElementById('changeToCamBtn').addEventListener('click', changeToCamScene);
document.getElementById('toggleMuteBtn').addEventListener('click', toggleMicrophoneMute);
document.getElementById('toggleDesktopAudioBtn').addEventListener('click', toggleDesktopAudioMute);

async function connectToOBS() {
    try {
        await obs.connect('ws://10.152.7.43:4444');
        console.log('Connected to OBS Studio');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        enableButtons();
        
        // Get the initial mute state and update the button color
        await updateMuteButtonColor();

        // Mettre à jour l'état des boutons de changement de scène
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to connect', error.code, error.message);
    }
}

async function disconnectFromOBS() {
    await obs.disconnect();
    console.log('Disconnected from OBS Studio');
    disableButtons();

    // Réinitialiser la couleur du bouton mute/unmute
    resetMuteButtonColor();
}

async function startStreaming() {
    try {
        await obs.call('StartStream');
        console.log('Streaming started');

        // Mettre à jour l'état des boutons
        document.getElementById('startStreamBtn').disabled = true;
        document.getElementById('stopStreamBtn').disabled = false;
    } catch (error) {
        console.error('Failed to start streaming', error.code, error.message);
    }
}

async function stopStreaming() {
    try {
        await obs.call('StopStream');
        console.log('Streaming stopped');

        // Mettre à jour l'état des boutons
        document.getElementById('startStreamBtn').disabled = false;
        document.getElementById('stopStreamBtn').disabled = true;
    } catch (error) {
        console.error('Failed to stop streaming', error.code, error.message);
    }
}

async function changeToIntroScene() {
    try {
        // Set the current program scene to 'INTRO'
        await obs.call('SetCurrentProgramScene', { sceneName: 'INTRO' });
        console.log('Set current program scene to "INTRO"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de scène
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

// Function to change to the scene named "PAUSE"
async function changeToPauseScene() {
    try {
        // Set the current program scene to 'PAUSE'
        await obs.call('SetCurrentProgramScene', { sceneName: 'PAUSE' });
        console.log('Set current program scene to "PAUSE"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de PAUSE
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

async function changeToOutroScene() {
    try {
        // Set the current program scene to 'OUTRO'
        await obs.call('SetCurrentProgramScene', { sceneName: 'OUTRO' });
        console.log('Set current program scene to "OUTRO"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de OUTRO
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

async function changeToCamScene() {
    try {
        // Set the current program scene to 'CAM'
        await obs.call('SetCurrentProgramScene', { sceneName: 'CAM' });
        console.log('Set current program scene to "CAM"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de CAM
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

// Fonction pour désactiver les boutons de changement de scène si on est déjà sur la même scène
function disableSceneButtons(currentSceneName) {
    const INTROSceneBtn = document.getElementById('changeToIntroBtn');
    const sceneBtn = document.getElementById('changeToPauseBtn');
    const outroSceneBtn = document.getElementById('changeToOutroBtn');
    const camSceneBtn = document.getElementById('changeToCamBtn');

    // Désactiver le bouton "Change to Scene 'INTRO'" si on est déjà sur la scène 'INTRO'
    INTROSceneBtn.disabled = currentSceneName === 'INTRO';

    // Désactiver le bouton "Change to Scene 'PAUSE'" si on est déjà sur la scène 'PAUSE'
    sceneBtn.disabled = currentSceneName === 'PAUSE';

    // Désactiver le bouton "Change to Scene 'OUTRO'" si on est déjà sur la scène 'OUTRO'
    outroSceneBtn.disabled = currentSceneName === 'OUTRO';

    // Désactiver le bouton "Change to Scene 'CAM'" si on est déjà sur la scène 'CAM'
    camSceneBtn.disabled = currentSceneName === 'CAM';
}

async function toggleMicrophoneMute() {
    try {
        const { inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Mic/Aux' });
        console.log('Toggled input mute for "Main Microphone". Mute status:', inputMuted);

        // Mettez à jour la couleur du bouton en fonction de l'état du mute
        const muteBtn = document.getElementById('toggleMuteBtn');
        muteBtn.classList.toggle('muted', inputMuted);
        muteBtn.classList.toggle('unmuted', !inputMuted);
    } catch (error) {
        console.error('Failed to toggle microphone mute/unmute', error.code, error.message);
    }
}

async function toggleDesktopAudioMute() {
    try {
        const { inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Audio du Bureau' });
        console.log('Toggled input mute for "Audio du Bureau". Mute status:', inputMuted);

        // Mettez à jour la couleur du bouton en fonction de l'état du mute
        const desktopAudioBtn = document.getElementById('toggleDesktopAudioBtn');
        desktopAudioBtn.classList.toggle('muted', inputMuted);
        desktopAudioBtn.classList.toggle('unmuted', !inputMuted);
    } catch (error) {
        console.error('Failed to toggle desktop audio mute/unmute', error.code, error.message);
    }
}

async function updateMuteButtonColor() {
    try {
        const { inputMuted: micMuted } = await obs.call('GetInputMute', { inputName: 'Mic/Aux' });
        const { inputMuted: desktopAudioMuted } = await obs.call('GetInputMute', { inputName: 'Audio du Bureau' });

        // Mettez à jour la couleur du bouton Microphone en fonction de l'état du mute
        const micBtn = document.getElementById('toggleMuteBtn');
        micBtn.classList.toggle('muted', micMuted);
        micBtn.classList.toggle('unmuted', !micMuted);

        // Mettez à jour la couleur du bouton Audio du Bureau en fonction de l'état du mute
        const desktopAudioBtn = document.getElementById('toggleDesktopAudioBtn');
        desktopAudioBtn.classList.toggle('muted', desktopAudioMuted);
        desktopAudioBtn.classList.toggle('unmuted', !desktopAudioMuted);
    } catch (error) {
        console.error('Failed to get microphone and desktop audio mute status', error.code, error.message);
    }
}

function resetMuteButtonColor() {
    // Réinitialiser la couleur du bouton Microphone
    const micBtn = document.getElementById('toggleMuteBtn');
    micBtn.classList.remove('muted', 'unmuted');

    // Réinitialiser la couleur du bouton Audio du Bureau
    const desktopAudioBtn = document.getElementById('toggleDesktopAudioBtn');
    desktopAudioBtn.classList.remove('muted', 'unmuted');
}

function enableButtons() {
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('disconnectBtn').disabled = false;
    document.getElementById('startStreamBtn').disabled = false;
    // document.getElementById('stopStreamBtn').disabled = false;
    document.getElementById('changeToIntroBtn').disabled = false;
    document.getElementById('changeToPauseBtn').disabled = false;
    document.getElementById('changeToOutroBtn').disabled = false;
    document.getElementById('changeToCamBtn').disabled = false;
    document.getElementById('toggleMuteBtn').disabled = false;
    document.getElementById('toggleDesktopAudioBtn').disabled = false;
}

function disableButtons() {
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('startStreamBtn').disabled = true;
    document.getElementById('stopStreamBtn').disabled = true;
    document.getElementById('changeToIntroBtn').disabled = true;
    document.getElementById('changeToPauseBtn').disabled = true;
    document.getElementById('changeToOutroBtn').disabled = true;
    document.getElementById('changeToCamBtn').disabled = true;
    document.getElementById('toggleMuteBtn').disabled = true;
    document.getElementById('toggleDesktopAudioBtn').disabled = true;
}
