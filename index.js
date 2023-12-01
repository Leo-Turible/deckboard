import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

document.getElementById('connectBtn').addEventListener('click', connectToOBS);
document.getElementById('disconnectBtn').addEventListener('click', disconnectFromOBS);
document.getElementById('startStreamBtn').addEventListener('click', startStreaming);
document.getElementById('stopStreamBtn').addEventListener('click', stopStreaming);
document.getElementById('changeSceneBtn').addEventListener('click', changeToTestScene);
document.getElementById('toggleMuteBtn').addEventListener('click', toggleMicrophoneMute); // Add event listener

async function connectToOBS() {
    try {
        await obs.connect('ws://localhost:4444');
        console.log('Connected to OBS Studio');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);

        

        enableButtons();
    } catch (error) {
        console.error('Failed to connect', error.code, error.message);
    }
}



async function disconnectFromOBS() {
    await obs.disconnect();
    console.log('Disconnected from OBS Studio');
    disableButtons();
}

async function startStreaming() {
    await obs.call('StartStreaming');
    console.log('Streaming started');
}

async function stopStreaming() {
    await obs.call('StopStreaming');
    console.log('Streaming stopped');
}

async function changeToTestScene() {
    try {
        // Set the current program scene to 'Test'
        await obs.call('SetCurrentProgramScene', { sceneName: 'Test' });
        console.log('Set current program scene to "Test"');

        // Execute the GetCurrentProgramScene request
        const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
        console.log('Current program scene:', currentProgramSceneName);
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

async function toggleMicrophoneMute() {
    try {
        // Replace 'YourMicrophoneSourceName' with the name of your microphone source
        // await obs.call('ToggleMute', { 'source': 'Mic/Aux' });
        // console.log('Toggled microphone mute/unmute');
        // Toggle the input mute for 'Main Microphone'
        const { inputMuted } = await obs.call('ToggleInputMute', { inputName: 'Main Microphone' });
        console.log('Toggled input mute for "Main Microphone". Mute status:', inputMuted);
    } catch (error) {
        console.error('Failed to toggle microphone mute/unmute', error.code, error.message);
    }
}

function enableButtons() {
    document.getElementById('connectBtn').disabled = true;
    document.getElementById('disconnectBtn').disabled = false;
    document.getElementById('startStreamBtn').disabled = false;
    document.getElementById('stopStreamBtn').disabled = false;
    document.getElementById('changeSceneBtn').disabled = false;
    document.getElementById('toggleMuteBtn').disabled = false;
}

function disableButtons() {
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('disconnectBtn').disabled = true;
    document.getElementById('startStreamBtn').disabled = true;
    document.getElementById('stopStreamBtn').disabled = true;
    document.getElementById('changeSceneBtn').disabled = true;
    document.getElementById('toggleMuteBtn').disabled = true;
}
