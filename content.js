document.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "`") return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const target = e.target;
    const tag = target?.tagName;
    const isEditable =
      target?.isContentEditable ||
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT";

    if (isEditable) return;

    e.preventDefault();
    chrome.runtime.sendMessage({ type: "TOGGLE_MINI_GOOGLE" });
  },
  true
);
