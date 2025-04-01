'use client'
import { Editor } from '@monaco-editor/react'
import React from 'react'

type GameState = "waiting" | "playing" | "clear" | "failed";

const PlayEditor = ({ code, setCode, gameState }: { code: string; setCode: (code: string) => void; gameState: GameState }) => {
  return (
    <div className="flex-1 border rounded-lg overflow-hidden h-[500px]">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 20,
                lineNumbers: "off",
                readOnly: gameState === "clear" || gameState === "failed",
              }}
            />
    </div>
  )
}

export default PlayEditor
