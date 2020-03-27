const Led = require("./led")
const Button = require('./button')
const config = require('../config')

class ControlPanel {
    constructor(config) {
        const pins = config.pins
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
                this.leds.running.blink(500)
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

}


        
process.on('SIGINT', () => {
    Button.unExportAll()
  Led.unExportAll()
}); 


export default new ControlPanel(config)