const config =  {
    pins: {
        readyLed: 22,
        runningLed: 27,
        errorLed: 17,
        upLed: 10,
        downLed: 9,
        endRunLed: 11,
        startButton: [6, true, 100],
        stopButton: [5, true, 10],
        toggleDirectionButton: [0, true, 100],
        powerButton: [19, false, 100],
        powerLed: 13,
        endRunButton: [26, false, 100]
    },
    motor: {
        pins: [4, 3]
    },
    automaticModeDelay: 5,
    runDuration: 50,
    middleOffset: 1
}

export default config
