class EventStack {
    stack = {}

    constructor (thisContext = null) {
        this.thisContext = thisContext
    }

    register(trigger, callback) {
        if (!this.stack[trigger]) {
            this.stack[trigger] = []
        }
        this.stack[trigger].push(callback)
    }

    call(trigger) {
        if (this.stack[trigger]) {
            this.stack[trigger].map(action => {
                action.apply(this.thisContext)
            })
        }
    }
}

export default EventStack