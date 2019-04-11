
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
let frameUrl = null
chrome.devtools.inspectedWindow.eval(`getUrl()`,
  { useContentScriptContext: true }, (data, err) => {
    frameUrl = data
  })

chrome.devtools.panels.create("new panels",
  "Panel.png",
  "Panel.html",
  function (panel) {
    // panel.onShown.addListener(function (win) {
    //   alert(win.document.getElementById(''))
    // })
    let button = panel.createStatusBarButton('Panel.png ', 'selectDom', false)
    button.onClicked.addListener(update);
    let button2 = panel.createStatusBarButton('Panel.png ', 'createMask', false)
    button2.onClicked.addListener(mask)
  })
var mask = function () {
  chrome.devtools.inspectedWindow.eval("createMask()",
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}
var update = function () {
  chrome.devtools.inspectedWindow.eval("setSelectedElement($0)",
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
      chrome.devtools.inspectedWindow.eval(`log(${JSON.stringify(data)})`,
        { useContentScriptContext: true }, (data, err) => {
        })
    })
}

update()