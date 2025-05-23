/**
 * This file is imported in "development" mode only!
 */

import "../assets/dev.css";

//#region Functions

function renderBranchNameElement() {
  const branchNameEl = document.createElement("div");
  branchNameEl.id = "branch-name";
  branchNameEl.textContent = `Branch: ${import.meta.env.VITE_GIT_BRANCH}`; // Make sure to use the vite-git-branch plugin!

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
