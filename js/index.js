;(function() {

    function getLunbo() {
        function getSlider(sliderArr) {
            var bannerBox = document.querySelector('#bannerSlider');
            var len = sliderArr.length;
            bannerBox.style.width = len * 100 + "%";
            var circleBox = document.querySelector('.banner-contro')
            for(var i = 0; i < len; i ++) {
                var list = createSliderList(sliderArr[i]);
                var circleList = createSliderCircle();
                bannerBox.appendChild(list);
                circleBox.appendChild(circleList);
            }

            function createSliderList(sliderobj) {
                var list = document.createElement('li');
                list.className = "banner-list";
                list.innerHTML = '\
                        <a href=" ' + sliderobj.link + '" title="' +  sliderobj.title +'" class="banner-list-info">\
                            <img src=" ' +  sliderobj.imgURL + '" class="banner-img">\
                        </a>';
                return list;
            }
            function createSliderCircle() {
                var list = document.createElement('li');
                list.className = "banner-circle";
                return list;
            }
        }
        ajax({
            method: 'GET',
            url: '/sliders',
            callback: function(res) {
                res = JSON.parse(res);
                getSlider(res);
                var containter = document.querySelector("#bannerSlider");
                var circle = document.querySelectorAll(".banner-circle");
                var circleback = ['#9c9c9d', '#515151'];
                mobileSlider(containter, circle, circleback);
            }
        })
        
    }
    getLunbo();
    //轮播效果
    function mobileSlider(containter, circle, circleimgarr) {
        //circleimgarr 0：normal;1: show
        var startY, startX, start,
            move, moveX, moveY, 
            X = 0, Y = 0, 
            i = 0, lastCircle = 0, left = 0,
            endTime, startTime, time;
        var len = containter.children.length;//获取轮播长度


        containter.addEventListener("touchstart", function(event) {
            //start的时候clear
            clearInterval(keep);
            start = event.targetTouches[0];
            startX = start.clientX;
            startY = start.clientY;
            startTime = new Date().getTime();//获取start时间
            containter.style.transition = "";
        })

        containter.addEventListener("touchmove", function(event) {
            move = event.targetTouches[0];
            moveX = move.clientX;
            moveY = move.clientY;
            X += moveX - startX;
            startX = moveX;
            left = - i * 10 + lib.flexible.px2rem(X) + "rem";
            //用translate3d要比left顺畅一些不卡
            containter.style.transform = "translate3d(" + left + ", 0, 0)";
        })

        containter.addEventListener("touchend", function(event) {
            endTime = new Date().getTime();//获取end时间
            time = endTime - startTime;
            if (time < 250 && X > 0 && i) {
                // 向右快划
                i --;
                changeStyle();
            } else if (time < 250 && X < 0 && i < len - 1) {
                //向左快划
                i ++;
                changeStyle();
            } else {
                if (X > 150 && i) {
                    // 向右划
                    i --;
                    changeStyle();
                } else if (X < -150 && i < len - 1) {
                    //向左划
                    i ++;
                    changeStyle();
                } else {
                    //不能算划了
                    keepStyle();
                }
            }
            X = 0;//清除上一次移动记录
            //end后继续调用
            keep = setInterval(still, 2500);
            
        })
        changeStyle()

        function changeStyle() {
            containter.style.transition = "transform 0.5s";//css一定要先设置好transition属性为transform要不然会有bug
            left = - i * 10 + "rem";
            containter.style.transform = 'translate3d(' + left + ', 0, 0)';
            //判断轮播是否有小圆圈
            if(circle != undefined) {
                circle[lastCircle].style.backgroundColor = circleimgarr[0];
                circle[i].style.backgroundColor = circleimgarr[1];
            }        
            lastCircle = i;
        }

        function keepStyle() {
            containter.style.transition = "transform 0.5s";
            left = - i * 10 + "rem";
            containter.style.transform = 'translate3d(' + left + ', 0, 0)';
        }

        //轮播自己划动
        function still() {
            if(i < len - 1) {
                i++;
                changeStyle();
            } else{
                i = 0;
                changeStyle();
            }
        }

        var keep = setInterval(still, 2500);
    }
}());
var numnewCount = 0;
function numnew() {
    var getNum = 10;

    //新闻部分
    function getnews(newsArr) {

        var newsBox = document.querySelector('#news');

        for(var i = 0, len = newsArr.length; i < len; i ++) {
            var list = createNewsList(newsArr[i]);
            newsBox.appendChild(list);
        }
    }

    function createNewsList(newsObj) {
        var list = document.createElement('li');
        var display = 'block',
            right = '1rem';
        if (newsObj.type == null) {
            display = 'none';
            right = 0;
        }

        list.className = 'news-list';
        list.innerHTML = 
            '<div class="news-img-box">\
                <img src="' + newsObj.imgURL + '" class="news-img">\
            </div>\
            <div class="news-right">\
                <span class="news-title">' + newsObj.title + '</span>\
                <p class="news-cont">\
                    <span class="news-descrip">\
                        ' + newsObj.description.slice(0, 30) + '...\
                    </span>\
                    <span class="news-typeColor" style="background-color:' + newsObj.typeColor + ';display:' + display + '">'
                         + newsObj.type + 
                    '</span>\
                    <span class="news-post" style="right:' + right + '">\
                        '+ newsObj.post + '跟贴\
                    </span>\
                </p>\
            </div>'
        return list;
    }

    ajax({
        method: 'GET',
        url: '/news?num=' + getNum,
        callback: function(res) {
            res = JSON.parse(res);
            getnews(res);
            if (numnewCount++ > 0) return;
            var bannerImg = document.querySelector(".banner-imgall")
            var bannerInfo = document.querySelector("#banner-info");
            bannerInfo.innerHTML = res[0].title;
            if (!res[0].type) {
                bannerImg.style.display = "none";
            } else {
                bannerImg.style.backgroundColor = res[0].typeColor;
                bannerImg.innerHTML = res[0].type;
            }
        }
    })
};
numnew();

