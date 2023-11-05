import gsap from "gsap"
import customSelect from 'custom-select'


export const initHelp = () => {
    const help = document.querySelector('.help')

    if (!help) return

    const textPath = help.querySelector('.help__text-path')
    const balls = document.querySelectorAll('.help__ball')
    const closeModalButton = document.querySelector('.help-modal__close')
    const modals = document.querySelectorAll('.help-modal__item')
    const nextModalButtons = document.querySelectorAll('.help-modal__next')
    const modalContainer = document.querySelector('.help-modal')
    const cstSel = document.querySelector('#form').customSelect
    const state = {
        modalAnimation: false,
        activeModal: null
    }

    customSelect('select')

    gsap.timeline({
        scrollTrigger: {
            trigger: help,
            start: `top bottom`,
            once: true,
            onEnter: () => {
                gsap.fromTo(textPath, {
                    attr: {
                        startOffset: "-100%"
                    }
                }, {
                    attr: {
                        startOffset: '0%'
                    },
                    duration: 3
                })
            }
        }
    });

    const onHover = (e) => {
        const ball = e.currentTarget
        const fill = ball.querySelector('.help__ball-fill')
        const text = ball.querySelector('.help__ball-text')
        if (e.target === fill || state.modalAnimation) return

        gsap.to(fill, {
            scale: 1,
            duration: .85,
            ease: 'power2.inOut'
        })
        gsap.to(text, {
            color: '#ffffff',
            duration: .85,
            ease: 'power2.inOut'
        })
    }

    const onHoverOut = (e) => {
        const ball = e.currentTarget
        const fill = ball.querySelector('.help__ball-fill')
        const text = ball.querySelector('.help__ball-text')
        if (e.target === fill || state.modalAnimation) return

        gsap.to(fill, {
            scale: 0,
            duration: .85,
            ease: 'power2.inOut'
        })
        gsap.to(text, {
            color: '#1B1C1E',
            duration: .85,
            ease: 'power2.inOut'
        })
    }


    const openModal = (e) => {
        if (state.modalAnimation) return
        window.smooth.paused(true)
        state.modalAnimation = true
        const ball = e.currentTarget
        const modalId = ball.dataset.modal
        const fill = ball.querySelector('.help__ball-fill')
        const currentScale = gsap.getProperty(fill, "scale")
        const modalItem = document.querySelector('.help-modal__item--' + modalId)
        modalContainer.classList.add('is-active')
        modalItem.scrollTop = 0

        modalItem.classList.add('is-active')
        state.activeModal = modalId

        gsap.set(closeModalButton, {
            opacity: 0
        })

        gsap.set(ball, {
            zIndex: 10
        })

        gsap.set(fill, {
            scale: currentScale
        })

        gsap.set(modalItem, {
            display: 'flex',
            opacity: 0,
            yPercent: -100,
        })

        gsap.timeline()
            .to(fill, {
                scale: 60,
                ease: 'power4.in',
                duration: 1.2,
                overwrite: true
            }, '<')
            .to(fill, {
                y: '200vh',
                duration: .8,
                delay: .2,
                ease: 'power4.in',
            }, '<')
            .to('header', {
                opacity: 0
            }, '<')
            .to('.help__ball-text', {
                zIndex: 0,
                color: '#1B1C1E',
                duration: .1,
                ease: 'power1.out',
                overwrite: true

            }, '<')
            .to(modalItem, {
                opacity: 1,
                ease: 'power1.out',
                onComplete: () => {
                    state.modalAnimation = false
                }
            })
            .to(closeModalButton, {
                opacity: 1,
                ease: 'power1.out',
            })
    }

    const closeModal = (selectOption = null) => {
        if (state.modalAnimation) return
        state.modalAnimation = true
        const activeBall = document.querySelector(`.help__ball[data-modal="${state.activeModal}"]`)
        const fill = activeBall.querySelector('.help__ball-fill')


        gsap.set('.help__ball-text', {
            duration: 0.3,
            color: '#1B1C1E'
        })

        modals.forEach(modal => {
            gsap.timeline()
                .to([modal, closeModalButton], {
                    opacity: 0,
                    ease: 'power1.out'
                })
                .set([modal], {
                    yPercent: 0,
                    ease: 'power1.out',
                    display: 'none',
                })
                .fromTo(fill, {
                    scale: 60,
                }, {
                    scale: 0,
                    duration: 1.2,
                    ease: 'power4.out'
                })
                .fromTo(fill, {
                    y: '200vh',
                }, {
                    y: 0,
                    duration: .8,
                    ease: 'power4.out',
                    onComplete: () => {
                        gsap.set(activeBall, {
                            zIndex: 1
                        })
                        state.activeModal = null
                        window.smooth.paused(false)
                        modalContainer.classList.remove('is-active')
                        state.modalAnimation = false

                        if (!selectOption || selectOption.target) return
                        cstSel.value = selectOption
                        window.smooth.scrollTo('#contact')
                    }
                }, '<')
                .to('.help__ball-text', {
                    zIndex: 2
                })
                .to('header', {
                    opacity: 1
                }, '<')
            modal.classList.remove('is-active')
        })
    }

    const switchModal = (btn) => {
        if (state.modalAnimation) return
        state.modalAnimation = true
        const nextModalId = btn.dataset.next
        const currentModal = document.querySelector('.help-modal__item--' + state.activeModal)
        const nextModal = document.querySelector('.help-modal__item--' + nextModalId)
        nextModal.scrollTop = 0

        const currentBall = document.querySelector(`.help__ball[data-modal="${state.activeModal}"]`)
        const nextBall = document.querySelector(`.help__ball[data-modal="${nextModalId}"]`)

        const currentFill = currentBall.querySelector('.help__ball-fill')
        const nextFill = nextBall.querySelector('.help__ball-fill')

        gsap.set(currentFill, {
            scale: 0,
            y: 0
        })
        gsap.set(currentBall, {
            zIndex: 1
        })
        gsap.set(nextBall, {
            zIndex: 10
        })
        gsap.set(nextFill, {
            scale: 60,
            y: '200vh'
        })

        gsap.timeline()
            .to(currentModal, {
                opacity: 0,
                ease: 'power1.out',
                onComplete: () => {
                    gsap.set(currentModal, {
                        yPercent: 0
                    })
                    gsap.set(nextModal, {
                        opacity: 0,
                        yPercent: -100,
                        display: 'flex',
                    })
                }
            })
            .to(nextModal, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            })
            .to(nextModal, {
                opacity: 1,
                ease: 'power1.out',
                onComplete: () => {
                    currentModal.classList.remove('is-active')
                    nextModal.classList.add('is-active')
                    state.activeModal = nextModalId
                    state.modalAnimation = false
                }
            })
    }

    closeModalButton.addEventListener('click', closeModal)

    nextModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchModal(btn)
        })
    })

    balls.forEach(ball => {
        ball.addEventListener('click', openModal)
        ball.addEventListener('mouseenter', onHover)
        ball.addEventListener('mouseleave', onHoverOut)
    })
}