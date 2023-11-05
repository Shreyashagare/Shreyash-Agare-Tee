import gsap from "gsap";

export const initMagicHover = () => {
    const magnets = document.querySelectorAll('.magnetic')
    const strength = 8

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', moveMagnet);
        magnet.addEventListener('mouseout', function(event) {
            gsap.to(event.currentTarget, {
                x: 0,
                y: 0,
                z: 0,
                ease: 'power4.out',
                duration: 1,
                onComplete: () => {
                    if (!event.currentTarget ? .style) return
                    event.currentTarget.style.transform = null
                }
            })
        });
    });

    function moveMagnet(event) {
        const magnetButton = event.currentTarget
        const bounding = magnetButton.getBoundingClientRect()

        let moveX = 0.5,
            moveY = magnetButton.classList.contains('custom-magnetic') ? 1 : 0.5

        console.log(magnetButton)

        gsap.to(magnetButton, {
            x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - moveX) * strength,
            y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - moveY) * strength,
            z: 0,
            duration: 1,
            ease: 'power4.out'
        })
    }
}