function ajax(conf) {
    var xhr = new XMLHttpRequest();
    xhr.open(conf.method, conf.url, true);
    xhr.send(conf.data);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status <= 304) {
            conf.callback(xhr.responseText);
        }
    }
}

//首页菜单切换
(function() {
    var headerBtn = document.querySelector("#headerBtn");
    var footerBtn = document.querySelector('.footer-img-box');
    var footer = document.querySelector('footer');
    var banner = document.querySelector('.banner');
    var container = document.querySelector('.List');

    var footerHeight = getComputedStyle(footer)['height']
    var timer;

    headerBtn.addEventListener('click', function() {
        footer.style.top = 0;   
        timer = setTimeout(function()　{
            banner.style.display = 'none';
            container.style.display = 'none';
        }, 500);
    });
    footerBtn.addEventListener('click', function() {
        clearTimeout(timer);
        banner.style.display = 'block';
        container.style.display = 'block';
        footer.style.top = '-' + getComputedStyle(footer)['height'];
    })
    
}());

(function() {

    function getColumn(columnObj) {
        var footerTop = document.querySelector("#footertopContain");
        var footerBottom = document.querySelector(".footer-bottom-box");

        columnObj.added.forEach(function(item, index) {
            createFootertop(item, index);
        });
        columnObj.avaliable.forEach(function(item, index) {
            var list = createFooterBottom(item.name);
            footerBottom.appendChild(list);
        });
        add();
        function createFootertop(obj, index) {
            if(index % 4 == 0) {
                var list = document.createElement("li");
                list.className = "footer-top-list";
                footerTop.appendChild(list);
            }
            var info = document.createElement("a");
            info.className = "footer-top-info";
            info.innerHTML = obj.name;

            if(index % 4 == 3) {
                info.style.border = "none";
            }
            footerTop.children[footerTop.children.length - 1].appendChild(info);
        }

        function createFooterBottom(item) {
            var info = document.createElement("a");
            info.setAttribute("class", "footer-bottom-info");
            info.innerHTML = item;
            return info
        }

        function add() {
            var footerinfo = document.querySelectorAll(".footer-bottom-info");
            for(var i = 0, len = footerinfo.length; i < len; i ++) {
                footerinfo[i].addEventListener("click", (function() {
                    var j = i;
                    return function () {
                        var topChild = footerTop.children[footerTop.children.length - 1];
                        console.log(topChild.children.length)
                        if(topChild.children.length == 4) {
                            var list = document.createElement("li");
                            list.className = "footer-top-list";
                            footerTop.appendChild(list);
                            topChild = list;
                        }
                        var info = document.createElement("a");
                        info.className = "footer-top-info";
                        info.innerHTML = footerinfo[j].innerHTML;

                        if(topChild.children.length == 3) {
                            info.style.border = "none";
                        }

                        topChild.appendChild(info);
                        this.parentNode.removeChild(this);
                    }
                }()))
            }
        }
    }

    ajax({
        method:"GET",
        url:'/tags',
        callback: function(res) {
            res = JSON.parse(res);
            getColumn(res);
            var footer = document.querySelector('footer');
            var top = getComputedStyle(footer)['height'];
            var container = document.querySelector('.List');
            var banner = document.querySelector('.banner');
            footer.style.top = -parseFloat(top) + 'px';
            var footerInfo = document.querySelectorAll(".footer-top-info");
            for(var i = 0, len = footerInfo.length; i < len; i ++) {
                footerInfo[i].addEventListener("click", function() {
                    footer.style.top = '-' + top;
                    container.style.display = 'block';
                    banner.style.display = 'block';
                })
            }
        }

    })
}());


(function load() {
    setInterval(function() {
        if(window.innerHeight + document.body.scrollTop > parseFloat(getComputedStyle(document.body)['height']) * 0.95) {
            console.log(1);
            numnew();
        }
    }, 1000)
  
}());