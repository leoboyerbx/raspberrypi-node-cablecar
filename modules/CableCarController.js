import ControlPanel from './ControlPanel'
import BidirectionnalMotor from './BidirectionnalMotor'
import EventStack from './EventStack'

class CableCarController {

    constructor (config) {
        this.controlPanel = new ControlPanel(config.pins)
        this.motor = new BidirectionnalMotor(...config.motor.pins)

        this.eventStack = new EventStack(this)
    }

    init (callback = (() => null)) {
        this.motor.setDirection(0)
        this.controlPanel.setDirectionStatus(0) 
        this.controlPanel.setRunningStatus('ready')
        
        this.controlPanel.onStartButton('release', () => {
            console.log('startButton')
            this.start()
        })
        this.controlPanel.onStopButton('push', () => {
            console.log('stopButton')
            this.stop()
        })
        this.controlPanel.onToggleButton('push', () => {
            console.log('toggle')
            
            this.toggleDirection()
        })

        this.controlPanel.onPowerOff(() => {
            console.error('poweroff')
        })

        if (callback) callback()
        this.eventStack.call('init')
    }

    start () {
        this.motor.on()
        this.controlPanel.setRunningStatus('running')
        this.eventStack.call('start')
    }

    stop () {
        this.motor.off()
        this.controlPanel.setRunningStatus('ready')
        this.eventStack.call('stop')
    }

    setDirection (direction) {
        if (!this.isRunning) {
            this.motor.setDirection(direction)
            this.controlPanel.setDirectionStatus(direction)
            this.eventStack.call('setDirection')
            return true
        } else {
            return false
        }
    }

    toggleDirection () {
        console.log(this.motor.currentDirection)
        this.setDirection(1 - this.motor.currentDirection)
    }

    get isRunning () {
        return this.motor.running
    }

    on (trigger, callback) {
        this.eventStack.register(trigger, callback)
    }

}


export default CableCarController