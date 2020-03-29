import ControlPanel from './ControlPanel'
import BidirectionnalMotor from './BidirectionnalMotor'
import EventStack from './EventStack'
import Button from './Button';

class CableCarController {

    constructor (config) {
        this.controlPanel = new ControlPanel(config.pins)
        this.motor = new BidirectionnalMotor(...config.motor.pins)
        this.endRunButton = new Button(...config.pins.endRunButton)

        this.justSwitchedDirection = false
        this.isEndRun = false

        this.automatic = false

        this.eventStack = new EventStack(this)
    }

    init (callback = (() => null)) {
        this.motor.setDirection(0)
        this.controlPanel.setDirectionStatus(0) 
        this.controlPanel.setRunningStatus('ready')

        
        this.controlPanel.onStartButton('push', () => {
            console.log('startButton')
            this.start()
        })
        this.controlPanel.onStopButton('push', () => {
            console.log('stopButton')
            this.stop()
        })
        this.controlPanel.onToggleButton('release', () => {
            console.log('toggle')
            
            this.toggleDirection()
        })

        this.endRunButton.on('push', () => {
            console.log('endRun')
            this.endRun()
        })

        this.controlPanel.onEnableAutomatic(() => {
            console.log('enable automatic')
        })

        this.controlPanel.onPowerOff(() => {
            this.eventStack.call('poweroff')
        })

        if (callback) callback()
        this.eventStack.call('init')
    }

    start () {
        if (!this.isEndRun) {
            this.motor.on()
            this.controlPanel.setRunningStatus('running')
            this.eventStack.call('start')
            this.controlPanel.setEndRun(false)
            setTimeout(() => {this.justSwitchedDirection = false}, 500)
        }
    }

    stop () {
        this.motor.off()
        this.controlPanel.setRunningStatus('ready')
        this.eventStack.call('stop')
    }

    endRun () {
        if (this.isRunning && !this.justSwitchedDirection) {
            this.isEndRun = true
            this.stop()
            this.eventStack.call('endRun')
            this.controlPanel.setEndRun(true)
        }
    }

    setDirection (direction) {
        if (!this.isRunning) {
            if (this.motor.currentDirection !== direction) {
                this.justSwitchedDirection = true
                this.isEndRun = false
            }
            this.motor.setDirection(direction)
            this.controlPanel.setDirectionStatus(direction)
            this.eventStack.call('setDirection')
            return true
        } else {
            return false
        }
    }

    toggleDirection () {
        this.setDirection(1 - this.motor.currentDirection)
        this.controlPanel.setEndRun(false)
    }

    get isRunning () {
        return this.motor.running
    }

    on (trigger, callback) {
        this.eventStack.register(trigger, callback)
    }

}


export default CableCarController