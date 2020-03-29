import onoff from 'onoff'
const Gpio = onoff.Gpio

class Led {
    static instances = []
    state = false
    blinkInterval = null

    constructor (pin) {
        this.gpio = new Gpio(pin, 'out')
        this.off()
        Led.instances.push(this)

        this.isBlinking = false
        this.on = this.on.bind(this)
        this.off = this.off.bind(this)
        this.blink = this.blink.bind(this)
        this.toggle = this.toggle.bind(this)
        this.stopBlink = this.stopBlink.bind(this)
        this.toggleForBlink = this.toggleForBlink.bind(this)
    }

    on (stopBlink = true) {
        if (stopBlink) this.stopBlink()
        this.gpio.writeSync(1)
        this.state = 1
    }
    off(stopBlink = true) {
        if (stopBlink) this.stopBlink()
        this.gpio.writeSync(0)
        this.state = 0
    }

    toggle () {
        this.stopBlink()
        if (this.state) { this.off() } else { this.on() }
    }

    toggleForBlink () {
        if (this.state) { this.off(false) } else { this.on(false) }
    }

    blink (interval) {
        if (!this.isBlinking || interval !== this.blinkInterval) {
            this.off()
            this.isBlinking = true
            this.blinkInterval = setInterval(this.toggleForBlink, interval)
        }
    }
    stopBlink () {
        if (this.blinkInterval) {
            this.isBlinking = false
            clearInterval(this.blinkInterval)
            this.blinkInterval = null
        }
    }

    static unExportAll () {
        Led.instances.map(instance => {
            instance.unExport()
        })
    }
    static on () {
        Led.instances.map(instance => {
            instance.on()
        })
    }
    static off () {
        Led.instances.map(instance => {
            instance.off()
        })
    }

    unExport () {
        this.off()
        this.gpio.unexport()
    }
}

export default Led
