const Led = require("./led")
const Button = require('./button')
const config = require('../config')

const status = {
    ready: new Led(22),
    running: new Led(27),
    error: new Led(17)
}

const control = {
    indicator: {
        up: new Led(10),
        down: new Led(9),
        endRun: new Led(11)
    },
    buttons: {
        start: new Button (6, true),
        stop: new Button (5, true),
        toggleDirection: new Button (0, true)
    }
}
const power = {
    indicator: new Led (13),
    button: new Button(19)
}
        
control.buttons.start.on('push', () => { console.log('start') })
control.buttons.stop.on('push', () => { console.log('stop') })
control.buttons.toggleDirection.on('push', () => { console.log('switch') })
power.button.on('push', () => {console.log('power')})

setInterval(() => { status.ready.on() }, 0)
setInterval(() => { status.running.on() }, 1000)
setInterval(() => { status.error.on() }, 2000)
setInterval(() => { control.indicator.up.on() }, 3000)
setInterval(() => { control.indicator.down.on() }, 4000)
setInterval(() => { control.indicator.endRun.on() }, 5000)
setInterval(() => { power.indicator.on() }, 6000)


process.on('SIGINT', () => {
    Button.unExportAll()
  Led.unExportAll()
}); 