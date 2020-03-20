const GpioOut = require('./gpioOut')

class BidirectionnalMotor {
    constructor (pin1, pin2) {
        this.relays = [ new GpioOut(pin1, true), new GpioOut(pin2, true) ]
        this.currentDirection = 0
        this.running = false
    }
    on () {
        this.currentRelay.on()
        this.running = true
    }

    off () {
        this.relays.map(relay => { relay.off() })
        this.running = false
    }

    setDirection (direction, applyImmediately = false) {
        this.currentDirection = direction
        if (applyImmediately) {
            this.off()
            this.on()
        }
    }

    get currentRelay () {
        return this.relays[this.currentDirection]
    }

    unExport () {
        GpioOut.unExportAll()
    }
}

module.exports = BidirectionnalMotor