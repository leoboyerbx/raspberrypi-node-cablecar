const config =  {
    pins: {
        readyLed: 22,
        runningLed: 27,
        errorLed: 17,
        upLed: 10,
        downLed: 9,
        endRunLed: 11,
        startButton: [6, true],
        stopButton: [5, true],
        toggleDirectionButton: [0, true],
        powerButton: [19, false],
        powerLed: 13
    },
    motor: {
        pins: [4, 3]
    }
}

export default config