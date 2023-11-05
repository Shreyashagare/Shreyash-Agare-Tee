export const initScrollTo = () => {
    const innerLinks = document.querySelectorAll('.scrollTo')

    const scrollTo = (e) => {
        e.preventDefault()
        const section = e.currentTarget.getAttribute('href')
        const target = document.querySelector(section)

        window.smooth.scrollTo(target, true)
    }

    innerLinks.forEach(link => {
        link.addEventListener('click', scrollTo)
    })
}