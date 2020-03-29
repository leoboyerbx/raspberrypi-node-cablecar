import Led from './Led'
import Button from './Button'
import EventStack from './EventStack'

class ControlPanel {
    constructor(pins) {
        this.leds = {
            ready: new Led(pins.readyLed),
            running: new Led(pins.runningLed),
            error: new Led(pins.errorLed),
            directionUp: new Led(pins.upLed),
            directionDown: new Led(pins.downLed),
            endRun: new Led(pins.endRunLed),
            power: new Led (pins.powerLed),
        }

        this.buttons = {
            start: new Button (...pins.startButton),
            stop: new Button (...pins.stopButton, true),
            toggleDirection: new Button (...pins.toggleDirectionButton, true),
            power: new Button(...pins.powerButton)
        }

        this.eventStack = new EventStack(this)

        this.automatic = false
        this.runningStatus = ""

        this.initPowerButton()
        this.initStartButton()

    }

    setAutomaticMode (set) {
        this.automatic = set
        this.refreshRunningStatus()
    }

    initPowerButton () {
        this.power = {
            powerButtonPressed: false,
            timeout: null,
            handleEndTimeout: () => {
                this.leds.power.off()
                this.leds.power.blink(100)
                this.power.powerButtonPressed = false
                setTimeout(() => {
                    this.leds.power.off()
                    this.eventStack.call('poweroff')
                }, 2000)

            }
        }
        this.buttons.power.on('push', () => {
            if (!this.power.powerButtonPressed) {
                this.power.powerButtonPressed = true
                this.power.timeout = setTimeout(this.power.handleEndTimeout, 5000)
                this.leds.power.blink(500)
            }
        })
        this.buttons.power.on('release', () => {
            if (this.power.powerButtonPressed) {
                this.power.powerButtonPressed = false
                clearTimeout(this.power.timeout)
                this.leds.power.off()
            }
        })
    }

    initStartButton () {
        this.startButton = {
            startButtonPressed: false,
            timeout: null,
            handleEndTimeout: () => {
                this.eventStack.call('enableAutomatic')
            }
        }
        this.buttons.start.on('push', () => {
            if (!this.startButton.startButtonPressed) {
                this.startButton.startButtonPressed = true
                this.startButton.timeout = setTimeout(this.startButton.handleEndTimeout, 2000)
            }
        })
        this.buttons.start.on('release', () => {
            if (this.startButton.startButtonPressed) {
                this.startButton.startButtonPressed = false
                clearTimeout(this.startButton.timeout)
            }
        })
    }

    refreshRunningStatus () {
        this.setRunningStatus(this.runningStatus)
    }

    setRunningStatus (status) {
        switch (status) {
            case 'ready':
                this.leds.ready.blink(500)
                this.leds.running.off()
                this.leds.error.off()
                break
            case 'running':
                this.leds.ready.blink(200)
                this.leds.running.blink(200)
                this.leds.error.off()
                break
            case 'error':
                this.leds.ready.off()
                this.leds.running.off()
                this.leds.error.on()
        
            default:
                break
        }
        this.runningStatus = status
    }

    setDirectionStatus (direction) {
        switch (direction) {
            case 0:
                this.leds.directionUp.on()
                this.leds.directionDown.off()
                break;
            case 1:
                this.leds.directionUp.off()
                this.leds.directionDown.on()
                break;
            default:
                break;
        }
    }

    setEndRun (val) {
        if (val) {
            this.leds.endRun.on()
        } else {
            this.leds.endRun.off()
        }
    }

    onStartButton (trigger, callback) {
        this.buttons.start.on(trigger, callback)
    }

    
    onStopButton (trigger, callback) {
        this.buttons.stop.on(trigger, callback)
    }
    
    onToggleButton (trigger, callback) {
        this.buttons.toggleDirection.on(trigger, callback)
    }
    
    onPowerOff (callback) {
        this.eventStack.register('poweroff', callback)
    }
    
    onEnableAutomatic (callback) {
        this.eventStack.register('enableAutomatic', callback)
    }
}


        
process.on('exit', () => {
    Button.unExportAll()
    Led.unExportAll()
}); 


export default ControlPanel