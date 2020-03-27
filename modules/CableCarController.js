import ControlPanel from './ControlPanel'
import BidirectionnalMotor from './Motor'
import EventStack from './EventStack'

class CableCarController {

    constructor (config) {
        this.controlPanel = new ControlPanel(config.pins)
        this.motor = new BidirectionnalMotor(...config.motor.pins)

        this.eventStack = new EventStack(this)
    }

}


export default CableCarController