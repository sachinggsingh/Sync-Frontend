import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Editor from "@monaco-editor/react";
import OutputPanel from "./OutPutPannel";
import { simulateTyping, getRandomTypingDelay } from "../../utils/typingEffect";

const EditorPanel = forwardRef(({
  code,
  selectedLanguage,
  onCodeChange,
  output,
  outputHeight,
  onOutputResize,
  isRunning,
}, ref) => {
  const editorRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useImperativeHandle(ref, () => ({
    startTypingEffect: async (text) => {
      if (!editorRef.current || isTyping) return;
      
      setIsTyping(true);
      editorRef.current.updateOptions({ readOnly: true });
      
      try {
        await simulateTyping(
          text,
          (currentText) => {
            onCodeChange(currentText);
          },
          getRandomTypingDelay()
        );
      } finally {
        setIsTyping(false);
        editorRef.current.updateOptions({ readOnly: false });
      }
    }
  }));

  useEffect(() => {
    // Update editor options when language changes
    if (editorRef.current) {
      editorRef.current.updateOptions({
        tabSize: (selectedLanguage === "java" || selectedLanguage === "go") ? 4 : 2,
      });
    }
  }, [selectedLanguage]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    // Set initial options
    editor.updateOptions({
      tabSize: (selectedLanguage === "java" || selectedLanguage === "go") ? 4 : 2,
      wordWrap: "on",
      readOnly: isTyping, // Make editor read-only during typing effect
    });
  };

  // Update readOnly state when typing status changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly: isTyping });
    }
  }, [isTyping]);

  return (
    <div className="h-full w-full" style={{ height: `calc(100% - ${outputHeight}%)` }}>
      <Editor
        height="100%"
        language={selectedLanguage}
        theme="vs-dark"
        value={code}
        onChange={onCodeChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "all",
          matchBrackets: "always",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showConstants: true,
            showConstructors: true,
          },
        }}
        loading={<div className="text-white text-center p-4">Loading editor...</div>}
      />
      <OutputPanel
        output={output}
        isRunning={isRunning}
        outputHeight={outputHeight}
        onResize={onOutputResize}
      />
    </div>
  );
});

EditorPanel.displayName = 'EditorPanel';
export default EditorPanel;
