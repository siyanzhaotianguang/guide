
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


var setUrl = function (url, cb1) {
  chrome.devtools.inspectedWindow.eval(`setUrl(${JSON.stringify(url)},function (err, data) {
    if (${cb1}) ${cb1}(err, data)
    console.log('url', data,frameUrl)
  })`,
    { useContentScriptContext: true }, (data, err) => {
      frameUrl = data
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
  setUrl(cfg.frameUrl, function (err, data) {
    chrome.devtools.inspectedWindow.eval(`showByCfg(${JSON.stringify(cfg)})`,
      { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
        console.log('show end')
      })
  })
}

var saveCurrentStep = function (data) {
  if (currentViewIndex < exportContent.length) exportContent[i] = {}
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

var removeArea = function(){
  chrome.devtools.inspectedWindow.eval("removeCurrentArea($0)",
    { useContentScriptContext: true, frameURL: frameUrl}, (data, err) => {
    })
}

var deleteMask = function(){
  chrome.devtools.inspectedWindow.eval("deleteMask()",
    { useContentScriptContext: true, frameURL: frameUrl}, (data, err) => {
    })
}
// update()