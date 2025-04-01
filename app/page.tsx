"use client";

import { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

type GameState = "waiting" | "playing" | "clear" | "failed";

export default function Home() {
  const [code, setCode] = useState(`<p class="text-black">Start!</p>`);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [timeLeft, setTimeLeft] = useState(5);
  const mission = "文字を赤くしろ！";
  const [progress, setProgress] = useState(100);

  const getFullHTML = (bodyContent: string) => `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${bodyContent}
</body>
</html>`;

  const [output, setOutput] = useState(getFullHTML(code));
  
  const checkMission = useCallback(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(output, "text/html");
    const pElement = doc.querySelector("p");
    
    if (pElement) {
      const computedStyle = window.getComputedStyle(pElement);
      const hasRedText = pElement.className.includes("text-red") || 
                        computedStyle.color.includes("red");
      return hasRedText;
    }
    return false;
  }, [output]);

  // ゲーム開始
  const startGame = () => {
    setGameState("playing");
    setTimeLeft(5);
    setProgress(100);
    setCode(`<p class="text-black">Start!</p>`);
  };

  // タイマーと判定のロジック
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 0.1;
          setProgress(newTime * 100 / 5);
          
          if (newTime <= 0) {
            clearInterval(timer);
            const success = checkMission();
            setGameState(success ? "clear" : "failed");
            return 0;
          }
          return newTime;
        });
      }, 100);
    }

    return () => clearInterval(timer);
  }, [gameState, checkMission]);

  // コードが変更されるたびにプレビューを更新
  useEffect(() => {
    setOutput(getFullHTML(code));
  }, [code]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Made In Windio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-mono text-xl">{timeLeft.toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="bg-primary-foreground p-4 rounded-lg mb-4 text-center">
          {gameState === "waiting" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">ミッション</h2>
              <p className="text-xl mb-4">{mission}</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Start Game
              </button>
            </div>
          )}
          {gameState === "playing" && (
            <h2 className="text-2xl font-bold">{mission}</h2>
          )}
          {gameState === "clear" && (
            <div>
              <h2 className="text-3xl font-bold text-green-500 mb-4">CLEAR!</h2>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Play Again
              </button>
            </div>
          )}
          {gameState === "failed" && (
            <div>
              <h2 className="text-3xl font-bold text-red-500 mb-4">FAILED!</h2>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 border rounded-lg overflow-hidden h-[500px]">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                readOnly: gameState === "clear" || gameState === "failed",
              }}
            />
          </div>
          
          <div className="flex-1 border bg-white rounded-lg overflow-hidden h-[500px]">
            <iframe srcDoc={output} title="output" className="w-full h-full" sandbox="allow-scripts" />
          </div>
        </div>
      </div>
    </div>
  );
}