import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

document.getElementById('connectBtn').addEventListener('click', connectToOBS);
document.getElementById('disconnectBtn').addEventListener('click', disconnectFromOBS);
document.getElementById('startStreamBtn').addEventListener('click', startStreaming);
document.getElementById('stopStreamBtn').addEventListener('click', stopStreaming);
document.getElementById('changeSceneBtn').addEventListener('click', changeToTestScene);
document.getElementById('changeToSceneBtn').addEventListener('click', changeToScene);
document.getElementById('toggleMuteBtn').addEventListener('click', toggleMicrophoneMute);

async function connectToOBS() {
    try {
        await obs.connect('ws://localhost:4444');
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


async function changeToTestScene() {
    try {
        // Set the current program scene to 'Test'
        await obs.call('SetCurrentProgramScene', { sceneName: 'Test' });
        console.log('Set current program scene to "Test"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de scène
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

// Function to change to the scene named "Scène"
async function changeToScene() {
    try {
        // Set the current program scene to 'Scène'
        await obs.call('SetCurrentProgramScene', { sceneName: 'Scène' });
        console.log('Set current program scene to "Scène"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Mettre à jour l'état des boutons de changement de scène
        disableSceneButtons(currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

// Fonction pour désactiver les boutons de changement de scène si on est déjà sur la même scène
function disableSceneButtons(currentSceneName) {
    const testSceneBtn = document.getElementById('changeSceneBtn');
    const sceneBtn = document.getElementById('changeToSceneBtn');

    // Désactiver le bouton "Change to Scene 'Test'" si on est déjà sur la scène 'Test'
    testSceneBtn.disabled = currentSceneName === 'Test';

    // Désactiver le bouton "Change to Scene 'Scène'" si on est déjà sur la scène 'Scène'
    sceneBtn.disabled = currentSceneName === 'Scène';
}

async function toggleMicrophoneMute() {
    try {
        const { inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Main Microphone' });
        console.log('Toggled input mute for "Main Microphone". Mute status:', inputMuted);

        // Mettez à jour la couleur du bouton en fonction de l'état du mute
        const muteBtn = document.getElementById('toggleMuteBtn');
        muteBtn.classList.toggle('muted', inputMuted);
        muteBtn.classList.toggle('unmuted', !inputMuted);
    } catch (error) {
        console.error('Failed to toggle microphone mute/unmute', error.code, error.message);
    }
}

async function updateMuteButtonColor() {
    try {
        const { inputMuted } = await obs.call('GetInputMute', { inputName: 'Main Microphone' });

        // Mettez à jour la couleur du bouton en fonction de l'état du mute
        const muteBtn = document.getElementById('toggleMuteBtn');
        muteBtn.classList.toggle('muted', inputMuted);
        muteBtn.classList.toggle('unmuted', !inputMuted);
    } catch (error) {
        console.error('Failed to get microphone mute status', error.code, error.message);
    }
}

function resetMuteButtonColor() {
    // Réinitialiser la couleur du bouton mute/unmute
    const muteBtn = document.getElementById('toggleMuteBtn');
    muteBtn.classList.remove('muted', 'unmuted');
}

function enableButtons() {
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('disconnectBtn').disabled = false;
    document.getElementById('startStreamBtn').disabled = false;
    // document.getElementById('stopStreamBtn').disabled = false;
    document.getElementById('changeSceneBtn').disabled = false;
    document.getElementById('changeToSceneBtn').disabled = false;
    document.getElementById('toggleMuteBtn').disabled = false;
}

function disableButtons() {
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('startStreamBtn').disabled = true;
    document.getElementById('stopStreamBtn').disabled = true;
    document.getElementById('changeSceneBtn').disabled = true;
    document.getElementById('changeToSceneBtn').disabled = true;
    document.getElementById('toggleMuteBtn').disabled = true;
}
