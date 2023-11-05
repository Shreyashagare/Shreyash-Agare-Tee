import gsap from 'gsap'
import {
    CardEffect
} from "./helpers/hoverEffect";

export const initTeacher = () => {
    const teacher = document.querySelector('.teacher')
    if (!teacher) return

    const ball = teacher.querySelector('.teacher__ball')
    const items = gsap.utils.toArray('.teacher__item')
    const teacherItem = gsap.utils.toArray('.teacher__item-container')
    const mm = gsap.matchMedia()

    gsap.set(ball, {
        scale: .2
    })

    mm.add("(min-width: 768px)", () => {
        items.forEach((item, i) => {
            const hoverItem = item.querySelector('.teacher__item-hover')
            new CardEffect(hoverItem)
            window.smooth.effects(item, {
                speed: 1.5 - i * 0.1,
                lag: 0
            });
        })

        const teacherTl = gsap.timeline({
                invalidateOnRefresh: true,
                scrollTrigger: {
                    trigger: ball,
                    start: 'center center',
                    end: '+=150%',
                    scrub: 0,
                    invalidateOnRefresh: true,
                }
            })
            .fromTo(teacherItem, {
                rotate: "random(-2, 2, 0.01)"
            }, {
                rotate: "random(-2, 2, 0.01)",
                duration: 3
            })
            .fromTo(ball, {
                yPercent: 0,
                scale: .2,
            }, {
                yPercent: 90,
                scale: 3.5,
                duration: 2,
                ease: "power4.in"
            }, '<')

        return () => {
            teacherTl.kill(true)
            window.smooth.effects(items, {
                speed: 1,
                lag: 0
            });
        }
    })

    mm.add("(max-width: 767px)", () => {
        gsap.set(teacherItem, {
            rotate: 0
        })

        const teacherTl = gsap.timeline({
                invalidateOnRefresh: true,
                repeatRefresh: true,
                scrollTrigger: {
                    trigger: ball,
                    start: 'center center',
                    end: '+=100%',
                    scrub: 0,
                    invalidateOnRefresh: true,
                }
            })
            .fromTo(ball, {
                yPercent: 0,
                scale: .2,
            }, {
                yPercent: 200,
                scale: 6,
                duration: 3,
                ease: 'power2.inOut'
            }, '<')

        return () => {
            teacherTl.kill(true)
        }
    })

}