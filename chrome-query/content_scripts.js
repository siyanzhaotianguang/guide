/**
 * 获取元素在Dom树中的位置
 * @param {*} ele 
 * @param {*} result 
 */
function getIndex(ele, result) {
    if (!ele) return
    let i = 0;
    while (true) {
        if (!ele.previousElementSibling) break
        ele = ele.previousElementSibling
        i++;
    }
    result.push(i)
    return getIndex(ele.parentNode, result);
};
//选择元素
function setSelectedElement(el, cfg) {
    let result = [];
    getIndex(el, result);
    let newresult = result.reverse();
    newresult.shift();

    domList.push({
        dom: getDomByAddress(newresult),
        option: cfg
    });
    return newresult;
}

function setUrl(url) {
    let ifr = document.getElementById("iframe")
    if (url) {
        ifr.src = url
        domList = []
    }
    return ifr.src
}

function log(data) {
    console.log('选中Dom位置信息', data);
}

let clientInfo = { //视口信息
    u: 0,
    d: document.documentElement.clientHeight,
    l: 0,
    r: document.documentElement.clientWidth
};
let domList = [];
let selectedAreaInfo = [];

//根据节点位置获取Dom
const getDomByAddress = (data) => {
    let item = [...data];
    let currentDom = document;
    while (item.length) {
        let currentIndex = item.shift();
        currentDom = currentDom.children[currentIndex];
    }
    return currentDom;
}

function createMask() {
    console.log('遮罩')
    let beCut2 = new Area(clientInfo);
    let seizeAreaArr = [];
    console.log('dom节点', domList);
    domList.forEach(item => {
        selectedAreaInfo.push({
            u: offsetDis(item.dom).top - item.option.top,
            d: offsetDis(item.dom).top + item.dom.offsetHeight + item.option.bottom,
            l: offsetDis(item.dom).left - item.option.left,
            r: offsetDis(item.dom).left + item.dom.offsetWidth + item.option.right,
            radius: {
                'topLeft': getElementCss(item, 'border-top-left-radius'),
                'topRight': getElementCss(item, 'border-top-right-radius'),
                'bottomRight': getElementCss(item, 'border-bottom-right-radius'),
                'bottomLeft': getElementCss(item, 'border-bottom-left-radius'),
            }
        });
    });
    console.log('位置信息', selectedAreaInfo);

    selectedAreaInfo.forEach((item) => {
        seizeAreaArr.push(new Area(item));
        if (item.radius.topLeft == '50%' && item.radius.bottomRight == '50%') {
            drawCricleMaskAll((item.d - item.u) / 2, item.u, item.l)
        } else {
            if (item.radius.topLeft !== 0) {
                drawCricleMask(item.radius.topLeft, 0, item.u, item.l);
            }
            if (item.radius.topRight !== 0) {
                drawCricleMask(item.radius.topRight, 1, item.u, item.r - item.radius.topRight);
            }
            if (item.radius.bottomRight !== 0) {
                drawCricleMask(item.radius.bottomRight, 2, item.d - item.radius.bottomRight, item.r - item.radius.bottomRight);
            }
            if (item.radius.bottomLeft !== 0) {
                drawCricleMask(item.radius.bottomLeft, 3, item.d - item.radius.bottomLeft, item.l);
            }
        }
    })


    let drawAreaList = Area.multipleSplitArea(beCut2, seizeAreaArr);
    drawAreaList.forEach((item) => {
        drawSquareMask(item.u, item.d, item.l, item.r);
    })
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
};
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
    radiusarea.style.cssText = `position:absolute;z-index:99999;top: ${top}px;left: ${left}px;width:${radius}px;height:${radius}px;background:radial-gradient(${2 * radius}px at ${directionArr[direction]},transparent 50%, rgba(0, 0, 0, 0.3) 50%)`;
    document.body.appendChild(radiusarea);
};
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
    mask.style.cssText = `top:${top}px;height:${bottom - top}px;left:${left}px;width:${right - left}px;position:absolute;z-index:99999;background:rgba(0,0,0,0.3)`;
    document.body.appendChild(mask);
};
//距离视口的距离
function offsetDis(obj) {
    var l = 0,
        t = 0;
    while (obj) {
        l = l + obj.offsetLeft + obj.clientLeft;
        t = t + obj.offsetTop + obj.clientTop;
        obj = obj.offsetParent;
    }
    return {
        left: l,
        top: t
    };
};
//获取元素样式信息
const getElementCss = (element, attr) => {
    var val = null, reg = null;
    if ("getComputedStyle" in window) {
        val = window.getComputedStyle(element, null)[attr];
    } else {
        val = element.currentStyle[attr];
    }
    reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
    return reg.test(val) ? parseFloat(val) : val;
};
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