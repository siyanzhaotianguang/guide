window.onload = function () {
    const getOption = () => {
        let obj = {
            top: +document.getElementById('upMargin').value,
            bottom: +document.getElementById('downMargin').value,
            left: +document.getElementById('leftMargin').value,
            right: +document.getElementById('rightMargin').value,
        };
        return obj
    };

    let iframeUrlInput = document.getElementById('iframeUrl');
    iframeUrlInput.addEventListener('change', function () {
        let url = this.value
        setUrl(url)
    })
    //按钮点击事件
    let selBut = document.getElementById('selectDomBut')
    selBut.addEventListener('click', function () {
        let marginConfig = getOption();
        update(marginConfig)
    }, false);
    let creBut = document.getElementById('createMaskBut')
    creBut.addEventListener('click', function () {
        mask();
    }, false);
    // let setBut = document.getElementById('setIframeUrlBut')
    // setBut.addEventListener('click', function () {
    //     let url = document.getElementById('iframeUrl').value
    //     setUrl(url)
    // }, false);
    let downBut = document.getElementById('downloadCfg')
    downBut.addEventListener('click', function () {
        downloadFile('cfg.json', JSON.stringify(exportContent))
    }, false);
    let saveBut = document.getElementById('saveCurrentStep')
    saveBut.addEventListener('click', function () {
        getCfgAndDomList(function (err, data) {
            saveCurrentStep(data)
            setUrl(frameUrl)
        })
    }, false);

    setUrl();

    //输入框更新扩展区域
    let upInput = document.getElementById('upMargin');
    upInput.addEventListener('keyup', function () {
        let currentValue = getOption();
        changeValue(currentValue);
    })
    let bottomInput = document.getElementById('downMargin');
    bottomInput.addEventListener('keyup', function () {
        let currentValue = getOption();
        changeValue(currentValue);
    })
    let leftInput = document.getElementById('leftMargin');
    leftInput.addEventListener('keyup', function () {
        let currentValue = getOption();
        changeValue(currentValue);
    })
    let rightInput = document.getElementById('rightMargin');
    rightInput.addEventListener('keyup', function () {
        let currentValue = getOption();
        changeValue(currentValue);
    })

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