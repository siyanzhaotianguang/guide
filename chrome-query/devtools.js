
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The function below is executed in the context of the inspected page.
let frameUrl = ''
let exportContent = []

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
  chrome.devtools.inspectedWindow.eval(`setSelectedElement($0, ${JSON.stringify(marginConfig)})`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
      chrome.devtools.inspectedWindow.eval(`log(${JSON.stringify(data)})`,
        { useContentScriptContext: true }, (data, err) => {
        })
    })
}

var setUrl = function (url) {
  chrome.devtools.inspectedWindow.eval(`setUrl(${JSON.stringify(url)})`,
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

var saveCurrentStep = function (data) {
  exportContent.push({ frameUrl, data })
}

var changeValue = function (valueObj) {
  chrome.devtools.inspectedWindow.eval(`changeMargin($0,${JSON.stringify(valueObj)})`,
    { useContentScriptContext: true, frameURL: frameUrl }, (data, err) => {
    })
}

// update()