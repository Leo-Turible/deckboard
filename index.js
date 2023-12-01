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
    // Start streaming with the 'recording' and 'high_quality' settings
    // await obs.call('StartStreaming', {
    //     'stream': {
    //         'type': 'rtmp_custom',
    //         'settings': {
    //             'server': 'rtmp://localhost:1935/live',
    //             'key': 'stream',
    //         },
    //     },
    //     'recording': true,
    //     'high_quality': true,
    // });
    try {
        await obs.call('StartStream');
        console.log('Streaming started');
    } catch (error) {
        console.error('Failed to start streaming', error.code, error.message);
    }
    // Execute the GetStreamStatus request
    const { GetStreamStatus } = await obs.call('GetStreamStatus');
    console.log('Streaming started', GetStreamStatus);
}

async function stopStreaming() {
    try {
        await obs.call('StopStream');
        console.log('Streaming stopped');
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
    } catch (error) {
        console.error('Failed to change scene', error.code, error.message);
    }
}

async function toggleMicrophoneMute() {
    try {
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
