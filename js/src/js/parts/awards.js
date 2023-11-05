import gsap from 'gsap'
import {
    BallAnimation
} from "./canvas/awards";

export const initAwards = () => {
    const element = document.querySelector('.awards')
    if (!element) return

    const awardsBalls = new BallAnimation()

    gsap.timeline({
        scrollTrigger: {
            trigger: '.awards',
            start: 'center center',
            end: "bottom -20%",
            onEnter: () => {
                if (awardsBalls.isRunning) {
                    awardsBalls.resume()
                } else {
                    awardsBalls.init()
                }
            },
            onLeave: () => {
                awardsBalls.pause()
            },
            onEnterBack: () => {
                awardsBalls.resume()
            },
            onLeaveBack: () => {
                awardsBalls.pause()
            }
        }
    })
}