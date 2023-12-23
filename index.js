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
document.getElementById('toggleCameraBtn').addEventListener('click', toggleCamera);
document.getElementById('startAbonneMediaBtn').addEventListener('click', startAbonneMedia);

async function connectToOBS() {
    try {
        await obs.connect('ws://192.168.1.XX:4444');
        console.log('Connected to OBS Studio');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        // Afficher la liste des sources de la scène actuelle
        await getSceneSources();

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
        console.log('Toggled input mute for "Mic/Aux". Mute status:', inputMuted);

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

async function getSceneSources() {
    try {
        // Obtenez le nom de la scène actuelle
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');

        // Obtenez la liste des sources de la scène actuelle
        const { sceneItems } = await obs.call('GetSceneItemList', { 'sceneName': currentProgramSceneName });

        console.log('Sources in the current scene:', sceneItems);
    } catch (error) {
        console.error('Failed to get scene sources', error.code, error.message);
    }
}

async function toggleCamera() {
    try {
        // Obtenez le nom de la scène actuelle
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');

        // Obtenez l'ID de la caméra dans la scène actuelle
        const { sceneItemId } = await obs.call('GetSceneItemId', {
            'sceneName': currentProgramSceneName,
            'sourceName': 'cam' // Remplacez par le nom réel de votre caméra
        });

        // Obtenez l'état d'activation actuel de la caméra
        const { sceneItemEnabled } = await obs.call('GetSceneItemEnabled', {
            'sceneName': currentProgramSceneName,
            'sceneItemId': sceneItemId
        });

        // Changez l'état d'activation de la caméra
        await obs.call('SetSceneItemEnabled', {
            'sceneName': currentProgramSceneName,
            'sceneItemId': sceneItemId,
            'sceneItemEnabled': !sceneItemEnabled // Inversez l'état actuel
        });

        // Mettez à jour la couleur et le texte du bouton
        const cameraBtn = document.getElementById('toggleCameraBtn');
        cameraBtn.classList.toggle('btn-success', !sceneItemEnabled); // Vert si désactivé
        cameraBtn.classList.toggle('btn-danger', sceneItemEnabled); // Rouge si activé
        cameraBtn.textContent = sceneItemEnabled ? 'Caméra désactivée' : 'Caméra Activée';

        console.log('Camera toggled. New state:', !sceneItemEnabled);
    } catch (error) {
        console.error('Failed to toggle camera', error.code, error.message);
    }
}

async function startAbonneMedia() {
    try {
        // Nom de la source média à contrôler
        const abonneMediaInputName = 'abonne';
        const logoMediaInputName = 'logo';

        // Fonction pour démarrer ou redémarrer un média
        const startOrRestartMedia = async (inputName) => {
            await obs.call('TriggerMediaInputAction', {
                'inputName': inputName,
                'mediaAction': 'OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART'
            });
        };

        // Obtenir l'état actuel du média "abonne"
        const { mediaState: abonneMediaState } = await obs.call('GetMediaInputStatus', { 'inputName': abonneMediaInputName });
        console.log('Abonne Media state:', abonneMediaState);

        // Obtenir l'état actuel du média "logo"
        const { mediaState: logoMediaState } = await obs.call('GetMediaInputStatus', { 'inputName': logoMediaInputName });
        console.log('Logo Media state:', logoMediaState);

        // Déclencher l'action en fonction de l'état actuel pour le média "abonne"
        if (abonneMediaState === 'OBS_MEDIA_STATE_PLAYING') {
            await startOrRestartMedia(abonneMediaInputName);
            console.log('Abonne Media restarted');
        } else {
            await startOrRestartMedia(abonneMediaInputName);
            console.log('Abonne Media started');
        }

        // Déclencher l'action en fonction de l'état actuel pour le média "logo"
        if (logoMediaState === 'OBS_MEDIA_STATE_PLAYING') {
            await startOrRestartMedia(logoMediaInputName);
            console.log('Logo Media restarted');
        } else {
            await startOrRestartMedia(logoMediaInputName);
            console.log('Logo Media started');
        }

        // Mettre à jour la couleur du bouton en fonction de l'état du média "abonne"
        updateAbonneMediaButtonColor(abonneMediaState);
    } catch (error) {
        console.error('Failed to start/stop media', error.code, error.message);
    }
}

// Fonction pour mettre à jour la couleur du bouton en fonction de l'état du média "abonne"
function updateAbonneMediaButtonColor(mediaState) {
    const abonneMediaBtn = document.getElementById('startAbonneMediaBtn');

    if (mediaState === 'OBS_MEDIA_STATE_PLAYING') {
        // Média en cours de lecture, mettez le bouton en jaune/orange
        abonneMediaBtn.classList.remove('btn-success');
        abonneMediaBtn.classList.add('btn-warning');
    } else {
        // Média terminé, remettez le bouton en vert
        abonneMediaBtn.classList.remove('btn-warning');
        abonneMediaBtn.classList.add('btn-success');
    }
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
    document.getElementById('toggleCameraBtn').disabled = false;
    document.getElementById('startAbonneMediaBtn').disabled = false;
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
    document.getElementById('toggleCameraBtn').disabled = true;
    document.getElementById('startAbonneMediaBtn').disabled = true;
}

