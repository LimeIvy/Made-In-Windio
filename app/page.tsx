"use client";

import { useState, useEffect } from "react";
import PlayEditor from "@/components/editor/PlayEditor";
import { useCheckMission } from "@/components/customhooks/useCheckMission";
import { fetchMission } from "@/utils/supabaseFunction";

type GameState = "waiting" | "playing" | "clear" | "failed";

type Mission = {
  name: string;
  code: string;
  difficulty: string;
  clear_condition: string;
};

export default function Home() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [code, setCode] = useState<string>("<p class=\"text-black\">Start!</p>");
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [progress, setProgress] = useState<number>(100);


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

  const [output, setOutput] = useState<string>("");

  const checkMission = useCheckMission(output, mission?.clear_condition || "");

  // ゲーム開始
  const startGame = async () => {
    setGameState("playing");
    setTimeLeft(5);
    setProgress(100);
    const data = await fetchMission();
    setMission(data);
    setCode(data.code);
    setOutput(getFullHTML(data.code));
  };

  // タイマーロジック
useEffect(() => {
  if (gameState !== "playing") return;

  let time = timeLeft; // 関数スコープで現在の時間を保持
  setProgress((time / 5) * 100);

  const timer = setInterval(() => {
    time -= 0.1; // 0.1秒ごとに減らす
    setTimeLeft(time);
    setProgress((time / 5) * 100);

    if (time <= 0.1) {
      clearInterval(timer);
      const success = checkMission();
      setGameState(success ? "clear" : "failed");
    }
  }, 100); // 0.1秒間隔で更新

  return () => clearInterval(timer);
}, [gameState]);  


  // コードが変更されるたびにプレビューを更新
  useEffect(() => {
    setOutput(getFullHTML(code));
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="container mx-auto p-4">
        
        <div className="bg-primary-foreground p-4 rounded-lg mb-4 text-center">
          {gameState === "waiting" && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-black">Mission</h2>
              <p className="text-xl mb-4 text-black">{mission?.name || "Loading..."}</p>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-black"
              >
                Start Game
              </button>
            </div>
          )}
          {gameState === "playing" && (
            <h2 className="text-2xl font-bold text-black">{mission?.name}</h2>
          )}
          {gameState === "clear" && (
            <div>
              <h2 className="text-3xl font-bold text-green-500 mb-4">CLEAR!</h2>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-black"
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
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-black"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <PlayEditor code={code} setCode={setCode} gameState={gameState} />
          
          <div className="flex-1 border bg-white rounded-lg overflow-hidden h-[500px]">
            <iframe srcDoc={output} title="output" className="w-full h-full " sandbox="allow-scripts" />
          </div>
        </div>

        <div className="mt-5 mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center space-x-4">
            <span className="font-mono text-xl text-black">{timeLeft.toFixed(1)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}