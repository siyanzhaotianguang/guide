// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
let frameUrl = ''
let exportContent = []
let currentViewIndex = 0

chrome.devtools.panels.create("new panels",
  "Panel.png",
  "Panel.html",
  function (panel) {
  })

var mask = function () {
  chrome.devtools.inspectedWindow.eval(`createMask()`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}

var update = function (marginConfig) {
  console.log('frameUrl', frameUrl)
  chrome.devtools.inspectedWindow.eval(`setSelectedElement($0, ${JSON.stringify(marginConfig)})`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
      chrome.devtools.inspectedWindow.eval(`log(${JSON.stringify(data)})`,
        { useContentScriptContext: true }, (data, err) => {
        })
    })
}


var setUrl = function (url, cb) {
  chrome.devtools.inspectedWindow.eval(`setUrl(${JSON.stringify(url)})`,
    { useContentScriptContext: true }, (data, err) => {
      frameUrl = data;
      if(cb) cb();
      console.log('setUrl ', frameUrl)
    })
}

var getCfgAndDomList = function (cb) {
  chrome.devtools.inspectedWindow.eval(`getCfgAndDomList()`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
      cb(err, data)
    })
}

var showByViewIndex = function (index) {
  let cfg = exportContent[index]
  console.log('bbbb', cfg, frameUrl)
  setUrl(cfg.frameUrl, function (err, data) {
    setTimeout(function(){
      chrome.devtools.inspectedWindow.eval(`showByCfg(${JSON.stringify(cfg)})`,
      { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
        console.log('show end')
      })
    }, 3000);
  })
}

var saveCurrentStep = function (data) {
  if (currentViewIndex < exportContent.length) exportContent[currentViewIndex] = { frameUrl, data }
  else {
    exportContent.push({ frameUrl, data })
    currentViewIndex++
  }
}

var changeValue = function (valueObj) {
  chrome.devtools.inspectedWindow.eval(`changeMargin($0,${JSON.stringify(valueObj)})`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}

var removeArea = function () {
  chrome.devtools.inspectedWindow.eval("removeCurrentArea($0)",
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}

var deleteMask = function () {
  chrome.devtools.inspectedWindow.eval("deleteMask()",
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}
// update()