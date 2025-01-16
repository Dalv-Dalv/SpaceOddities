window.addEventListener("load", main);
function main() {
    // Extend the panel out after scrolling past the section
    const panel = document.getElementById('popoutMenu');
    const triggerSection = document.getElementById('curiosities');
    const triggerOffset = triggerSection.offsetTop;

    window.addEventListener('scroll', () => {
        console.log(window.scrollY, window.innerHeight, triggerOffset);
        if (window.scrollY > triggerOffset + 200) {
            panel.classList.add('visible');
        } else {
            panel.classList.remove('visible');
        }
    });
}




