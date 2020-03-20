const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO


class Button {
    static instances = []
    eventActions = {}

    constructor (pin) {
        this.gpio = new Gpio(pin, 'in', 'both')
        Button.instances.push(this)

        this.gpio.watch((err, value) => {
            if (err) { //if an error
                console.error('There was an error', err); //output error message to console
              return;
              }
            if (value === 1) {
                this.callEventStack('push')
            }
            if (value === 0) {
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
        Led.instances.map(instance => {
            instance.unExport()
        })
    }

    unExport () {
        this.gpio.unexport()
    }
}

module.exports = Button
