import onoff from 'onoff'
const Gpio = onoff.Gpio
import EventStack from './EventStack'

class Button {
    static instances = []
    
    
    constructor (pin, invert = false, throttle = 0) {
        this.gpio = new Gpio(pin, 'in', 'both', throttle ? {debounceTimeout: throttle} : null)
        Button.instances.push(this)
        
        this.eventStack = new EventStack
        
        this.invert = invert
        this.highValue = this.invert ? 0 : 1
        this.lowValue = 1 - this.highValue

        this.gpio.watch((err, value) => {
            if (err) { //if an error
                console.error('There was an error', err); //output error message to console
              return;
              }
            if (value === this.highValue) {
                this.eventStack.call('push')
            }
            if (value === this.lowValue) {
                this.eventStack.call('release')
            }
        })
    }

    on(trigger, callback) {
        this.eventStack.register(trigger, callback)
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

export default Button
