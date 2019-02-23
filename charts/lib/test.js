   var myChart = echarts.init(document.getElementById('map'));
    var geoCoordMap = {
        "东城区": [116.418757, 39.937544],
        "西城区": [116.366794, 39.910309],
        "朝阳区": [116.486409, 39.991489],
        "丰台区": [116.286968, 39.863642],
        "石景山区": [116.170445, 39.974601],
        "海淀区": [116.280316, 40.039074],
        "门头沟区": [115.905381, 40.009183],
        "房山区": [115.701157, 39.735535],
        "通州区": [116.758603, 39.802486],
        "顺义区": [116.753525, 40.128936],
        "昌平区": [116.235906, 40.318085],
        "大兴区": [116.338033, 39.658908],
        "怀柔区": [116.607122, 40.524272],
        "平谷区": [117.112335, 40.244783],
        "密云区": [116.943352, 40.477362],
        "延庆区": [115.985006, 40.465325]
    };
    var rawData = [
        // ["东城区",10,20,30],
        // ["西城区",10,20,30],
        ["朝阳区",10,20,30],
        ["丰台区",10,20,30],
        ["石景山区",10,20,30],
        ["海淀区",10,20,30],
        ["门头沟区",10,20,30],
        ["房山区",10,20,30],
        ["通州区",10,20,30],
        ["顺义区",10,20,30],
        ["昌平区",10,20,30],
        ["大兴区",10,20,30],
        ["怀柔区",10,20,30],
        ["平谷区",10,20,30],
        ["密云区",10,20,30],
        ["延庆区",10,20,30]
    ];

    option = {
        animation: false,
        tooltip: {
            trigger: 'axis'
        },
        geo: {
            map: '北京',
            roam: true,
            label: {
                emphasis: {
                    show: false,
                    areaColor: '#eee'
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#55C3FC',
                    borderColor: '#fff'
                },
                emphasis: {
                    areaColor: '#21AEF8'
                }
            }
        },
        series: []
    };

    
    
    function renderEachCity() {
        var option = {
            xAxis: [],
            yAxis: [],
            grid: [],
            series: []
        };
        echarts.util.each(rawData, function(dataItem, idx) {
            var geoCoord = geoCoordMap[dataItem[0]];
            var coord = myChart.convertToPixel('geo', geoCoord);
            idx += '';
            inflationData = [30,50,20];
            option.xAxis.push({
                id: idx,
                gridId: idx,
                type: 'category',
                name: dataItem[0],
                nameLocation: 'middle',
                nameGap: 3,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: '#666'
                    }
                },
                data: ["数据A","数据B","数据C"],
                z: 100
            });
            option.yAxis.push({
                id: idx,
                gridId: idx,
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#1C70B6'
                    }
                },
                z: 100
            });
            option.grid.push({
                id: idx,
                width: 30,
                height: 40,
                left: coord[0] - 15,
                top: coord[1] - 15,
                z: 100
            });
            option.series.push({
                id: idx,
                type: 'bar',
                xAxisId: idx,
                yAxisId: idx,
                barGap: 0,
                barCategoryGap: 0,
                data: inflationData,
                z: 100,
                itemStyle: {
                    normal: {
                        color: function(params){
                            var colorList = ['#F75D5D','#59ED4F','#4C91E7'];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            });
        });
        myChart.setOption(option);
    }
    //地图加载之后渲染
    setTimeout(renderEachCity, 0);
    // 缩放和拖拽
    function throttle(fn, delay, debounce) {

        var currCall;
        var lastCall = 0;
        var lastExec = 0;
        var timer = null;
        var diff;
        var scope;
        var args;

        delay = delay || 0;

        function exec() {
            lastExec = (new Date()).getTime();
            timer = null;
            fn.apply(scope, args || []);
        }

        var cb = function() {
            currCall = (new Date()).getTime();
            scope = this;
            args = arguments;
            diff = currCall - (debounce ? lastCall : lastExec) - delay;

            clearTimeout(timer);

            if (debounce) {
                timer = setTimeout(exec, delay);
            } else {
                if (diff >= 0) {
                    exec();
                } else {
                    timer = setTimeout(exec, -diff);
                }
            }

            lastCall = currCall;
        };

        return cb;
    }

    var throttledRenderEachCity = throttle(renderEachCity, 0);
    myChart.on('geoRoam', throttledRenderEachCity);
    myChart.setOption(option);


    // 点击显示柱状图
    myChart.on('click',function(e){
        if(e.componentSubType == "bar"){
            // 先清除所有柱状图
            $('.tongJiTu').remove();
            // 创建遮挡层
            creatWrap();
            // 创建柱状图容器
            var divObj = document.createElement('div');
            $(divObj).addClass('tongJiTu');
            divObj.id = 'zhuzhuang';
            var divX = getMousePos()['x']; 
            var divY = getMousePos()['y']; 
            $(divObj).css({
                'width': 250,
                'height': 180,
                'border': '1px solid #ccc',
                'position': 'absolute',
                'top': divY,
                'left': divX
            }).appendTo('.wrap');
            // 创建柱状图
            zhuZhuangTu();
            // 点击遮挡层消失
            clearWrap('.zhedang');
        }
        return;
    });
    // 获取横纵坐标
    function getMousePos(e) {
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        // console.log(x,y)
        return {'x': x,'y': y};
    }
    // 生成柱状图
    function zhuZhuangTu() {
        var zhuzhuang = echarts.init(document.getElementById('zhuzhuang'));
        option = {
            backgroundColor: 'rgba(255,255,255,.3)',
            legend: {
                data: ['数据A','数据B','数据C']
            },
            xAxis: [
                {

                    type: 'category',
                    data: ['数据A','数据B','数据C']
                }
            ],
            yAxis: [
                {
                    splitLine: {
                        show: false
                    },
                    type: 'value'
                }
            ],
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params){
                                var colorList = ['#F75D5D','#59ED4F','#4C91E7'];
                                return colorList[params.dataIndex];
                            },
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#000'
                                }
                            }
                        }
                    },
                    data: [10,20,30]
                }
            ]
        };
        zhuzhuang.setOption(option);
    }
    // 生成遮挡层
    function creatWrap(){
        var zheDang = document.createElement('div');
        $(zheDang).addClass('zhedang').css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.2)'
        }).appendTo('.wrap');
    }
    // 去掉遮挡层
    function clearWrap(id){
        $(id).click(function(e){
            // console.log(this);
            this.remove();
            $('.tongJiTu').remove();
            return false;
        });
    }