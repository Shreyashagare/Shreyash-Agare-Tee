import gsap from 'gsap'
import {
    bp
} from './helpers/breakpoints'

export const initWorking = () => {
    const working = document.querySelector('.working')
    if (!working) return

    const ACTIVE_CLASS = 'is-active'

    const balls = gsap.utils.toArray('.working__ball, .working__photos')
    const workingBalls = working.querySelectorAll('.working__ball')
    const workingImages = working.querySelectorAll('.working__photo')
    const workingContent = working.querySelectorAll('.working__content-inner')
    const contentContainer = working.querySelector('.working__content')
    const workingModal = document.querySelector('.working-modal')
    const modalItems = document.querySelectorAll('.working-modal__item')
    const closeModalButtons = document.querySelectorAll('.working-modal__close')
    const switchModalButtons = document.querySelectorAll('.working-modal__switch')

    gsap.set(balls, {
        x: -250,
        opacity: 0
    })
    gsap.set(contentContainer, {
        opacity: 0
    })

    gsap.timeline({
        scrollTrigger: {
            trigger: '.working__balls',
            start: 'top bottom',
            once: true,
            onEnter: () => {
                gsap.timeline()
                    .to(balls, {
                        x: 0,
                        duration: 2,
                        opacity: 1,
                        stagger: .005,
                        ease: 'power4.out',
                    })
                    .to(contentContainer, {
                        opacity: 1,
                        duration: .4,
                        ease: 'power4.out',
                    })
            }
        }
    })

    const onClick = (e) => {
        const target = e.currentTarget.dataset.item
        const targetImage = document.querySelector('.working__photo--' + target)
        const targetContent = document.querySelector('.working__content-inner--' + target)

        workingImages.forEach(image => {
            image.style.zIndex = 1
            image.classList.remove(ACTIVE_CLASS)
        })

        workingContent.forEach(content => {
            content.classList.remove(ACTIVE_CLASS)
        })

        balls.forEach(ball => {
            ball.classList.remove(ACTIVE_CLASS)
        })

        targetImage.style.zIndex = 2
        targetImage.classList.add(ACTIVE_CLASS)
        e.currentTarget.classList.add(ACTIVE_CLASS)

        targetContent.classList.add(ACTIVE_CLASS)
    }

    const onClickMobile = (e) => {
        const target = e.currentTarget.dataset.item
        const modal = document.querySelector('.working-modal__item--' + target)
        const nextModalWrapper = modal.querySelector('.working-modal__inner')

        nextModalWrapper.scrollTop = 0
        window.smooth.paused(true)

        workingModal.classList.add(ACTIVE_CLASS)
        modal.classList.add(ACTIVE_CLASS)
    }

    const addDesktopEventListeners = () => {
        workingModal.classList.remove(ACTIVE_CLASS)
        window.smooth.paused(false)
        workingBalls.forEach(ball => {
            ball.removeEventListener('click', onClickMobile)
            ball.addEventListener('click', onClick)
        })
        workingBalls[0].classList.add(ACTIVE_CLASS)
    }

    const addMobileListeners = () => {
        workingBalls.forEach(ball => {
            ball.removeEventListener('click', onClick)
            ball.removeAttribute('style')
            ball.addEventListener('click', onClickMobile)
            ball.classList.remove(ACTIVE_CLASS)
        })

        modalItems.forEach(item => {
            item.classList.remove(ACTIVE_CLASS)
        })
    }

    const onClose = (e) => {
        const modal = e.currentTarget.parentElement
        modal.classList.remove(ACTIVE_CLASS)
        workingModal.classList.remove(ACTIVE_CLASS)
        window.smooth.paused(false)
    }

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', onClose)
    })

    switchModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget
            const nextModalId = button.dataset.next
            const nextModal = document.querySelector(`.working-modal__item--${nextModalId}`)
            const nextModalWrapper = nextModal.querySelector('.working-modal__inner')
            const currentModal = button.closest('.working-modal__item')

            nextModalWrapper.scrollTop = 0
            currentModal.classList.remove(ACTIVE_CLASS)

            setTimeout(() => {
                nextModal.classList.add(ACTIVE_CLASS)
            }, 600)
        })
    })

    const onResize = () => {
        if (bp.mobile.matches) {
            addMobileListeners()
        } else {
            addDesktopEventListeners()
        }
    }

    window.addEventListener('resize', onResize)

    onResize()
}