/*
 * @Author: Dream 
 * @Date: 2019-04-08 08:56:14 
 * @Last Modified by: Dream
 * @Last Modified time: 2019-04-09 10:07:15
 */
let clientList = [{
    width: '320',
    height: '568'
},
{
    width: '375',
    height: '667'
},
{
    width: '414',
    height: '736'
},
{
    width: '375',
    height: '812'
}
];
let src = document.getElementById('iframe').getAttribute('src');
/**
* 调整iframe窗口大小
* @param {宽高配置} obj 
*/
const toggleClient = (obj) => {
    document.getElementById('iframeWrap').style.width = clientList[obj.value].width + 'px';
    document.getElementById('iframeWrap').style.height = clientList[obj.value].height + 'px';
    
    document.getElementById('iframe').setAttribute('src', src);
} 
window.onload = function() {
    let iframeWrap = document.getElementById('iframeWrap');
    let panel = document.getElementById('panel');
    let checkBtn = document.getElementById('check');
    let deleteBtn = document.getElementById('delete');
    let areaType = 0; //选区类型(0:矩形选区、1：圆形选区)
    let currentArea = null; //当前选区
    let wrapInfo = { //iframe容器信息
        'width': iframeWrap.offsetWidth,
        'height': iframeWrap.offsetHeight,
        'top': iframeWrap.offsetTop,
        'left': iframeWrap.offsetLeft,
    };
    let createStart = {};
    let createFlag = false;
    let selectedAreaInfo = []; //选区信息
    let totalAreaInfo = { //总面积
        u: 0,
        d: wrapInfo.height,
        l: 0,
        r: wrapInfo.width
    };
    //确认选区
    checkBtn.onclick = () => {
        getSelectAreaInfo();
        if(!document.getElementsByClassName('mask').length){
            drawAll();
        }
        
        let drapList = document.getElementsByClassName('drap');
        Array.prototype.slice.call(drapList).forEach((item) => {
            panel.removeChild(item);
        })
    };
    //删除选区
    deleteBtn.onclick = () => {
        panel.innerHTML = '';
        panelInit();
    }
    //获取选区信息
    const getSelectAreaInfo =  () => {
        let drapList = document.getElementsByClassName('drap');
        for (let i = 0; i < drapList.length; i++) {
            selectedAreaInfo.push({
                u: Number(drapList[i].style.top.slice(0, - 2)),
                d: Number(drapList[i].style.top.slice(0, - 2)) + Number(drapList[i].style.height.slice(0, - 2)),
                l: Number(drapList[i].style.left.slice(0, - 2)),
                r: Number(drapList[i].style.left.slice(0, - 2)) + Number(drapList[i].style.width.slice(0, - 2)),
                type: drapList[i].getAttribute('data-type'),
                radius: {
                    'topLeft': +drapList[i].getAttribute('data-radius').split('/')[0],
                    'topRight': +drapList[i].getAttribute('data-radius').split('/')[1],
                    'bottomRight': +drapList[i].getAttribute('data-radius').split('/')[2],
                    'bottomLeft': +drapList[i].getAttribute('data-radius').split('/')[3],
                }
            })
        }
        console.log(selectedAreaInfo);
    }
    //绘制遮罩
    const drawAll = () => {
        let beCut2 = new Area(totalAreaInfo);
        let seizeAreaArr = [];
        selectedAreaInfo.forEach((item) => {
            seizeAreaArr.push(new Area(item));
            if(item.type == "cricle"){
                drawCricleMaskAll((item.d - item.u)/2, item.u, item.l);
            }else{
                if(item.radius.topLeft !== 0){
                    drawCricleMask(item.radius.topLeft, 0, item.u, item.l);
                }
                if(item.radius.topRight !== 0){
                    drawCricleMask(item.radius.topRight, 1, item.u, item.r - item.radius.topRight);
                }
                if(item.radius.bottomRight !== 0){
                    drawCricleMask(item.radius.bottomRight, 2, item.d - item.radius.bottomRight, item.r - item.radius.bottomRight);
                }
                if(item.radius.bottomLeft !== 0){
                    drawCricleMask(item.radius.bottomLeft, 3, item.d - item.radius.bottomLeft, item.l);
                }
            }
        })

        let drawAreaList = Area.multipleSplitArea(beCut2, seizeAreaArr);
        drawAreaList.forEach((item) => {
            drawSquareMask(item.u, item.d, item.l, item.r);
        })
    };
    //初始化画板
    const panelInit = () => {
        selectedAreaInfo.length = 0;
    }
    /**********************************选区Start**********************************/
    panel.addEventListener('mousedown', function(ev){
        areaType = +getRadioButtonCheckedValue('chooseType');
        createStart = {
            'X': ev.clientX,
            'Y': ev.clientY
        };
        
        if(judgeAreaCover(ev.clientX, ev.clientY)) return; //选区重合
        
        currentArea = createArea();
        currentArea.style.top = createStart.Y - iframeWrap.offsetTop + 'px';
        currentArea.style.left = createStart.X - iframeWrap.offsetLeft + 'px';
        createFlag = true;

        panel.addEventListener('mousemove', doCreate);
        panel.addEventListener('mouseup', () => panel.removeEventListener('mousemove', doCreate));
        ev.preventDefault(); 
        ev.stopPropagation(); 
    });
    //移动计算
    const doCreate = (ev) => {
        if(areaType){//圆形
            if(ev.clientX < createStart.X){//向左
                currentArea.style.left = ev.clientX - wrapInfo.left + 'px';
                currentArea.style.width = createStart.X - ev.clientX + 'px';
                currentArea.style.height = createStart.X - ev.clientX + 'px';
            }else{
                currentArea.style.width = ev.clientX - createStart.X + 'px';
                currentArea.style.height = ev.clientX - createStart.X + 'px';
            };

            if(ev.clientY < createStart.Y){
                currentArea.style.top = ev.clientY - wrapInfo.top + 'px';
            }

        }else{//矩形
            if(ev.clientX < createStart.X){//向左
                currentArea.style.left = ev.clientX - wrapInfo.left + 'px';
                currentArea.style.width = createStart.X - ev.clientX + 'px';
            }else{
                currentArea.style.width = ev.clientX - createStart.X + 'px';
            };
    
            if(ev.clientY < createStart.Y){//向上
                currentArea.style.top = ev.clientY - wrapInfo.top + 'px';
                currentArea.style.height = createStart.Y - ev.clientY + 'px';
            }else{
                currentArea.style.height = ev.clientY - createStart.Y + 'px';
            }
        }
    }
    //创建选区
    const createArea = function(){
        let drap = document.createElement('div');
        let move = document.createElement('div');
        let zoom = document.createElement('div');
        drap.setAttribute('class', 'drap');
        move.setAttribute('class', 'move');
        zoom.setAttribute('class', 'zoom');
        drap.appendChild(move);
        drap.appendChild(zoom);
        panel.appendChild(drap);
        if (areaType) {
            drap.style.borderRadius = '50%';
            drap.setAttribute('data-type', 'cricle');
            drap.setAttribute('data-radius', 50 + '/' + 50 + '/' + 50 + '/' + 50);
        } else {
            let topLeft = document.getElementById('lefttop').value;
            let topRight = document.getElementById('righttop').value;
            let bottomRight = document.getElementById('rightdown').value;
            let bottomLeft = document.getElementById('leftdown').value;
            drap.style.borderTopLeftRadius = topLeft + 'px';
            drap.style.borderTopRightRadius = topRight + 'px';
            drap.style.borderBottomRightRadius = bottomRight + 'px';
            drap.style.borderBottomLeftRadius = bottomLeft + 'px';
            drap.setAttribute('data-type', 'square');
            drap.setAttribute('data-radius', topLeft + '/' + topRight + '/' + bottomRight + '/' + bottomLeft);
        }
        return drap;
    };
    //判断选区是否覆盖
    const judgeAreaCover = (x, y) => {
        x = x - wrapInfo.left;
        y = y - wrapInfo.top;
        let start = {};
        let end = {};
        let drapList = document.getElementsByClassName('drap');
        let isCover = false;
        if(!drapList.length) return;
        isCover = Array.prototype.slice.call(drapList).some(function(item){
            start.x = item.offsetLeft;
            start.y = item.offsetTop;
            end.x = item.offsetLeft + item.offsetWidth;
            end.y = item.offsetTop + item.offsetHeight;
            
            let result = start.x < x && x < end.x && start.y < y && y < end.y;
            return result;
        });
        return isCover;
    }
    /**********************************选区End************************************/

    /**********************************移动Start**********************************/
    let divStart = {
        'x': 0,
        'y': 0
    };
    window.addEventListener('mousedown', (ev) => {
        let tagName = ev.target.className;
        if(tagName === 'move'){
            divStart.x = ev.offsetX;
            divStart.y = ev.offsetY;
        }
        window.addEventListener('mousemove', doMove);
        window.addEventListener('mouseup', () => window.removeEventListener('mousemove', doMove));
    });
    //移动选区
    const doMove = (ev) => {
        let tagName = ev.target.className;
        let parent = ev.target.parentNode;
        if(tagName === 'move'){
            let l = ev.clientX - (divStart.x + wrapInfo.left);
            let t = ev.clientY - (divStart.y + wrapInfo.top);
            if (t < 0) {
                t = 0
            } else if (t > wrapInfo.height - parent.offsetHeight) {
                t = wrapInfo.height - parent.offsetHeight;
            }
            if (l < 0) {
                l = 0
            } else if (l > wrapInfo.width - ev.target.offsetWidth) {
                l = wrapInfo.width - ev.target.offsetWidth;
            }
            parent.style.top = t + 'px';
            parent.style.left = l + 'px';
        }
    }
    /**********************************移动End************************************/
    /**********************************缩放Start**********************************/
    let zoomStart = {
        'x': 0,
        'y': 0
    };
    let zoomOffset = {
        'x': 0,
        'y': 0
    }
    window.addEventListener('mousedown', (ev) => {
        let tagName = ev.target.className;
        console.log(tagName);
        if(tagName === 'zoom'){
            zoomStart.x = ev.clientX;
            zoomStart.y = ev.clientY;
            zoomOffset.x = ev.target.offsetLeft;
            zoomOffset.y = ev.target.offsetTop;
            window.addEventListener('mousemove', doZoom);
            window.addEventListener('mouseup', () => window.removeEventListener('mousemove', doZoom));
        }
    })
    const doZoom = (ev) => {
        let tagName = ev.target.className;
        if(tagName === 'zoom'){
            let parent = ev.target.parentNode;
            let l = ev.clientX - zoomStart.x + zoomOffset.x;
            let t = ev.clientY - zoomStart.y + zoomOffset.y;

            let w = l + ev.target.offsetWidth;
            let h = t + ev.target.offsetHeight;
            if (w < ev.target.offsetWidth) {
                w = ev.target.offsetWidth;
            } else if (w > wrapInfo.width - parent.offsetLeft) {
                w = wrapInfo.width - parent.offsetLeft - 2;
            }
            if (h < ev.target.offsetHeight) {
                h = ev.target.offsetHeight;
            } else if (h > wrapInfo.height - parent.offsetTop) {
                h = wrapInfo.height - parent.offsetTop - 2;
            }
            parent.style.width = w + 'px';
            parent.style.height = h + 'px';
        }
    }
    /**********************************缩放End************************************/
    /**
     * 绘制矩形遮罩
     * @param {*} top 
     * @param {*} bottom 
     * @param {*} left 
     * @param {*} right 
     */
    const drawSquareMask = (top, bottom, left, right) => {
        let mask = document.createElement('div');
        mask.setAttribute('class', 'mask');
        mask.style.cssText = `top:${top}px;height:${bottom - top}px;left:${left}px;width:${right - left}px;`;
        panel.appendChild(mask);
    }
    /**
     * 绘制四部分圆切区域遮罩
     * @param {*} raduis 
     * @param {*} top 
     * @param {*} left 
     */
    const drawCricleMaskAll = (raduis, top, left) => {
        drawCricleMask(raduis, 0, top, left);
        drawCricleMask(raduis, 1, top, left + raduis);
        drawCricleMask(raduis, 2, top + raduis, left + raduis);
        drawCricleMask(raduis, 3, top + raduis, left);
    }
    /**
     * 绘制圆切部分遮罩
     * @param {*} radius 
     * @param {*} direction 
     * @param {*} top 
     * @param {*} left 
     */
    const drawCricleMask = (radius, direction, top, left) => {
        let directionArr = ['right bottom', 'left bottom', 'left top', 'right top'];
        var radiusarea = document.createElement('div');
        radiusarea.setAttribute('class', 'mask');
        radiusarea.style.cssText = `top: ${top}px;left: ${left}px;width:${radius}px;height:${radius}px;background:radial-gradient(${2 * radius}px at ${directionArr[direction]},transparent 50%, rgba(0, 0, 0, 0.3) 50%)`;
        panel.appendChild(radiusarea);
    };
    /**
     * 获取input = radio 单选框中选中的值
     * @param tagNameAttr string  radio组中input的name属性值
     * return 返回被选中radio的值
     */
    const getRadioButtonCheckedValue =  (tagNameAttr) =>{
        var radio_tag = document.getElementsByName(tagNameAttr);
        for(var i=0;i<radio_tag.length;i++){
            if(radio_tag[i].checked){
                var checkvalue = radio_tag[i].value;            
                return checkvalue;
            }
        }
    }
    /***************************计算多选区遮罩部分Start******************************/
    /**
     * x是否在a,b之间(不含a,b)
     * @param {*} a 
     * @param {*} b 
     * @param {*} x 
     */
    function between(a, b, x) {
        let min = a > b ? b : a
        let max = a >= b ? a : b
        return x > min && x < max
    }

    class Area {
        constructor(obj) {
            this.u = obj.u//上边
            this.d = obj.d//下边
            this.l = obj.l//左边
            this.r = obj.r//右边
        }

        /**
         * 切割
         * @param {Area} beCut 需要切割的区域
         * @param {Area} seizeArea 需要高亮的区域
         */
        static splitArea(beCut, seizeArea) {
            if (!beCut instanceof Area) return console.error('beCut需为Area类型')
            if (!seizeArea instanceof Area) return console.error('seizeArea需为Area类型')
            let result = []
            if (between(beCut.l, beCut.r, seizeArea.l) && (between(beCut.u, beCut.d, seizeArea.u) || between(beCut.u, beCut.d, seizeArea.d) || (seizeArea.u <= beCut.u && seizeArea.d >= beCut.d))) {//左包含
                let newLeft = { l: beCut.l, r: seizeArea.l, u: beCut.u, d: beCut.d }
                result.push(new Area(newLeft))
            }
            if (between(beCut.l, beCut.r, seizeArea.r) && (between(beCut.u, beCut.d, seizeArea.u) || between(beCut.u, beCut.d, seizeArea.d) || (seizeArea.u <= beCut.u && seizeArea.d >= beCut.d))) {//右包含
                let newLeft = { l: seizeArea.r, r: beCut.r, u: beCut.u, d: beCut.d }
                result.push(new Area(newLeft))
            }
            if (between(beCut.u, beCut.d, seizeArea.u) && (between(beCut.l, beCut.r, seizeArea.l) || between(beCut.l, beCut.r, seizeArea.r) || (seizeArea.l <= beCut.l && seizeArea.r >= beCut.r))) {//上包含
                let newLeft = {
                    l: beCut.l > seizeArea.l ? beCut.l : seizeArea.l,
                    r: beCut.r < seizeArea.r ? beCut.r : seizeArea.r,
                    u: beCut.u,
                    d: seizeArea.u
                }
                result.push(new Area(newLeft))
            }
            if (between(beCut.u, beCut.d, seizeArea.d) && (between(beCut.l, beCut.r, seizeArea.l) || between(beCut.l, beCut.r, seizeArea.r) || (seizeArea.l <= beCut.l && seizeArea.r >= beCut.r))) {//下包含
                let newLeft = {
                    l: beCut.l > seizeArea.l ? beCut.l : seizeArea.l,
                    r: beCut.r < seizeArea.r ? beCut.r : seizeArea.r,
                    u: seizeArea.d,
                    d: beCut.d
                }
                result.push(new Area(newLeft))
            }
            if (!result.length) result.push(beCut)//不需要切割
            return result
        }

        /**
         * 多重切割之术
         * @param {Area} windowArea 
         * @param {Array<Area>} seizeAreaArray 
         */
        static multipleSplitArea(windowArea, seizeAreaArray) {
            if (!windowArea instanceof Area) return console.error('window需为Area类型')
            seizeAreaArray.filter(seizeArea => {
                if (!seizeArea instanceof Area) return console.error('seizeArea需为Area类型')
            })
            let result = []
            let beCutArr = [windowArea]
            for (let i = 0; i < seizeAreaArray.length; i++) {//循环高亮区域
                let seizeArea = seizeAreaArray[i]
                result = []
                for (let j = 0; j < beCutArr.length; j++) {//双重循环,最为致命
                    let beCut = beCutArr[j]//循环切割
                    result = [...result, ...Area.splitArea(beCut, seizeArea)]
                }
                beCutArr = [...result]
            }
            return result
        }
    }
    /***************************计算多选区遮罩部分End******************************/
};
