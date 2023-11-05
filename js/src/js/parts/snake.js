import {
    gsap
} from "gsap";
import {
    CardEffect
} from "./helpers/hoverEffect";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger"


export const initSnake = () => {
    const snake = document.querySelector(".snake");
    if (!snake) return

    //----------------------------------------------
    // Elements
    //----------------------------------------------
    const ball = snake.querySelector('.snake__ball')
    const photo1 = snake.querySelector('.snake__image-1')
    const photo1gif = snake.querySelector('.snake__image-1.is-savemode')
    const photo2 = snake.querySelector('.snake__image-2')
    const textPath = snake.querySelector('.snake__text-path')
    const gif = document.querySelector('#snake-animation')
    const videoContainer = document.querySelector('#snake-video')
    const video = videoContainer.querySelector('video')
    const mm = gsap.matchMedia()

    //----------------------------------------------
    // Defaults
    //----------------------------------------------

    gsap.set([photo1, photo1gif], {
        yPercent: 25,
        xPercent: -50,
        rotateZ: -5,
        opacity: .25
    })
    gsap.set(photo2, {
        xPercent: 30,
        yPercent: 75,
        rotateZ: 2,
        opacity: .25
    })
    gsap.set(ball, {
        yPercent: -15,
    })

    new CardEffect(".snake__image-1")
    new CardEffect(".snake__image-2")

    //----------------------------------------------
    // Timelines init
    //----------------------------------------------

    const tl = gsap.timeline({
            defaults: {
                duration: 10
            },
            paused: true
        })
        .fromTo([photo1, photo1gif], {
            yPercent: 25,
            rotateZ: -5,
        }, {
            duration: 15,
            z: 1,
            rotateZ: -5,
            yPercent: -35,
            ease: 'power4.inOut',
        })
        .fromTo(photo2, {
            yPercent: 75,
            rotateZ: 2,
        }, {
            duration: 15,
            z: 1,
            delay: 1,
            rotateZ: 15,
            yPercent: -35,
            ease: 'power4.inOut',
        }, '<')
        .fromTo([photo1, photo2, photo1gif], {
            opacity: .25
        }, {
            opacity: 1,
            duration: 3,
            ease: 'power4.inOut'
        }, '<')
        .fromTo(ball, {
            yPercent: -15
        }, {
            yPercent: -5,
            duration: 5,
            delay: 3,
            ease: 'power4.inOut'
        }, '<')
        .fromTo(textPath, {
            attr: {
                startOffset: "100%"
            }
        }, {
            attr: {
                startOffset: '0%'
            },
            ease: 'power4.inOut',
            duration: 15,
        }, '<')

    mm.add("(min-width: 993px)", () => {
        const st = ScrollTrigger.create({
            trigger: ball,
            start: `top bottom`,
            end: "bottom top",
            scrub: 3,
            fastScrollEnd: false,
            animation: tl
        });

        return () => {
            st.kill(true)
        }
    })
    mm.add("(max-width: 992px)", () => {
        const st = ScrollTrigger.create({
            trigger: ball,
            start: `top bottom`,
            end: "bottom top",
            scrub: 3,
            fastScrollEnd: false,
            onUpdate: ({
                progress
            }) => tl.progress() < progress ? tl.progress(progress) : null
        });

        return () => {
            st.kill(true)
        }
    })

    video.play().catch((error) => {
        if (error.name === "NotAllowedError") {
            videoContainer.style.display = 'none'
            gif.style.display = 'block'
        }
    });

}