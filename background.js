let log = 'log'

chrome.runtime.onInstalled.addListener((detail) => {
    let manifest = chrome.runtime.getManifest()
    console.info(`${manifest.name} 설치 완료...
    현재 버전 version: ${manifest.version}
    manifest_version: ${manifest.manifest_version}
    permissions: ${manifest.permissions.join(',')}`)
});

chrome.action.onClicked.addListener((tab) => {
    console.log(tab)
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['overlay.js']
    })
})