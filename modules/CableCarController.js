import ControlPanel from './ControlPanel'
import BidirectionnalMotor from './BidirectionnamMotor'
import EventStack from './EventStack'

class CableCarController {

    constructor (config) {
        this.controlPanel = new ControlPanel(config.pins)
        this.motor = new BidirectionnalMotor(...config.motor.pins)

        this.eventStack = new EventStack(this)
    }

    init () {
        this.motor.off()
        this.controlPanel.setStatus('ready')
    }

    on (trigger, callback) {
        this.eventStack.register(trigger, callback)
    }

}


export default CableCarController