window.onload = function () {
    let marginConfig = {
        top: +document.getElementById('upMargin').value,
        bottom: +document.getElementById('downMargin').value,
        left: +document.getElementById('leftMargin').value,
        right: +document.getElementById('rightMargin').value,
    };

    let selBut = document.getElementById('selectDomBut')
    selBut.addEventListener('click', function () {
        update(marginConfig)
    }, false);
    let creBut = document.getElementById('createMaskBut')
    creBut.addEventListener('click', function () {
        console.log('生成遮罩')
        mask();
    }, false);
    let setBut = document.getElementById('setIframeUrlBut')
    setBut.addEventListener('click', function () {
        let url = document.getElementById('iframeUrl').value
        setUrl(url)
    }, false);
    let downBut = document.getElementById('downloadCfg')
    downBut.addEventListener('click', function () {
        console.log('domList', domList)
        downloadFile('cfg.json', domList);
    }, false);

    setUrl();

    
}

function downloadFile(fileName, content) { //创建文件内容
    var aLink = document.createElement('a');
    var blob = new Blob([content]); //创建二进制文件
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName; //下载文件名
    aLink.href = URL.createObjectURL(blob); //根据二进制文件生成对象
    aLink.dispatchEvent(evt); //触发点击
}