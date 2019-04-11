window.onload = function () {
    let selBut = document.getElementById('selectDomBut')
    selBut.addEventListener('click', function () {
        update()
    }, false);
    let creBut = document.getElementById('createMaskBut')
    creBut.addEventListener('click', function () {
        mask()
    }, false);
}