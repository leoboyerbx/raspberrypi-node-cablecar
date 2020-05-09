class StateButton {
    constructor ($element, states) {
        this.states = states
        this.currentState = null
        this.$element = $element
        this.$icon = this.$element.find('i.fas')
        this.$text = this.$element.find('span.text')
        
        this.on = this.$element.on.bind(this.$element)
        this.click = this.$element.click.bind(this.$element)
    }
    setState(state) {
        for (let [key, value] of Object.entries(this.states)) {
            if (key !== state) {
                this.$element.removeClass('btn-' + value.color)
                this.$icon.removeClass('fa-' + value.icon)
            }
        }
        this.currentState = state
        state = this.states[state]
        this.$element.addClass('btn-' + state.color)
        this.$icon.addClass('fa-' + state.icon)
        this.$text.text(state.text)
        
    }
}
class StateIndicator {
    constructor ($element, states) {
        this.states = states
        this.currentState = null
        this.$element = $element
        this.$icon = this.$element.find('i.fas')
        this.$text = this.$element.find('.value-text')
        this.$title = this.$element.find('.title-text')
        
        this.on = this.$element.on.bind(this.$element)
        this.click = this.$element.click.bind(this.$element)
        
    }
    setState(state) {
        for (let [key, value] of Object.entries(this.states)) {
            if (key !== state) {
                this.$element.removeClass('border-left-muted')
                this.$title.removeClass('text-muted')
                this.$element.removeClass('border-left-' + value.color)
                this.$title.removeClass('text-' + value.color)
                this.$icon.removeClass('fa-' + value.icon)
            }
        }
        this.currentState = state
        state = this.states[state]
        this.$element.addClass('border-left-' + state.color)
        this.$title.addClass('text-' + state.color)
        this.$icon.addClass('fa-' + state.icon)
        this.$text.text(state.text)
    }
}

window.displayController = {
    runningState: false,
    automaticState: false,
    startStopButton: new StateButton($('#start-stop'), {
        stopped: {
            color: "success",
            icon: "play",
            text: "Démarrer"
        },
        started: {
            color: "danger",
            icon: "stop",
            text: "Arrêter"
        }
    }),
    automaticModeButton: new StateButton($('#automaticModeButton'), {
        disabled: {
            color: "primary",
            icon: "robot",
            text: "Passer en mode automatique"
        },
        enabled: {
            color: "primary",
            icon: "hand-pointer",
            text: "Passer en mode manuel"
        }
    }),
    
    runningIndicator: new StateIndicator($('#runningStatusCard'), {
        stopped: {
            color: "primary",
            icon: "pause",
            text: "Prêt"
        },
        started: {
            color: "success",
            icon: "play",
            text: "En fonction"
        }
    }),
    
    directionIndicator: new StateIndicator($('#directionIndicator'), {
        0: {
            color: "warning",
            icon: "arrow-up",
            text: "Montée"
        },
        1: {
            color: "danger",
            icon: "arrow-down",
            text: "Descente"
        },
    }),
    automaticModeIndicator: new StateIndicator($('#automaticModeIndicator'), {
        disabled: {
            color: "secondary",
            icon: "hand-pointer",
            text: "Manuel"
        },
        enabled: {
            color: "info",
            icon: "robot",
            text: "Automatique"
        },
    }),
    toggleDirectionButton : $('#toggle-direction'),
    
    
    start: function () {
        this.startStopButton.setState('started')
        this.runningIndicator.setState('started')
        this.toggleDirectionButton.prop('disabled', true);
        this.runningState = true
    },
    
    stop: function () {
        this.startStopButton.setState('stopped')
        this.runningIndicator.setState('stopped')
        this.toggleDirectionButton.prop('disabled', false);
        this.runningState = false
    },
    
    setDirection: function (direction) {
        this.directionIndicator.setState(direction)
    },
    
    setAutomatic: function (set) {
        this.automaticModeButton.setState(set ? 'enabled' : 'disabled')
        this.automaticModeIndicator.setState(set ? 'enabled' : 'disabled')
        this.automaticState = set
    }
}

$(document).ready(() => {
    const socket = io('/client')
    const displayController = window.displayController
    
    displayController.startStopButton.click(() => {
        if (displayController.runningState) {
            socket.emit('stop')
        } else {
            socket.emit('start')
        }
    })
    
    displayController.automaticModeButton.click(() => {
        socket.emit('set automatic', !displayController.automaticState)
    })
    displayController.toggleDirectionButton.click(() => {
        socket.emit('switch direction')
    })
    
    $('#middle').click(() => {
        console.log('hello')
        socket.emit('go to middle')
    })
    
    $('#shutdown-button').click(() => {
        socket.emit('poweroff')
    })
    
    socket.on('stop', () => { displayController.stop() })
    socket.on('start', () => { displayController.start() })
    socket.on('set direction', direction => { displayController.setDirection(direction) })
    socket.on('enable automatic', () => { displayController.setAutomatic(true) })
    socket.on('disable automatic', () => { displayController.setAutomatic(false) })
    
    const colors = [
        { name: 'white', class: 'secondary', displayName: 'Blanc' },
        { name: 'red', class: 'danger', displayName: 'Rouge' },
        { name: 'green', class: 'success', displayName: 'Vert' },
        { name: 'yellow', class: 'warning', displayName: 'Jaune' },
        { name: 'blue', class: 'primary', displayName: 'Bleu'},
    ]
    function cabinLight (cabin, color) {
        const button = new StateButton($('#cb'+ (cabin + 1) +'-' + color.name), {
            off: {
                color: color.class,
                icon: "toggle-off",
                text: color.displayName
            },
            on: {
                color: color.class + " active",
                icon: "toggle-on",
                text: color.displayName
            }
        })
        socket.on('light', action => {
            if (action.cabin === cabin && action.color === color.name) {
                button.setState(action.onoff)
            }
        })
        button.click(() => {
            console.log({
                cabin: cabin,
                color: color.name,
                onoff: button.currentState === 'on' ? 'off' : 'on'
            })
            socket.emit('light', {
                cabin: cabin,
                color: color.name,
                onoff: button.currentState === 'on' ? 'off' : 'on'
            })
        })
    }
    
    colors.forEach(color => {
        for (let i = 0; i <= 1; i++) {
            cabinLight(i, color)
        }
    })
    
})