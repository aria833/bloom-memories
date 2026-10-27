let draggingDecoration = null;
let resizingDecoration = null;

document.addEventListener("click", (event) => {
  if (event.target.closest("#removeCoverImage")) {
    state.coverImage = "";
    syncDraft();
    render();
    return;
  }

  const removeButton = event.target.closest("[data-delete-decoration]");
  if (!removeButton) return;
  event.preventDefault();
  event.stopPropagation();
  const card = getSelectedPostcards()[state.editorIndex];
  if (!card) return;
  const id = removeButton.dataset.deleteDecoration;
  card.decorations = (card.decorations || []).filter((item) => item.id !== id);
  state.selectedDecorationId = null;
  saveLocal();
  render();
});

document.addEventListener("keydown", (event) => {
  const removeButton = event.target.closest("[data-delete-decoration]");
  if (removeButton && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    removeButton.click();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (event.target.closest("[data-delete-decoration]")) return;
  const item = event.target.closest("[data-move-decoration]");
  if (!item) return;

  const card = getSelectedPostcards()[state.editorIndex];
  const decoration = card?.decorations?.find(
    (entry) => entry.id === item.dataset.moveDecoration,
  );
  if (!decoration) return;

  state.selectedDecorationId = decoration.id;

  const resizeHandle = event.target.closest("[data-resize-decoration]");
  if (resizeHandle) {
    event.preventDefault();
    const size = Math.max(24, Math.min(160, Number(decoration.size) || 48));
    resizingDecoration = {
      id: decoration.id,
      item,
      startX: event.clientX,
      startY: event.clientY,
      startSize: size,
      pointerId: event.pointerId,
    };
    item.classList.add("is-selected");
    item.setPointerCapture?.(event.pointerId);
    return;
  }

  draggingDecoration = {
    id: item.dataset.moveDecoration,
    canvas:
      item.closest("#activePostcardCanvas") ||
      item.closest(".printed-postcard"),
    pointerId: event.pointerId,
  };
  item.classList.add("is-selected");
  item.setPointerCapture?.(event.pointerId);
});

document.addEventListener("pointermove", (event) => {
  if (!resizingDecoration) return;
  const delta = Math.max(
    event.clientX - resizingDecoration.startX,
    event.clientY - resizingDecoration.startY,
  );
  const size = Math.max(
    24,
    Math.min(160, resizingDecoration.startSize + delta),
  );
  resizingDecoration.item.style.width = `${size}px`;
  resizingDecoration.item.style.height = `${size}px`;
  resizingDecoration.item.dataset.previewSize = String(size);
});

document.addEventListener("pointerup", (event) => {
  if (resizingDecoration) {
    const resize = resizingDecoration;
    const card = getSelectedPostcards()[state.editorIndex];
    const decoration = card?.decorations?.find((item) => item.id === resize.id);
    const size = Math.max(
      24,
      Math.min(
        160,
        Number(resize.item.dataset.previewSize) || resize.startSize,
      ),
    );
    if (decoration) {
      decoration.size = size;
      state.selectedDecorationId = decoration.id;
      saveLocal();
    }
    resizingDecoration = null;
    render();
    return;
  }

  if (!draggingDecoration) return;
  const canvas = draggingDecoration.canvas;
  const card = getSelectedPostcards()[state.editorIndex];
  const decoration = card?.decorations?.find(
    (item) => item.id === draggingDecoration.id,
  );

  if (canvas && decoration) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(
      3,
      Math.min(97, ((event.clientX - rect.left) / rect.width) * 100),
    );
    const y = Math.max(
      3,
      Math.min(97, ((event.clientY - rect.top) / rect.height) * 100),
    );
    decoration.x = x;
    decoration.y = y;
    state.selectedDecorationId = decoration.id;
    saveLocal();
    render();
  }
  draggingDecoration = null;
});

document.addEventListener("pointercancel", () => {
  draggingDecoration = null;
  resizingDecoration = null;
});

document.addEventListener("dragstart", (event) => {
  const page = event.target.closest("[data-page-id]");
  if (page) event.dataTransfer.setData("text/plain", page.dataset.pageId);
});
document.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-page-id]")) event.preventDefault();
});
document.addEventListener("drop", (event) => {
  const target = event.target.closest("[data-page-id]");
  if (!target) return;
  event.preventDefault();
  const fromId = Number(event.dataTransfer.getData("text/plain"));
  const toId = Number(target.dataset.pageId);
  const ids = [...state.selectedIds];
  const from = ids.indexOf(fromId);
  const to = ids.indexOf(toId);
  if (from >= 0 && to >= 0 && from !== to) {
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    state.selectedIds = ids;
    syncDraft();
    render();
  }
});
