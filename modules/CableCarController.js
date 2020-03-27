import ControlPanel from './ControlPanel'
import BidirectionnalMotor from './BidirectionnalMotor'
import EventStack from './EventStack'

class CableCarController {

    constructor (config) {
        this.controlPanel = new ControlPanel(config.pins)
        this.motor = new BidirectionnalMotor(...config.motor.pins)

        this.eventStack = new EventStack(this)
    }

    init () {
        this.motor.off()
        this.motor.setDirection(0)
        this.controlPanel.setDirectionStatus(0) 
        this.controlPanel.setRunningStatus('ready')
        
        this.controlPanel.onStartButton('release', () => {
            this.start()
        })
        this.controlPanel.onStopButton('push', () => {
            this.stop()
        })
        this.controlPanel.onToggleButton('release', () => {
            this.toggleDirection()
        })

        this.controlPanel.onPowerOff(() => {
            console.error('poweroff')
        })
        
        this.eventStack.call('init')
    }

    start () {
        this.motor.on()
        this.controlPanel.setRunningStatus()
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
            this.eventStack.call('setDirection')
            return true
        } else {
            return false
        }
    }

    toggleDirection () {
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