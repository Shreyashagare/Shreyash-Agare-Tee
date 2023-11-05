import Lottie from "lottie-web/build/player/lottie_light"
import {
    gsap
} from "gsap"
import {
    ScrollTrigger
} from "gsap/ScrollTrigger"

import {
    BallAnimation
} from "./canvas/principles"

export const initPrinciples = () => {
    const element = document.querySelector('.principles')
    if (!element) return

    const principlesItems = gsap.utils.toArray(".principles__item")
    const lottiesItems = gsap.utils.toArray('.principles__item-lottie')
    const ballCanvas = new BallAnimation()

    gsap.set(principlesItems, {
        opacity: 0,
        scale: 0.5
    })

    const lotties = lottiesItems.map((container, i) =>
        Lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: `../assets/svg/lottie-d/Icon${i + 1}.json`
        })
    )

    const startLottie = (batch) => {
        principlesItems.forEach((item, i) => {

            // item.addEventListener('mouseenter', () => {
            //   lotties[i].setDirection(-1)
            //   lotties[i].goToAndPlay(lotties[i].currentFrame, true)
            // })
            // item.addEventListener('mouseleave', () => {
            //   lotties[i].setDirection(1)
            //   lotties[i].goToAndPlay(lotties[i].currentFrame, true)
            // })
            if (item !== batch[0]) return
            setTimeout(() => {
                lotties[i].play()
            }, 800)
        })
    }


    const b = ScrollTrigger.batch(principlesItems, {
        onEnter: (batch) => {
            batch.forEach((card, index) => {
                gsap.fromTo(
                    card, {
                        opacity: 0,
                        scale: 0.5
                    }, {
                        opacity: 1,
                        scale: 1,
                        stagger: 0.5,
                        delay: index * .5,
                        duration: 1,
                        ease: 'power2.out'
                    }
                )
            })
            startLottie(batch)
        },
        interval: 0.1,
        batchMax: 1,
        once: true
    })

    gsap.timeline({
        scrollTrigger: {
            trigger: '.principles__items',
            start: 'center center',
            end: "bottom -20%",
            onEnter: () => {
                if (ballCanvas.isRunning) return ballCanvas.resume()
                ballCanvas.init()
            },
            onLeave: () => {
                ballCanvas.pause()
            },
            onEnterBack: () => {
                ballCanvas.resume()
            },
            onLeaveBack: () => {
                ballCanvas.pause()
            }
        }
    })
}