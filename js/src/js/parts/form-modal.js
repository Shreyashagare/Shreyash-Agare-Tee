import gsap from "gsap"
import emailjs from '@emailjs/browser';
import config from './helpers/emailjs';

export const initFormModal = () => {
    const modal = document.querySelector('.form-modal')

    if (!modal) return

    const modalBg = modal.querySelector('.form-modal__bg')
    const content = modal.querySelector('.form-modal__inner')
    const closeBtn = modal.querySelector('.form-modal__close')
    const cstSel = modal.querySelector('#form-modal-select').customSelect
    const submitBtn = modal.querySelector('.form-modal__submit')
    const submitMobile = modal.querySelector('.form__submit-mob')

    const form = modal.querySelector('#form-modal')
    const formSuccess = modal.querySelector('.form-modal__success')

    const name = modal.querySelector('input[name="from_name"]')
    const email = modal.querySelector('input[name="reply_to"]')
    const message = modal.querySelector('textarea[name="message"]')

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const fields = [name, email, message]

    const openers = document.querySelectorAll('.form-modal-opener')
    const modalContainer = document.querySelector('.help-modal')
    const helpSection = document.querySelector('.help__inner')

    const clearForm = () => {
        name.value = ''
        email.value = ''
        message.value = ''
    }

    const closeModal = () => {
        modalContainer.classList.remove('is-active')

        gsap.set('.help__ball', {
            zIndex: 1
        })
        gsap.set(".help__ball-fill", {
            y: 0,
            scale: 0
        })
        gsap.set('.help__ball-text', {
            zIndex: 2,
            color: '#1B1C1E'
        })

        gsap.set('.help-modal__close', {
            opacity: 0
        })
        gsap.set('.help-modal__item', {
            yPercent: 0,
            display: 'none',
            opacity: 0,
        })
    }

    const onOpen = (e) => {
        const btn = e.currentTarget
        const {
            top,
            left,
            width,
            height
        } = btn.getBoundingClientRect()
        const formLink = btn.dataset.form

        gsap.set(modal, {
            top: 0,
            left: 0,
            opacity: 1,
            pointerEvents: 'all'
        })
        gsap.set(content, {
            opacity: 0
        })
        gsap.set(modalBg, {
            x: left + width / 2 - 100,
            y: top + height / 2 - 100,
            scale: 0
        })
        cstSel.value = formLink

        gsap.timeline()
            .to(modalBg, {
                scale: 50,
                duration: 1.2,
                ease: 'power4.in'
            })
            .to([content, closeBtn], {
                opacity: 1,
                duration: .4,
                ease: 'power2.out',
            })

    }

    const sendEmail = async (e) => {
        e.preventDefault()

        const notValidFields = []

        if (!email.value.match(emailRegex)) {
            notValidFields.push(email)
        }
        if (name.value.length === 0) {
            notValidFields.push(name)
        }
        if (message.value.length < 3) {
            notValidFields.push(message)
        }
        if (notValidFields.length) {
            notValidFields.forEach((field) => {
                field.parentElement.classList.add('not-valid')
            })
            return
        }

        try {
            await emailjs.sendForm(
                config.EMAIL_SERVICE,
                config.EMAIL_TEMPLATE,
                '#form-modal',
                config.EMAIL_PUBLIC
            )
            onClose(true)
            clearForm()
        } catch (error) {
            console.log(error.text)
        }
    }



    const onClose = (closeHelp) => {
        const tl = gsap.timeline()
            .to([content, closeBtn], {
                opacity: 0,
                duration: .3,
                ease: 'power2.in',
            })

        if (closeHelp) {
            tl.to(form, {
                    opacity: 0,
                    ease: 'power2.in',
                    duration: .5
                }).to(formSuccess, {
                    opacity: 1,
                    ease: 'power2.out',
                    duration: .5
                })
                .to(modalBg, {
                    scale: 0,
                    duration: 3,
                    ease: 'power4.out',
                    onComplete: () => {
                        gsap.set(modal, {
                            top: '100vh',
                            left: 0,
                            opacity: 0,
                            pointerEvents: 'none'
                        })
                        window.smooth.paused(false)
                        gsap.set(form, {
                            opacity: 1
                        })
                        gsap.set(formSuccess, {
                            opacity: 0
                        })
                    }
                })
                .to(formSuccess, {
                    opacity: 0,
                    delay: .5,
                    ease: 'power2.in',
                    duration: .5
                }, '<')

            const {
                top,
                left,
                width,
                height
            } = helpSection.getBoundingClientRect()
            gsap.set(modalBg, {
                x: left - 100 + width / 2,
                y: top - 100 + height / 2
            })
            closeModal()

            tl.to('header', {
                opacity: 1,
                duration: 1,
                ease: 'power4.out',
            }, '-=1')
        } else {
            tl.to(modalBg, {
                scale: 0,
                duration: 2,
                ease: 'power4.out',
                onComplete: () => {
                    gsap.set(modal, {
                        top: '100vh',
                        left: 0,
                        opacity: 0,
                        pointerEvents: 'none'
                    })
                    window.smooth.paused(false)
                    gsap.set(form, {
                        opacity: 1
                    })
                    gsap.set(formSuccess, {
                        opacity: 0
                    })
                }
            })
        }
    }


    openers.forEach(opener => {
        opener.addEventListener('click', onOpen)
    })

    closeBtn.addEventListener('click', () => {
        onClose(false)
    })

    const removeInvalid = (e) => {
        if (e.target.parentElement.classList.contains('not-valid')) {
            e.target.parentElement.classList.remove('not-valid')
        }
    }

    fields.forEach(field => {
        field.addEventListener('input', removeInvalid)
    })

    submitBtn.addEventListener('click', sendEmail)
    submitMobile.addEventListener('click', sendEmail)


}