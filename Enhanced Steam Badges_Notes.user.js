// ==UserScript==
// @name         Enhanced Steam Badges
// @namespace    noop
// @version      0.998
// @description  就是一个瞎几把复制粘贴的Steam徽章浏览脚本，参(C)考(V)：https://greasyfork.org/scripts/954-enhanced-steam-community
// @author       Lw
// @match        http*://steamcommunity.com/*/badges*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*来源说明
 *
 *本脚本有一半的代码是复制粘贴来的，作者也没有认真研读原作者的授权范围
 *本作者不保留任何权利，但是请不要商用
 *
 *原作者：Deparsoul：https://greasyfork.org/zh-CN/users/726-deparsoul
 *原始链接：https://greasyfork.org/scripts/954-enhanced-steam-community
 *
 *
 **/

// 我感觉应该是我代码力不行，原来的脚本里就不需要这样声明呢
unsafeWindow.load=load;
unsafeWindow.exec=exec;
unsafeWindow.addslashes=addslashes;

function Main() {


    // 因为不想（不会）改原来的代码模块，定义一个变量接着点击的元素
    var thisElement;
    // 获取页面全部展示条
    var rowBox = $J("div.badge_title");
    // 左侧的那个可以点的小标志
    var SCEPico = '<img onClick="loadBadge(this)" alt="Steam Card Exchange+" style="height: 22px;position: relative;z-index: 4;cursor: pointer;" src="data:image/png;base64,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">';
    // 在每一个展示条左上角都添加一个小标志
    for (var i = 0;i <= rowBox.size();i++) {
        rowBox.eq(i).prepend(SCEPico);
    }

    // 小标志的onClick触发加载徽章的方法
    function loadBadge(row){
        // 先选定当前元素，要跨函数调用
        thisElement = row;
        // 获取当前徽章条对应的appid
        var match = $J(row).parent().parent().parent().prev().attr("href").match(/^https?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/([0-9]+)/);
        if (match) {
            var appid = match[2];
            load('http://www.steamcardexchange.net/index.php?gamepage-appid-' + appid, 'Badges');
        }
    }

    // 主要方法，接收SCE数据，拆分并且放置
    function escProcBadges(data) {
        // 将 SCE 页面中的链接替换成支持 https 的域名
        data = data.replace(/https?:\/\/(community\.edgecast\.steamstatic\.com|steamcommunity-a\.akamaihd\.net|cdn\.steamcommunity\.com)\//g, "//steamcommunity-a.akamaihd.net/");
        data = data.replace(/https?:\/\/(cdn\.edgecast\.steamstatic\.com|steamcdn-a\.akamaihd\.net|cdn\.akamai\.steamstatic\.com)\//g, "//steamcdn-a.akamaihd.net/");

        var sce = $J(data);
        // 不知道下面的函数怎么实现的放置顺序，所以放置一个锚点，让倒着顺序放的徽章能顺序正确
        $J(thisElement).parent().parent().siblings("div.badge_content").children("div.badge_progress_tasks").after('<div class="pin"></div>');
        // 处理放置普通徽章，使用jQuery选择器选择徽章元素组所在的元素
        var badges = sce.find('a:contains("Badges"):not(:contains("Foil"))').closest('.flex').next();
        putBadge(badges);
        // 处理放置闪亮徽章，使用jQuery选择器选择徽章元素组所在的元素
        badges = sce.find('a:contains("Foil Badges")').closest('.flex').next();
        putBadge(badges);

        // 放徽章方法
        function putBadge(badges) {
            console.log(thisElement+"?a?");//debug
            badges.find('.flex').each(function () {
                var badge = $J(this);
                if (badge.text()) {
                    //$J('.gamecard_badge_progress').remove();//no idea why not delete this line but must have some reason --Lw
                    var img = badge.find('[src]').attr('src');
                    var text = badge.find('.text-sm').text();
                    var level = badge.find('.mt-auto').html();
                    $J(thisElement).parent().parent().siblings("div.badge_content").children("div.pin").before('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;min-height:150px;"><div class="badge_info_image"><img src="' + img + '"></div><div class="badge_info_description"><div class="badge_info_title">' + text + '</div><div>' + level + '</div></div><div style="clear: left;"></div></div>');
                }
            })
        };

        // 下面一段是放置表情和背景的，已经改成可以加载的状态，如果想要可以直接取消注释，但是页面排版大概会崩吧
        // 因SCE前端改版，下面这段暂时不能用，还懒得修理，等不懒了再修修吧 --Lw 2023-07-01

        //console.log("放表情");//debug
        //sce.find('h3:contains("EMOTICONS")').closest('.content-box').find('.showcase-element-container.emoticon>.showcase-element').each(function () {
        //    var item = $J(this);
        //    if (item.text()) {
        //        $J(thisElement).parent().parent().siblings("div.badge_content").children("div.pin").before('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;"><div><img src="' + item.find('.element-image.small').attr('src') + '"></div><div><img src="' + item.find('.element-image.big').attr('src') + '"></div><div><div class="badge_info_title">' + item.find('.element-text').text() + '</div><div>' + item.find('.element-experience').text() + '</div></div><div style="clear: left;"></div></div>');
        //        console.log("完毕放表情");//debug
        //    }
        //});
        //console.log("放背景");//debug
        //sce.find('h3:contains("BACKGROUNDS")').closest('.content-box').find('.showcase-element-container.background>.showcase-element').each(function () {
        //    var item = $J(this);
        //    if (item.text()) {
        //        $J(thisElement).parent().parent().siblings("div.badge_content").children("div.pin").before('<div class="badge_info" style="float:left;width:160px;text-align:center;padding:5px;"><div><a target="_blank" href="' + item.find('.element-image').attr('href') + '"><img src="' + item.find('.element-image img').attr('src').replace('112x70f', '160x100f') + '"></a></div><div><div class="badge_info_title">' + item.find('.element-text').text() + '</div><div>' + item.find('.element-experience').text() + '</div></div><div style="clear: left;"></div></div>');
        //        console.log("完毕放背景");//debug
        //    }
        //});
        //console.log("ProcBadges完毕放徽章");

        //移除已经点击过的SCE标志
        thisElement.remove();
    }
}

// 下面是CV过来的，不太清楚原理，但是能用，除了console.log()是我自己加的之外未改动
// 将上面的代码插入到网页中
var script = Main.toString();
script = script.slice(script.indexOf('{') + 1, -1);
exec(script);

// Load url and call proc function
function load(url, id) {
    console.log("拉外部网页"+url);//debug
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            exec('escProc' + id + '("' + addslashes(response.responseText) + '")');
        }
    });
}

// Script Injection
function exec(fn) {
    console.log("执行exec");//debug
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = fn;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

// Add slashes to string
function addslashes(string) {
    return string
        .replace(/\\/g, '\\\\')
        .replace(/\u0008/g, '\\b')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\f/g, '\\f')
        .replace(/\r/g, '\\r')
        .replace(/'/g, '\\\'')
        .replace(/"/g, '\\"');
}
