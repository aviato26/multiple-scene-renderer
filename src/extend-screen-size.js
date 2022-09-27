

export default function extendScreenSize(){
    const body = document.querySelector('body');

    // setting height to 4 times the size of the current window since there should be four textures
    body.style.height = `${window.innerHeight * 4}px`;
    body.style.backgroundColor = `black`;
}