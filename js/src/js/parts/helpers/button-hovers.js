export const initButtonHovers = () => {
    const colors = ['#97B57B', '#A79A85', '#77A9A0', '#568778', '#76987D', '#1B1C1E']

    const buttons = document.querySelectorAll('.button, .button-round')

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

    const onHoverOut = (button) => {
        const fill = button.querySelector('.button__hover') || button.querySelector('.button-round__hover')
        fill.style.backgroundColor = getRandomColor()
    }

    buttons.forEach(button => {
        let timeoutFn

        const onMouseLeave = () => {
            timeoutFn = setTimeout(() => {
                onHoverOut(button)
            }, 1000)
        }
        const onMouseEnter = () => {
            clearTimeout(timeoutFn)
        }

        button.addEventListener('mouseleave', onMouseLeave)
        button.addEventListener('mouseenter', onMouseEnter)

        onHoverOut(button)
    })
}