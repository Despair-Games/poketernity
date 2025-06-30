/*
 * This file is imported in "development" mode only!
 */

import "../assets/dev.css";

//#region Functions

function renderBranchNameElement() {
  if (import.meta.env.VITE_SHOW_BRANCH_NAME !== "1") {
    return;
  }
  const margin = 3;
  const branchNameElementHeight = 24;
  const appEl = document.getElementById("app");
  const canvasEl = appEl?.querySelector<HTMLElement>("canvas");
  const branchNameEl = document.createElement("div");
  branchNameEl.id = "branch-name";
  branchNameEl.textContent = `Branch: ${import.meta.env.VITE_GIT_BRANCH}`; // Make sure to use the vite-git-branch plugin!
  branchNameEl.style.display = "none";

  const doPosition = (canvasEl: HTMLElement) => {
    const { bottom, left } = canvasEl.getBoundingClientRect();
    branchNameEl.style.top = `${bottom - branchNameElementHeight - margin}px`;
    branchNameEl.style.left = `${left + margin}px`;
    branchNameEl.style.display = "block";
  };

  const observeCanvas = (canvasEl: HTMLElement) => {
    const canvasResizeObserver = new ResizeObserver(() => doPosition(canvasEl));
    canvasResizeObserver.observe(canvasEl);
  };

  if (canvasEl) {
    doPosition(canvasEl);
    observeCanvas(canvasEl);
  } else if (appEl) {
    const appMutationObserver = new MutationObserver(() => {
      const canvasEl = appEl.querySelector<HTMLElement>("canvas");
      if (canvasEl) {
        doPosition(canvasEl);
        observeCanvas(canvasEl);
        appMutationObserver.disconnect();
      }
    });
    appMutationObserver.observe(appEl, {
      childList: true,
      subtree: true,
    });
  } else {
    console.warn("Failed to render branch-name element! No canvas or #app element found");
  }

  document.body.appendChild(branchNameEl);
}

//#endregion
//#region Run

console.log("dev.ts imported!");

if (document.readyState !== "loading") {
  renderBranchNameElement();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    renderBranchNameElement();
  });
}

//#endregion
