// ==UserScript==
// @name         Enhanced Steam Badges
// @namespace    https://github.com/PMisRIGHT/Enhanced-Steam-Badges
// @version      0.9
// @description  就是一个瞎几把复制粘贴的Steam徽章浏览脚本，参(C)考(V)：https://greasyfork.org/zh-CN/scripts/30480-enhanced-steam-community-mod
// @author       Lw
// @match        http*://steamcommunity.com/*/badges*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*说明一下哈
 *
 *代码力不行，只在Chrome内核的Tampermonkey上测试可用，不负责适配其他内核和猴
 *脚本用于在Steam徽章进度页面加入点击就可以展示所有徽章等级样式的按钮
 *点击后等3-5秒嗷！
 *
 *本脚本有一半的代码是复制粘贴来的，作者也没有认真研读原作者的授权范围
 *本作者不保留任何权利，但是请不要商用
 *
 *原作者：Deparsoul：https://greasyfork.org/zh-CN/users/726-deparsoul
 *原始链接：https://greasyfork.org/scripts/954-enhanced-steam-community
 *
 *原作者：byzod：https://greasyfork.org/zh-CN/users/75960-byzod
 *原始链接：https://greasyfork.org/zh-CN/scripts/30480-enhanced-steam-community-mod
 *
 **/

unsafeWindow.load=load;
unsafeWindow.exec=exec;
unsafeWindow.addslashes=addslashes;

function Main() {

    var thisElement;
    var rowBox = $J("div.badge_title");
    var SCEPico = '<img onClick="loadBadge(this)" alt="Steam Card Exchange+" style="height: 22px;position: relative;z-index: 4;cursor: pointer;" src="data:image/png;base64,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">';
    for (var i = 0;i <= rowBox.size();i++) {
        rowBox.eq(i).prepend(SCEPico);
    }

    function loadBadge(row){
        thisElement = row;
        var match = $J(row).parent().parent().parent().prev().attr("href").match(/^https?:\/\/steamcommunity.com\/(id|profiles)\/.+\/gamecards\/([0-9]+)/);
        if (match) {
            var appid = match[2];
            load('http://www.steamcardexchange.net/index.php?gamepage-appid-' + appid, 'Badges');
        }
    }

    function escProcBadges(data) {
        data = data.replace(/https?:\/\/(community\.edgecast\.steamstatic\.com|steamcommunity-a\.akamaihd\.net|cdn\.steamcommunity\.com)\//g, "//steamcommunity-a.akamaihd.net/");
        data = data.replace(/https?:\/\/(cdn\.edgecast\.steamstatic\.com|steamcdn-a\.akamaihd\.net|cdn\.akamai\.steamstatic\.com)\//g, "//steamcdn-a.akamaihd.net/");

        // Byzod Add 2017-6-14
        // 先去除又臭又长的下拉菜单选项……
        data = data.replace(/<select[^]+<\/select>/,"");
        // Byzod Add End 2017-6-14

        var sce = $J(data);
        $J(thisElement).parent().parent().siblings("div.badge_content").children("div.badge_progress_tasks").after('<div class="pin"></div>');
        var badges = sce.find('h3:contains("BADGES"):not(:contains("FOIL"))').closest('.content-box');
        putBadge(badges);
        badges = sce.find('h3:contains("FOIL BADGES")').closest('.content-box');
        putBadge(badges);

        function putBadge(badges) {
            badges.find('.showcase-element-container.badge>.showcase-element').each(function () {
                var badge = $J(this);
                if (badge.text()) {
                    var img = badge.find('.element-image').attr('src');
                    var text = badge.find('.element-text').text();
                    var level = badge.find('.element-experience').html();
                    $J(thisElement).parent().parent().siblings("div.badge_content").children("div.pin").before('<div class="badge_info" style="float:left;width:80px;text-align:center;padding:5px;min-height:150px;"><div class="badge_info_image"><img src="' + img + '"></div><div class="badge_info_description"><div class="badge_info_title">' + text + '</div><div>' + level + '</div></div><div style="clear: left;"></div></div>');
                }
            })
        };
    }
}

// 将上面的代码插入到网页中
var script = Main.toString();
script = script.slice(script.indexOf('{') + 1, -1);
exec(script);

// Load url and call proc function
function load(url, id) {
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
