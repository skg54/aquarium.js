// ==UserScript==
// @author          Paulo Da Silva
// @name            Aquarium.js
// @version         1.0
// @description     Fish all over your page
// @namespace       Aquarium
// @include         http://grooveshark.com/*
// ==/UserScript==

function injectScript(scriptUrl) {
    var script = document.createElement('script');
    script.src = scriptUrl;
    document.body.appendChild(script);
}

injectScript('https://raw.github.com/paulothesilva/aquarium.js/master/main.js');
