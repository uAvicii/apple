var t = {
    ua: window.navigator.userAgent,
    platform: window.navigator.platform,
    vendor: window.navigator.vendor
};
if (t.ua.indexOf("Safari") > -1 && t.vendor.indexOf("Apple") > -1) {
    document.documentElement.className += " safari-browser"
}
if (t.ua.indexOf("Safari") > -1 && t.vendor.indexOf("Apple") > -1 && t.ua.indexOf("Version") > -1) {
    if (t.ua.match(/Version\/(.[^\/]*)(Mobile|Safari)/i)) {
    document.documentElement.className += " safari"
    }
}
if (t.ua.indexOf("iPhone") > -1 || t.ua.indexOf("iPad") > -1) {
    document.documentElement.className += " ios"
}
// t.ua.indexOf("CriOS") > -1 || 
if (t.ua.indexOf("CriOS") > -1 || t.ua.indexOf("Chrome") > -1) {
    document.documentElement.className += " chrome"
}
if (t.ua.indexOf("FxiOS") > -1 || (t.ua.indexOf("Firefox") > -1 && -1 === t.ua.indexOf("Opera"))) {
    document.documentElement.className += " firefox"
}
if (t.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === t.ua) {
    document.documentElement.className += " edge"
}
if (t.ua.indexOf("Android") > -1) {
        document.documentElement.className += " android"
}
if (t.ua.indexOf("Weibo") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("MicroMessenger") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("AliApp") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("UCBrowser") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("ByteLocale") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("QQMusic") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("SogouSearch") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("SohuNews") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("baiduboxapp") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("DingTalk") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("MiHome") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("BiliDroid") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("ijkplayer") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("AcFun") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("bili") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("QIYI") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("iQiYi") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("PPStream") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("QYPlayer") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("MGTV") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("MiguVideo") > -1) {
        document.documentElement.className += " share"
}
if (t.ua.indexOf("MOO") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("NeteaseMusic") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("live4iphone") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("walkman") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("qqlive4iphone") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("TencentMidasConnect") > -1) {
        document.documentElement.className += " share" 
}
if (t.ua.indexOf("Youku") > -1) {
        document.documentElement.className += " share" 
}