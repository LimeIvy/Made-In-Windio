'use client'
import { useCallback } from "react";

export const useCheckMission = (output: string) => {
  return useCallback(() => {

    const parser = new DOMParser();
    const doc = parser.parseFromString(output, "text/html");
    const pElement = doc.querySelector("p");

    if (pElement) {
      const computedStyle = window.getComputedStyle(pElement);
      const hasRedText =
        pElement.className.includes("text-red") || computedStyle.color.includes("red");

      return hasRedText;
    }

    return false;
  }, [output]);
};
