// opens the given ticket in current or new tab
function openTicket(ticket, newTab) {
  chrome.storage.sync.get({
    jiraURL: ''
  }, function(options) {
    // get saved JIRA URL
    var jiraURL = options.jiraURL;
    var newURL;
    if (jiraURL == '') {
      // go to options page
      newURL = 'html/options.html';
    } else {
      // make URL
      newURL = jiraURL + ticket;
    }
    chrome.tabs.getSelected(null, function(tab) {
      if (newTab) {
        // open in new tab
        chrome.tabs.create({ url: newURL });
      } else {
        // update current tab
        chrome.tabs.update(tab.id, {
            url: newURL
        });
      }
    });
  });
}

function handleSelectionCurrent(selection) {
  openTicket(selection.selectionText, false);
}

function handleSelectionNew(selection) {
  openTicket(selection.selectionText, true);
}


// right click (context menus)
var contexts = ["selection"];
var context = contexts[0];

var parent = chrome.contextMenus.create({
  "title": "Quick JIRA",
  "contexts": [context]
});

var currentTab = chrome.contextMenus.create({
  "title": "Open in current tab",
  "parentId": parent,
  "contexts": [context],
  "onclick": handleSelectionCurrent
});

var newTab = chrome.contextMenus.create({
  "title": "Open in a new tab",
  "parentId": parent,
  "contexts": [context],
  "onclick": handleSelectionNew
});


// listen to omnibox jira
chrome.omnibox.onInputEntered.addListener(function(text) {
  chrome.storage.sync.get({
    // fallback
    defaultOption: 'current tab'
  }, function(options) {
    openTicket(text, options.defaultOption != 'current tab');
  });
});


// Listen to install
chrome.runtime.onInstalled.addListener(function(details) {
  switch(details.reason) {
    case 'install':
      chrome.tabs.create({ url: 'html/welcome.html' });
      break;
    case 'update':
      chrome.tabs.create({ url: 'html/changelog.html' });
      break;
  }
});
