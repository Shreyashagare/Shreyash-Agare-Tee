import {
    CustomEase
} from "gsap/CustomEase";

export const setEasings = () => {
    CustomEase.create(
        "over",
        "M0,0 C0.242,0.358 0.156,0.19 0.516,0.872 0.765,1.344 0.818,1.001 1,1 "
    );

    CustomEase.create(
        "over1",
        "M0,0 C0.242,0.358 0.156,0.19 0.516,0.872 0.765,1.144 0.818,1.001 1,1 "
    );
}