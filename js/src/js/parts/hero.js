import {
    gsap
} from "gsap";
import {
    CardEffect
} from "./helpers/hoverEffect";



export const initHero = (withPreloader) => {
    const hero = document.querySelector(".hero");
    if (!hero) return

    //----------------------------------------------
    // Elements
    //----------------------------------------------
    const preloader = document.querySelector('.preloader')
    const headerMenu = gsap.utils.toArray(".header__menu");
    const ball = hero.querySelector(".hero__ball");
    const podium = hero.querySelector(".hero__podium");
    const podiumBG = hero.querySelector('.hero__podium-bg')
    const name = hero.querySelector(".hero__name");
    const surname = hero.querySelector(".hero__surname");
    const space = document.querySelector(".hero__space");
    const bottomSpace = document.querySelector(".hero__bottom-space");
    const dashes = document.querySelector(".hero__dashes");
    const underlines = document.querySelectorAll('.hero__underline')
    const introduction = document.querySelectorAll('.introduction')
    const mm = gsap.matchMedia()

    //----------------------------------------------
    // Timelines init
    //----------------------------------------------
    const headerTimeline = gsap.timeline().pause();
    let rollAwayTimeline = null

    gsap.timeline({
        scrollTrigger: {
            trigger: ".hero__podium-text",
            start: 'top top+=200',
            once: true,
            onEnter: () => {
                gsap.fromTo(underlines, {
                    width: 0
                }, {
                    width: '100%',
                    duration: 1,
                    stagger: .5,
                    ease: 'power4.out'
                })
            }
        }
    })

    //----------------------------------------------
    // Initial Params
    //----------------------------------------------

    if (withPreloader) {
        setTimeout(() => {
            window.smooth.paused(true)
        }, 100)

        setTimeout(() => {
            gsap.to(preloader, {
                opacity: 0,
                duration: .5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    headerTimeline.play()
                    window.smooth.paused(false)
                }
            })
        }, 3000)
    } else {
        headerTimeline.play()
    }

    gsap.set(underlines, {
        width: 0
    })

    //----------------------------------------------
    // Timelines
    //----------------------------------------------

    const setRollawayTimeline = (mobile) => gsap.timeline({
            paused: true,
            scrollTrigger: {
                trigger: ".hero__wrapper",
                start: mobile ? 'top+=50 top' : 'top top',
                scrub: mobile ? false : 2,
                invalidateOnRefresh: mobile ? false : true,
                toggleActions: mobile ? "play none none reverse" : undefined,
                fastScrollEnd: false,
                preventOverlaps: true
            }
        })
        .fromTo([podium, bottomSpace, podiumBG], {
            y: 0,
            rotation: 0,
        }, {
            y: 0,
            rotation: 15,
            duration: 0.3,
            ease: "power1.inOut",
        }, '<')
        .fromTo(
            ball, {
                y: 0,
                x: 0,
                rotation: 0,
                immediateRender: false,
            }, {
                y: 250,
                x: window.innerWidth > 1440 ? 1000 : (!mobile ? window.innerWidth / 2.1 : 1000),
                z: 0,
                duration: 1.5,
                delay: 0,
                rotation: mobile ? 700 : 250,
                ease: "power1.inOut",
            },
            "<"
        )
        .fromTo(
            space, {
                x: 0,
                scaleY: 1
            }, {
                scaleY: 2,
                duration: .1,
                ease: "power1.inOut",
            },
            "<"
        )
        .to([podium, bottomSpace, podiumBG], {
            rotation: 0,
            duration: 2.5,
            ease: "elastic.out",
        })
        .to(
            ball, {
                y: 420,
                x: 2000,
                z: 0,
                duration: 1,
                delay: 0,
                rotation: 600,
                ease: "power1.inOut",
            },
            "<"
        ).timeScale(1.2)

    mm.add("(min-width: 768px)", () => {
        rollAwayTimeline = setRollawayTimeline()

        return () => {
            rollAwayTimeline.kill()
        }
    })
    mm.add("(max-width: 767px)", () => {
        rollAwayTimeline = setRollawayTimeline(true)

        return () => {
            rollAwayTimeline.kill()
        }
    })

    headerTimeline
        .from(
            [headerMenu, introduction], {
                y: -20,
                opacity: 0,
                ease: "power2.inOut",
                duration: 1.4,
            })
        .fromTo(
            [podium, bottomSpace], {
                y: 135,
            }, {
                y: 0,
                duration: 1,
                ease: "over",
            }, "<")
        .fromTo(
            dashes, {
                yPercent: -100,
                opacity: 0
            }, {
                opacity: 1,
                yPercent: 0,
                duration: 1.4,
                delay: 0.5,
                ease: 'power4.out',
            },
            "<")
        .fromTo(
            [ball, space], {
                y: "-200vh",
                z: 0,
                overwrite: 'all'
            }, {
                y: 0,
                z: 0,
                ease: "power4.out",
                duration: 1.4,
                overwrite: 'all'
            }, '<')
        .from(
            name, {
                y: 80,
                duration: 1,
                opacity: 0,
                ease: "power4.out",
            }, '-=0.8'
        )
        .from(
            surname, {
                y: 80,
                duration: 1,
                opacity: 0,
                ease: "power4.out",
                onComplete: () => {
                    rollAwayTimeline
                    new CardEffect(".hero__ball")
                }
            }, '-=0.5'
        )
}