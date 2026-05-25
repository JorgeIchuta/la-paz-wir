const keyBindings = {
  left: ["arrowleft", "a"],
  right: ["arrowright", "d"],
  jump: ["arrowup", "w", " "],
  attack: ["j", "k"],
};

const buttonBindings = [
  ["#leftButton", "left"],
  ["#rightButton", "right"],
  ["#jumpButton", "jump"],
  ["#attackButton", "attack"],
];

function bindHold(documentRef, input, buttonId, key) {
  const button = documentRef.querySelector(buttonId);
  if (!button) return () => {};

  button.setAttribute("draggable", "false");

  const on = (event) => {
    event.preventDefault();
    button.setPointerCapture?.(event.pointerId);
    input[key] = true;
  };
  const off = (event) => {
    event.preventDefault();
    button.releasePointerCapture?.(event.pointerId);
    input[key] = false;
  };
  const blockDefault = (event) => {
    event.preventDefault();
  };

  button.addEventListener("pointerdown", on, { passive: false });
  button.addEventListener("pointerup", off, { passive: false });
  button.addEventListener("pointercancel", off, { passive: false });
  button.addEventListener("pointerleave", off, { passive: false });
  button.addEventListener("contextmenu", blockDefault);
  button.addEventListener("selectstart", blockDefault);
  button.addEventListener("dragstart", blockDefault);

  return () => {
    button.removeEventListener("pointerdown", on);
    button.removeEventListener("pointerup", off);
    button.removeEventListener("pointercancel", off);
    button.removeEventListener("pointerleave", off);
    button.removeEventListener("contextmenu", blockDefault);
    button.removeEventListener("selectstart", blockDefault);
    button.removeEventListener("dragstart", blockDefault);
  };
}

function applyKeyboard(input, key, pressed) {
  Object.entries(keyBindings).forEach(([action, keys]) => {
    if (keys.includes(key)) input[action] = pressed;
  });
}

export function bindGameInput({ input, documentRef = document, windowRef = window }) {
  const cleanup = buttonBindings.map(([buttonId, key]) => bindHold(documentRef, input, buttonId, key));

  const onKeyDown = (event) => {
    applyKeyboard(input, event.key.toLowerCase(), true);
  };
  const onKeyUp = (event) => {
    applyKeyboard(input, event.key.toLowerCase(), false);
  };

  windowRef.addEventListener("keydown", onKeyDown);
  windowRef.addEventListener("keyup", onKeyUp);

  return () => {
    cleanup.forEach((unbind) => unbind());
    windowRef.removeEventListener("keydown", onKeyDown);
    windowRef.removeEventListener("keyup", onKeyUp);
  };
}
