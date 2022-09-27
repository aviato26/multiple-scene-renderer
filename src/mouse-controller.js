

export default function mouseController(){
    const totalScreenHeight = window.innerHeight * 4;
    window.addEventListener('scroll', (e) => console.log((window.pageYOffset / totalScreenHeight) * 100));
}