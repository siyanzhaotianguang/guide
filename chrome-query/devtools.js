
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
let frameUrl = ''
let domList = []

chrome.devtools.panels.create("new panels",
  "Panel.png",
  "Panel.html",
  function (panel) {
    // let button = panel.createStatusBarButton('Panel.png ', 'selectDom', false)
    // button.onClicked.addListener(update);
    // let button2 = panel.createStatusBarButton('Panel.png ', 'createMask', false)
    // button2.onClicked.addListener(mask)
  })

var mask = function () {
  chrome.devtools.inspectedWindow.eval(`createMask()`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}

var update = function (marginConfig) {
  chrome.devtools.inspectedWindow.eval(`setSelectedElement($0, ${JSON.stringify(marginConfig)})`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
      domList.push(data)
      chrome.devtools.inspectedWindow.eval(`log(${JSON.stringify(data)})`,
        { useContentScriptContext: true }, (data, err) => {
        })
    })
}

var setUrl = function (url) {
  chrome.devtools.inspectedWindow.eval(`setUrl(${JSON.stringify(url)})`,
    { useContentScriptContext: true }, (data, err) => {
      console.log('111', data)
      frameUrl = data
      domList = []
    })
}
// update()