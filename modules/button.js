const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO


class Button {
    static instances = []
    eventActions = {}

    constructor (pin, invert = false) {
        this.gpio = new Gpio(pin, 'in', 'both')
        Button.instances.push(this)

        this.invert = invert

        this.highValue = this.invert ? 0 : 1
        this.lowValue = 1 - this.highValue

        this.gpio.watch((err, value) => {
            if (err) { //if an error
                console.error('There was an error', err); //output error message to console
              return;
              }
            if (value === this.highValue) {
                this.callEventStack('push')
            }
            if (value === this.lowValue) {
                this.callEventStack('release')
            }
        })
    }

    on(event, callback) {
        if (!this.eventActions[event]) {
            this.eventActions[event] = []
        }
        this.eventActions[event].push(callback)
    }

    callEventStack(event) {
        if (this.eventActions[event]) {
            this.eventActions[event].map(action => {
                action()
            })
        }
    }

    static unExportAll () {
        Button.instances.map(instance => {
            instance.unExport()
        })
    }

    unExport () {
        this.gpio.unexport()
    }
}

module.exports = Button
