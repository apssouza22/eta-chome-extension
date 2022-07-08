import { getActiveTabURL } from "./utils.js";

const onPlay = async e => {
  // const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "Play",
    value: activeTab,
  });
};


const onStop = async e => {
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "Stop",
    value: activeTab,
  });
};


document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementsByClassName("container")[0];
  container.innerHTML = '<button class="btn-run">Run tests</button> <button class="btn-stop">Stop tests</button>';
  document.getElementsByClassName("btn-run")[0].addEventListener("click", function (e) {
    onPlay(e)
  });
  document.getElementsByClassName("btn-stop")[0].addEventListener("click", function (e) {
    onStop(e)
  });
});

