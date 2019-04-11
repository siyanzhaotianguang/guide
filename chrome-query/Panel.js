window.onload = function () {
    let selBut = document.getElementById('selectDomBut')
    selBut.addEventListener('click', function () {
        update()
    }, false);
    let creBut = document.getElementById('createMaskBut')
    creBut.addEventListener('click', function () {
        mask()
    }, false);
    let setBut = document.getElementById('setIframeUrlBut')
    setBut.addEventListener('click', function () {
        let url = document.getElementById('iframeUrl').value
        setUrl(url)
    }, false);
    let downBut = document.getElementById('downloadCfg')
    downBut.addEventListener('click', function () {
        console.log('domList', domList)
        downloadFile('cfg.json', JSON.stringify(domList));
    }, false);

    setUrl()
}

function downloadFile(fileName, content) { //创建文件内容
    var aLink = document.createElement('a');
    var blob = new Blob([content], { type: 'application/json' }); //创建二进制文件
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName; //下载文件名
    aLink.href = URL.createObjectURL(blob); //根据二进制文件生成对象
    aLink.dispatchEvent(evt); //触发点击
}