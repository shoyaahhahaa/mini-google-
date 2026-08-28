const WIDTH = 480;
const HEIGHT = 640;

async function getPopupWindowId() {
  const { popupWindowId } = await chrome.storage.session.get("popupWindowId");
  return popupWindowId ?? null;
}

async function setPopupWindowId(id) {
  if (id === null) {
    await chrome.storage.session.remove("popupWindowId");
    return;
  }

  await chrome.storage.session.set({ popupWindowId: id });
}

async function toggleMiniGoogle(options = {}) {
  const existingId = await getPopupWindowId();

  if (existingId !== null) {
    try {
      await chrome.windows.get(existingId);
      await chrome.windows.remove(existingId);
      await setPopupWindowId(null);
      return;
    } catch (e) {
      // Window was already closed some other way; fall through and open a fresh one.
    }
  }

  const win = await chrome.windows.create({
    url: "https://www.google.com",
    type: "popup",
    width: WIDTH,
    height: HEIGHT,
    top: 80,
    left: 80,
    focused: !options.keepCurrentFocus
  });
  await setPopupWindowId(win.id);

  if (options.keepCurrentFocus) {
    await chrome.windows.update(win.id, { drawAttention: true });
  }
}

chrome.windows.onRemoved.addListener(async (windowId) => {
  const id = await getPopupWindowId();
  if (windowId === id) {
    await setPopupWindowId(null);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "TOGGLE_MINI_GOOGLE") {
    toggleMiniGoogle({ keepCurrentFocus: Boolean(message.keepCurrentFocus) });
  }
});

chrome.action.onClicked.addListener(() => {
  toggleMiniGoogle();
});
