import { Gpio } from 'onoff' //include onoff to interact with the GPIO


class GpioOut {
    static instances = []
    state = false

    constructor (pin, reverse = false) {
        this.gpio = new Gpio(pin, 'out')
        this.off()
        GpioOut.instances.push(this)

        this.reverse = reverse

        this.on = this.on.bind(this)
        this.off = this.off.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    on () {
        const state = this.reverse ? 0 : 1
        this.gpio.writeSync(state)
        this.state = state
    }
    off() {
        const state = this.reverse ? 1 : 0
        this.gpio.writeSync(state)
        this.state = state
    }

    toggle () {
        if (this.reverse ? !this.state : this.state) { this.off() } else { this.on() }
    }


    static unExportAll () {
        GpioOut.instances.map(instance => {
            instance.unExport()
        })
    }
    static on () {
        GpioOut.instances.map(instance => {
            instance.on()
        })
    }
    static off () {
        GpioOut.instances.map(instance => {
            instance.off()
        })
    }

    unExport () {
        this.off()
        this.gpio.unexport()
    }
}

export default GpioOut
