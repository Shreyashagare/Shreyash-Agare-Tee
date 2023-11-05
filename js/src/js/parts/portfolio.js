import gsap from 'gsap'
import {
    detect
} from "detect-browser";
const browser = detect();

// handle the case where we don't detect the browser

export const initPortfolio = () => {
    const element = document.querySelector('.portfolio')

    if (!element) return

    const wrapper = document.querySelector('.portfolio__items')
    const dashes = document.querySelector('.portfolio__dashes')
    const items = wrapper.querySelectorAll('.portfolio__item')
    const imagesCon = document.querySelectorAll('.portfolio__image-container')
    const itemHeaders = wrapper.querySelectorAll('.portfolio__headers')
    const mm = gsap.matchMedia()

    if (browser) {
        if (browser.name === 'safari') {
            dashes.classList.add('its-safari')
        }
        if (browser.os === 'Windows 10' || browser.os === 'Windows 11') {
            dashes.classList.add('its-windows')
        }
    }



    mm.add("(max-width: 767px)", () => {
        items.forEach(item => {
            const header = item.querySelector('.portfolio__headers')
            const arrow = item.querySelector('.portfolio__link')

            gsap.set(header, {
                opacity: 0
            })
            gsap.set(item, {
                scale: 0,
                borderColor: 'transparent'
            })
            gsap.set(arrow, {
                opacity: 0
            })

            gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom-=30%',
                        end: 'bottom top',
                        once: true,
                    }
                })
                .fromTo(item, {
                    scale: 0
                }, {
                    scale: 1,
                    duration: 1.5,
                    ease: 'power4.out'
                })
                .fromTo(arrow, {
                    opacity: 0
                }, {
                    opacity: 1,
                    delay: .5,
                    duration: .8,
                    ease: 'power4.out'
                }, '<')
        })

        return () => {
            gsap.set(itemHeaders, {
                opacity: 1
            })
            gsap.set(items, {
                scale: 1
            })
        }
    })

    mm.add("(min-width: 768px)", () => {
        gsap.set(items, {
            scale: 1
        })
        gsap.set('.portfolio__headers', {
            opacity: 1
        })
    })

    let hoverouttimeout = null

    const onHeaderHover = (e) => {
        if (window.innerWidth < 768) return
        const el = e.currentTarget.parentElement
        clearTimeout(hoverouttimeout);

        items.forEach(item => {
            if (item !== el) {
                item.classList.add('is-inactive')
                item.classList.remove('is-active')
            } else {
                item.classList.add('is-active')
                item.classList.remove('is-inactive')
            }
        })
    }
    let first = false
    const onHeaderHoverOut = (e) => {
        if (window.innerWidth < 768) return
        const el = e.currentTarget.parentElement

        items.forEach(item => {
            if (item !== el) {
                item.classList.remove('is-inactive')
            } else {
                item.classList.remove('is-active')
            }
        })
        if (!first) {
            setTimeout(() => {
                imagesCon.forEach((item) => {
                    item.classList.remove('first_transition')
                })
                first = true
            }, 400)
        }
    }

    itemHeaders.forEach(header => {
        header.addEventListener('mouseenter', onHeaderHover)
        header.addEventListener('mouseleave', onHeaderHoverOut)
    })
}