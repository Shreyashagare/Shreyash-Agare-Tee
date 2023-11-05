export const initHeader = () => {
    const element = document.querySelector('.header')
    if (!element) return

    const menu = document.querySelector('.menu')
    const menuBtn = document.querySelector('.header__menu--button')
    const menuLinks = menu.querySelectorAll('.menu__list-item')
    const mobileContact = document.querySelector('.header--mobile .header__menu--help')

    const state = {
        isActive: false
    }

    const closeMenu = () => {
        menu.classList.remove('is-active')
        menuBtn.classList.remove('is-active')
        state.isActive = false
    }

    const openMenu = () => {
        menu.classList.add('is-active')
        menuBtn.classList.add('is-active')
        state.isActive = true
    }

    const onClick = () => {
        if (state.isActive) return closeMenu()
        openMenu()
    }

    [...menuLinks, mobileContact].forEach(item => {
        item.addEventListener('click', () => {
            closeMenu()
        })
    })

    menuBtn.addEventListener('click', onClick)

}