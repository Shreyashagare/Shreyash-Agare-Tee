import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
import {
    Observer
} from "gsap/Observer";
import {
    initAwards
} from "./canvas/modal-awards-init";




export const initModals = () => {
    const modalsElements = document.querySelectorAll('.modal')
    if (!modalsElements.length) return

    //-------------------------------------------------------------
    // VARIABLES
    //-------------------------------------------------------------

    const modal = document.querySelector('.modal')
    const slider = modal.querySelector('.portfolio-content__slider')
    const firstSlide = modal.querySelector('.portfolio-content__slide')
    const contents = modal.querySelectorAll('.portfolio-content__block')
    const content = modal.querySelector('.portfolio-content__content')
    const firstContentBlockItems = gsap.utils.toArray('.portfolio-content__block > *', content)
    const allContentBlockItems = gsap.utils.toArray('.portfolio-content__block > *')
    const image = firstSlide.querySelector('.portfolio-content__image')
    const speed = 2

    const progressBar = modal.querySelector('.modal__progress-bar-inner')
    const progressPage = modal.querySelector('.modal__progress-page')
    const progressTotal = modal.querySelector('.modal__progress-total')

    const mm = gsap.matchMedia();


    const sections = slider.querySelectorAll(".portfolio-content__slide")
    const images = slider.querySelectorAll(".portfolio-content__bg")
    const outerWrappers = gsap.utils.toArray(".portfolio-content__outer", slider)
    const innerWrappers = gsap.utils.toArray(".portfolio-content__inner", slider)

    const state = {
        observer: null,
        currentIndex: -1,
        animating: false
    }



    //-------------------------------------------------------------
    // COMMON LOGIC
    //-------------------------------------------------------------


    initAwards()

    contents.forEach((content, i) => {
        if (i === 0) {
            content.classList.add('is-active')
            return
        }
        content.classList.remove('is-active')
    })


    //-------------------------------------------------------------
    // MOBILE / TABLET LOGIC
    //-------------------------------------------------------------
    mm.add("(max-width: 992px)", () => {
        const timelines = []
        gsap.set(allContentBlockItems, {
            y: 80
        })
        const triggers = ScrollTrigger.batch(allContentBlockItems, {
            interval: 0.1,
            batchMax: 1,
            start: 'top bottom+=80',
            onEnter: (elements, triggers) => {
                gsap.to(elements, {
                    y: 0,
                    stagger: 0.2,
                    duration: 1.2,
                    ease: 'power2.out'
                });
            }
        });

        return () => {
            timelines.forEach(tl => {
                triggers.kill('all')
            })
        }
    });

    //-------------------------------------------------------------
    // DESKTOP LOGIC
    //-------------------------------------------------------------
    mm.add("(min-width: 993px)", () => {
        ScrollTrigger.normalizeScroll(true)
        window.smooth.paused(true)
        window.smooth.scrollTop(0)
        gsap.set(firstContentBlockItems, {
            y: 100,
            opacity: 0
        })

        const tl = gsap.timeline().timeScale(speed)

        tl.fromTo(slider, {
            opacity: 0
        }, {
            opacity: 1,
            ease: "power1.out",
            duration: 2
        })
        tl.to(firstContentBlockItems, {
            y: 0,
            opacity: 1,
            duration: 2,
            stagger: 0.2,
            ease: "power2.out",
            onComplete: () => {
                const video = firstSlide.querySelector('video')

                if (!video) return
                video.play()
            }
        })
        if (image) {
            tl.fromTo(image, {
                opacity: 0
            }, {
                opacity: 1,
                ease: "power1.out",
                duration: 2
            }, '<')
        }

        gsap.set(progressBar, {
            scaleX: 1 / contents.length,
        })
        progressTotal.textContent = `/${contents.length}`

        gsap.set(outerWrappers, {
            yPercent: 100
        });
        gsap.set(innerWrappers, {
            yPercent: -100
        });

        contents.forEach((item, i) => {
            if (i !== state.currentIndex) {
                gsap.set(item, {
                    opacity: 0,
                    y: -100,
                    overwrite: true
                })
            } else {
                gsap.set(item, {
                    opacity: 1,
                    y: 0,
                    overwrite: true
                })
            }
        })

        if (!state.observer) {
            setObserver()
        } else {
            state.observer.enable()
        }
        state.currentIndex = -1

        const tmout = setTimeout(() => {
            gotoSection(0, 1);
        }, 100)

        return () => {
            ScrollTrigger.normalizeScroll(false)
            window.smooth.paused(false)
            clearTimeout(tmout)

            contents.forEach((item, i) => {
                gsap.set(item, {
                    opacity: 1,
                    y: 0,
                    overwrite: true
                })
            })

            state.observer.disable()

        }
    })

    //-------------------------------------------------------------
    // SLIDER CONTENT ANIMATION LOGIC
    //-------------------------------------------------------------
    const onSlideChange = (prev, next) => {
        gsap.fromTo(contents[prev], {
            y: 0,
            opacity: 1
        }, {
            y: -100,
            opacity: 0,
            delay: 0,
            duration: .4,
            ease: 'power3.out',
            overwrite: true
        })
        gsap.fromTo(contents[next], {
            y: 100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 2,
            delay: 0,
            ease: 'power3.out',
            overwrite: true,
            onComplete: () => {
                const videos = slider.querySelectorAll('video')
                const video = sections[next].querySelector('video')
                if (!videos) {
                    return
                }
                videos.forEach(vid => {
                    if (vid === video) return
                    if (vid.paused) return
                    vid.pause()
                })

                if (!video) return
                video.play()
            }
        })
        contents.forEach((item, i) => {
            if (i !== prev && i !== next) {
                gsap.set(item, {
                    opacity: 0,
                    y: -100,
                    overwrite: true
                })
            }
        })

        contents.forEach(c => c.classList.remove('is-active'))
        contents[next].classList.add('is-active')

        gsap.to(progressBar, {
            scaleX: (next + 1) / sections.length,
            ease: 'power3.out',
            duration: 1.5,
            onComplete: () => {
                progressPage.textContent = next + 1
            },
        })
    }


    //-------------------------------------------------------------
    // SLIDER ANIMATION LOGIC
    //-------------------------------------------------------------
    function gotoSection(index, direction) {

        if (state.currentIndex < 0 && index === 0) {
            gsap.set(sections, {
                zIndex: 0,
                autoAlpha: 0
            });
            gsap.set(sections[index], {
                autoAlpha: 1,
                zIndex: 1
            });
            gsap.set([outerWrappers[index], innerWrappers[index]], {
                yPercent: 0
            })
            gsap.set(images[index], {
                yPercent: 0
            })
            state.currentIndex = index;
            onSlideChange(state.currentIndex, index)

            return
        }

        state.animating = true;
        let fromTop = direction === -1,
            dFactor = fromTop ? -1 : 1,
            tl = gsap.timeline({
                defaults: {
                    duration: 1.5,
                    ease: "power3.out"
                },
                onComplete: () => state.animating = false
            });
        if (state.currentIndex >= 0) {
            gsap.set(sections[state.currentIndex], {
                zIndex: 0
            });
            tl.to(images[state.currentIndex], {
                    yPercent: -15 * dFactor
                })
                .set(sections[state.currentIndex], {
                    autoAlpha: 0
                });
        }
        gsap.set(sections[index], {
            autoAlpha: 1,
            zIndex: 1
        });
        tl.fromTo([outerWrappers[index], innerWrappers[index]], {
                yPercent: i => i ? -100 * dFactor : 100 * dFactor
            }, {
                yPercent: 0
            }, 0)
            .fromTo(images[index], {
                yPercent: 15 * dFactor
            }, {
                yPercent: 0
            }, 0)

        onSlideChange(state.currentIndex, index)

        state.currentIndex = index;
    }



    //-------------------------------------------------------------
    // OBSERVER FOR SWIPE / SCROLL
    //-------------------------------------------------------------
    function setObserver() {
        state.observer = Observer.create({
            type: "wheel,touch",
            target: '.modal__wrapper',
            wheelSpeed: -1,
            onDown: () => !state.animating && state.currentIndex && gotoSection(state.currentIndex - 1, -1),
            onUp: () => !state.animating && state.currentIndex + 1 < sections.length && gotoSection(state.currentIndex + 1, 1),
            tolerance: 10,
            preventDefault: true
        });
    }


    //-------------------------------------------------------------
    // VIDEO AUTO RUN
    //-------------------------------------------------------------
    const mobileVideos = document.querySelectorAll('.portfolio-content__content video');
    mobileVideos.forEach((video) => {
        const playPromise = video.play()
        if (playPromise === undefined) return
        playPromise.then(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.intersectionRatio !== 1 && !video.paused) return video.pause()
                        if (video.paused) return video.play()
                    })
                }, {
                    threshold: 0.2
                }
            )
            observer.observe(video);
        })
    });
}