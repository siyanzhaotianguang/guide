/*
 * @Author: Dream 
 * @Date: 2019-04-03 13:43:03 
 * @Last Modified by: Dream
 * @Last Modified time: 2019-04-04 14:06:54
 */
let drapId = 1
let $iframeWrap = $('#iframeWrap');
let $iframe = $('#iframe');
let currentEdit = null
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
/**
* 调整iframe窗口大小
* @param {宽高配置} obj 
*/
const toggleClient = (obj) => {
    $iframeWrap.css({
        'width': clientList[obj.value].width + 'px',
        'height': clientList[obj.value].height + 'px'
    })
    $iframe.attr('src', $iframe.attr('src'));
}
$(document).ready(() => {
    let flag = false;
    let $panel = $('#panel');
    let currentDrap = null;
    let selectedAreaInfo = []; //选区信息
    let wrapOffsetTop = $iframeWrap.offset().top;
    let wrapOffsetLeft = $iframeWrap.offset().left;
    let wrapWidth = $iframeWrap.width();
    let wrapHeight = $iframeWrap.height();

    let totalAreaInfo = {
        u: 0,
        d: wrapHeight,
        l: 0,
        r: wrapWidth
    }; //总面积
    let oldTop = 0;
    let oldLeft = 0;
    let chooseType = null; //选区类型

    //开始选区
    $('#start').click(() => {
        flag = true;
    });
    $('#panel').mousedown((ev) => {
        chooseType = +$('input:radio:checked').val();
        flag = true;
        let drap = document.createElement('div');
        drap.setAttribute('class', 'drap');
        if (chooseType) {
            drap.style.borderRadius = '50%';
        } else {
            drap.style.borderRadius = '0';
        }
        $panel.append(drap);

        drap.style.top = ev.pageY - wrapOffsetTop + 'px';
        drap.style.left = ev.pageX - wrapOffsetLeft + 'px';
        currentDrap = drap;
        currentEdit = drap
        $(currentDrap).attr('id', `drap_${drapId++}`)//设置id
            .on("click", function () {
                currentEdit = this
                getEditInfo()
            })
        oldTop = ev.pageY;
        oldLeft = ev.pageX;
        ev.preventDefault(); // 阻止默认行为
        ev.stopPropagation(); // 阻止事件冒泡
    });

    $('#panel').mousemove((ev) => {
        if (!flag) return;
        if (ev.pageX < oldLeft) { //向左
            currentDrap.style.width = oldLeft - ev.pageX + 'px';
            currentDrap.style.left = ev.pageX - wrapOffsetLeft + 'px';
            if (chooseType) {
                currentDrap.style.height = oldLeft - ev.pageX + 'px';
            }
        } else { //向右
            currentDrap.style.width = ev.pageX - oldLeft + 'px';
            if (chooseType) {
                currentDrap.style.height = ev.pageX - oldLeft + 'px';
            }
        }

        if (ev.pageY < oldTop) { //向上
            if (!chooseType) {
                currentDrap.style.height = oldTop - ev.pageY + 'px';
            }
            currentDrap.style.top = ev.pageY - wrapOffsetTop + 'px';
        } else { //向下
            if (!chooseType) {
                currentDrap.style.height = ev.pageY - oldTop + 'px';
            }
        }

        ev.preventDefault(); // 阻止默认行为
        ev.stopPropagation(); // 阻止事件冒泡
    });

    $('#delete').on('click', function () {
        $(currentEdit).remove();
    })

    $('#panel').mouseup((ev) => {
        currentDrap.style.cursor = 'move';
        flag = false;
        getEditInfo()
    });
    //获取当前编辑的区域信息
    function getEditInfo() {
        $('#pos_x').val($(currentEdit).position().left)
        $('#pos_y').val($(currentEdit).position().top)
        $('#e_width').val($(currentEdit).width())
        $('#e_height').val($(currentEdit).height())
        $('#lefttop').val($(currentEdit).css('border-top-left-radius'))
        $('#leftdown').val($(currentEdit).css('border-bottom-left-radius'))
        $('#righttop').val($(currentEdit).css('border-top-right-radius'))
        $('#rightdown').val($(currentEdit).css('border-bottom-right-radius'))
    }
    //更新当前编辑的区域信息
    $('#pos_x').on('keyup', function () {
        let num = wrapWidth - $(currentEdit).width()
        num = num > $(this).val() ? $(this).val() : num
        $(this).val(num)
        $(currentEdit)[0].style.left = num + 'px';
    })
    $('#pos_y').on('keyup', function () {
        let num = wrapHeight - $(currentEdit).height()
        num = num > $(this).val() ? $(this).val() : num
        $(this).val(num)
        $(currentEdit)[0].style.top = num + 'px';
    })
    //获取选区信息
    function getSelectAreaInfo() {
        let len = $('.drap').length;
        for (let i = 0; i < len; i++) {
            let el = $('.drap').eq(i)[0];
            selectedAreaInfo.push({
                u: Number(el.style.top.slice(0, - 2)),
                d: Number(el.style.top.slice(0, - 2)) + Number(el.style.height.slice(0, - 2)),
                l: Number(el.style.left.slice(0, - 2)),
                r: Number(el.style.left.slice(0, - 2)) + Number(el.style.width.slice(0, - 2))
            })
        }
    }
    //确认选区
    $('#check').click(() => {

        getSelectAreaInfo();
        drawAll();
        $('.drap').remove();
    });
    //移动选区
    let divstartX = 0,
        divstartY = 0,
        drapFlag = false;

    $('#panel').on('mousedown', '.drap', function (ev) {
        drapFlag = true;
        divstartX = ev.offsetX,
            divstartY = ev.offsetY;
        ev.preventDefault();
        ev.stopPropagation();
    })

    $('#panel').on('mousemove', '.drap', function (ev) {
        if (!drapFlag) return;
        let t = ev.pageY - (divstartY + wrapOffsetTop);
        let l = ev.pageX - (divstartX + wrapOffsetLeft);
        if (t < 0) {
            t = 0
        } else if (t > wrapHeight - (+$(this)[0].style.height.slice(0, -2))) {
            t = wrapHeight - (+$(this)[0].style.height.slice(0, -2));
        }

        if (l < 0) {
            l = 0
        } else if (l > wrapWidth - (+$(this)[0].style.width.slice(0, -2))) {
            l = wrapWidth - (+$(this)[0].style.width.slice(0, -2));
        }

        $(this)[0].style.top = t + 'px';
        $(this)[0].style.left = l + 'px';
    })

    $('#panel').on('mouseup', '.drap', function (ev) {
        drapFlag = false;
    });

    $('#panel').on('mousedown', '.mask', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    });

    const drawAll = () => {
        console.log('选区信息', selectedAreaInfo);
        let beCut2 = new Area(totalAreaInfo);
        let seizeAreaArr = [];
        selectedAreaInfo.forEach((item) => {
            seizeAreaArr.push(new Area(item));
        })

        let drawAreaList = Area.multipleSplitArea(beCut2, seizeAreaArr);
        drawAreaList.forEach((item) => {
            drawSquareMask(item.u, item.d, item.l, item.r);
        })
        // sCfg.width = +currentDrap.style.width.slice(0, -2);
        // sCfg.height = +currentDrap.style.height.slice(0, -2);
        // sCfg.top = +currentDrap.style.top.slice(0, -2);
        // sCfg.left = +currentDrap.style.left.slice(0, -2);
        if (chooseType) {
            drawCricleMask(sCfg.width / 2, 0, sCfg.top, sCfg.left);
            drawCricleMask(sCfg.width / 2, 1, sCfg.top, sCfg.left + sCfg.width / 2);
            drawCricleMask(sCfg.width / 2, 2, sCfg.top + sCfg.width / 2, sCfg.left + sCfg.width / 2);
            drawCricleMask(sCfg.width / 2, 3, sCfg.top + sCfg.width / 2, sCfg.left);
        }
        // drawSquareMask(0, 0, 0, wrapWidth - sCfg.left);
        // drawSquareMask(0, 0, sCfg.left + sCfg.width, 0);
        // drawSquareMask(0, wrapHeight - sCfg.top, sCfg.left, wrapWidth - (sCfg.left + sCfg.width));
        // drawSquareMask(sCfg.top + sCfg.height, 0, sCfg.left, wrapWidth - (sCfg.left + sCfg.width));
    }
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
        $panel.append(mask)
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
        $panel.append(radiusarea);
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
            if (seizeArea.d >= beCut.d && seizeArea.u <= beCut.u && seizeArea.l <= beCut.l && seizeArea.r >= beCut.r) return []//完全包含
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
});