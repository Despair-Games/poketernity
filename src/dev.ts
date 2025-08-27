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
  const appElement = document.getElementById("app");
  const canvasElement = appElement?.querySelector<HTMLElement>("canvas");
  const branchNameElement = document.createElement("div");
  branchNameElement.id = "branch-name";
  branchNameElement.textContent = `Branch: ${import.meta.env.VITE_GIT_BRANCH}`; // Make sure to use the vite-git-branch plugin!
  branchNameElement.style.display = "none";

  const doPosition = (canvasEl: HTMLElement) => {
    const { bottom, left } = canvasEl.getBoundingClientRect();
    branchNameElement.style.top = `${bottom - branchNameElementHeight - margin}px`;
    branchNameElement.style.left = `${left + margin}px`;
    branchNameElement.style.display = "block";
  };

  const observeCanvas = (canvasEl: HTMLElement) => {
    const canvasResizeObserver = new ResizeObserver(() => doPosition(canvasEl));
    canvasResizeObserver.observe(canvasEl);
  };

  if (canvasElement) {
    doPosition(canvasElement);
    observeCanvas(canvasElement);
  } else if (appElement) {
    const appMutationObserver = new MutationObserver(() => {
      const canvasEl = appElement.querySelector<HTMLElement>("canvas");
      if (canvasEl) {
        doPosition(canvasEl);
        observeCanvas(canvasEl);
        appMutationObserver.disconnect();
      }
    });
    appMutationObserver.observe(appElement, {
      childList: true,
      subtree: true,
    });
  } else {
    console.warn("Failed to render branch-name element! No canvas or #app element found");
  }

  document.body.appendChild(branchNameElement);
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
