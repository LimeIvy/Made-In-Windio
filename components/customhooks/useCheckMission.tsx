'use client'
import { useCallback } from "react";

export const useCheckMission = (output: string, clearCondition: string) => {
  return useCallback(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(output, "text/html");
    const pElement = doc.querySelector("p");

    if (!pElement) return false;

    const computedStyle = window.getComputedStyle(pElement);

    try {
      // `clearCondition` を実行可能な関数に変換
      const checkFunction = new Function("pElement", "computedStyle", `return ${clearCondition};`);
      
      return checkFunction(pElement, computedStyle);
    } catch (error) {
      console.error("ミッションの判定エラー:", error);
      return false;
    }
  }, [output]);
};