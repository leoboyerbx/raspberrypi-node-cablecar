import Led from './Led'
import Button from './Button'

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
            start: new Button (pins.startButton, true),
            stop: new Button (pins.stopButton, true),
            toggleDirection: new Button (pins.toggleDirectionButton, true),
            button: new Button(pins.powerButton)
        }
    }

    setStatus(status) {
        switch (status) {
            case 'ready':
                this.leds.ready.on()
                this.leds.running.off()
                this.leds.error.off()
                break
            case 'running':
                this.leds.ready.off()
                this.leds.running.blink(300)
                this.leds.error.off()
                break
            case 'error':
                this.leds.ready.off()
                this.leds.running.off()
                this.leds.error.on()
        
            default:
                break
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

}


        
process.on('SIGINT', () => {
    Button.unExportAll()
  Led.unExportAll()
}); 


export default ControlPanel