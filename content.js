document.addEventListener(
  "keydown",
  (e) => {
    if (e.key.toLowerCase() !== "z") return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const target = e.target;
    const tag = target?.tagName;
    const isEditable =
      target?.isContentEditable ||
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT";

    if (isEditable) return;
    if (!chrome.runtime?.id) return; // extension was reloaded; this tab needs a refresh

    e.preventDefault();
    try {
      chrome.runtime.sendMessage({
        type: "TOGGLE_MINI_GOOGLE",
        keepCurrentFocus: Boolean(document.fullscreenElement)
      });
    } catch (err) {
      // Extension context invalidated (extension was reloaded/updated). Ignore.
    }
  },
  true
);
