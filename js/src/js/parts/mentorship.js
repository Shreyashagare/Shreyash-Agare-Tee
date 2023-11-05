import gsap from "gsap"
import {
    bp
} from "./helpers/breakpoints"

export const initMentorship = () => {
    const mentorship = document.querySelector('.mentorship')
    if (!mentorship) return

    const items = mentorship.querySelectorAll('.mentorship__item')

    items.forEach(item => {
        const image = item.querySelector('.mentorship__item-image')
        item.addEventListener('mousemove', (e) => {
            if (!bp.desktop.matches) return
            const rect = item.getBoundingClientRect();
            const duration = 0.4

            const x = e.clientX - rect.x
            const y = e.clientY - rect.y

            gsap.to(image, {
                x,
                y,
                duration
            })
        })
        item.addEventListener('mouseenter', (e) => {
            if (!bp.desktop.matches) return
            const rect = item.getBoundingClientRect();

            const x = e.clientX - rect.x
            const y = e.clientY - rect.y

            gsap.set(image, {
                x,
                y
            })
        })
    })
}