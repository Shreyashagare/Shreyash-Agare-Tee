import emailjs from '@emailjs/browser';
import config from './helpers/emailjs';
import Lottie from "lottie-web/build/player/lottie_light";


const form = document.querySelector('#form_main')

export const initForm = () => {
    if (!form) return

    const submitBtn = form.querySelector('.form__submit')
    const submitBtnMobile = form.querySelector('.form__submit-mob')
    const submitCheckButton = form.querySelector('.form__submitted')
    const lottieContainer = form.querySelector('.form__lottie')

    const name = form.querySelector('input[name="from_name"]')
    const email = form.querySelector('input[name="reply_to"]')
    const message = form.querySelector('input[name="message"]')

    const fields = [name, email, message]

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const lottie = Lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: `../assets/svg/lottie-d/snake.json`
    })

    lottie.setSpeed(.5)

    lottie.play()

    const clearForm = () => {
        name.value = ''
        email.value = ''
        message.value = ''
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
                '#form_main',
                config.EMAIL_PUBLIC
            )
            form.classList.add('is-send')
            clearForm()
        } catch (error) {
            console.log(error.text)
        }
    }

    const isSended = () => {
        form.classList.remove('is-send')
    }

    const removeInvalid = (e) => {
        if (e.target.parentElement.classList.contains('not-valid')) {
            e.target.parentElement.classList.remove('not-valid')
        }
    }

    fields.forEach(field => {
        field.addEventListener('input', removeInvalid)
    })

    submitBtn.addEventListener('click', sendEmail)
    submitBtnMobile.addEventListener('click', sendEmail)
    submitCheckButton.addEventListener('click', isSended)
}