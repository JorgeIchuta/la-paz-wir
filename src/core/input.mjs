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

  const on = (event) => {
    event.preventDefault();
    input[key] = true;
  };
  const off = (event) => {
    event.preventDefault();
    input[key] = false;
  };

  button.addEventListener("pointerdown", on);
  button.addEventListener("pointerup", off);
  button.addEventListener("pointercancel", off);
  button.addEventListener("pointerleave", off);

  return () => {
    button.removeEventListener("pointerdown", on);
    button.removeEventListener("pointerup", off);
    button.removeEventListener("pointercancel", off);
    button.removeEventListener("pointerleave", off);
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

