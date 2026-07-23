import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import initSqlJs from "sql.js";
import {
  Play,
  RotateCcw,
  Code2,
  Terminal,
  Globe,
  Database,
} from "lucide-react";

const languageMap = {
  python: { label: "Python", judge0: 71, mode: "judge0" },
  java: { label: "Java", judge0: 62, mode: "judge0" },
  c: { label: "C", judge0: 50, mode: "judge0" },
  cpp: { label: "C++", judge0: 54, mode: "judge0" },
  javascript: { label: "JavaScript", judge0: 63, mode: "judge0" },
  sql: { label: "SQL", mode: "sql" },
  html: { label: "HTML", mode: "web" },
  css: { label: "CSS", mode: "web" },
};

const starterCode = {
  python: `name = input("Enter your name: ")
age = int(input("Enter your age: "))

print(name, "is", age, "years old.")`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = sc.nextLine();

        System.out.print("Enter your age: ");
        int age = sc.nextInt();

        System.out.println(name + " is " + age + " years old.");
    }
}`,

  c: `#include <stdio.h>

int main() {
    char name[100];
    int age;

    printf("Enter your name: ");
    scanf("%s", name);

    printf("Enter your age: ");
    scanf("%d", &age);

    printf("%s is %d years old.\\n", name, age);

    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    string name;
    int age;

    cout << "Enter your name: ";
    cin >> name;

    cout << "Enter your age: ";
    cin >> age;

    cout << name << " is " << age << " years old.";

    return 0;
}`,

  javascript: `let name = "javascript";
let age = 20;

console.log(name + ' is ' + age + ' years old.');`,

  sql: `CREATE TABLE students (
  id INTEGER,
  name TEXT
);

INSERT INTO students VALUES (1, 'name1');
INSERT INTO students VALUES (2, 'name2');

SELECT * FROM students;`,

  html: `<!DOCTYPE html>
<html>
<head>
  <title>SyVA</title>
  <style>
    body{
      font-family: Arial;
      background:#0f172a;
      color:white;
      padding:40px;
    }
    h1{
      color:#3b82f6;
    }
  </style>
</head>
<body>
  <h1>Hello SyVA</h1>
  <p>Live preview is working!</p>
</body>
</html>`,

  css: `body{
  background:#0f172a;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  margin:0;
}

h1{
  color:#3b82f6;
  font-size:48px;
}`,
};

function Practice() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [output, setOutput] = useState("");
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [webPreview, setWebPreview] = useState("");
  const [sqlDb, setSqlDb] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function initSQL() {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `https://unpkg.com/sql.js@1.8.0/dist/${file}`,
        });

        if (mounted) {
          const db = new SQL.Database();
          setSqlDb(db);
        }
      } catch (error) {
        console.error("SQL Init Error:", error);
        setOutput("Failed to initialize SQL engine");
      }
    }

    initSQL();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setCode(starterCode[language]);
    setOutput("");

    if (language === "html" || language === "css") {
      setWebPreview(starterCode[language]);
    } else {
      setWebPreview("");
    }
  }, [language]);

  async function executeSQL(query) {
    try {
      if (!sqlDb) {
        setOutput("SQL engine is still loading...");
        return;
      }

      const results = sqlDb.exec(query);

      if (results.length === 0) {
        setOutput("Query executed successfully.");
        return;
      }

      const result = results[0];

      let table = "";

      // Headers
      table += result.columns.join(" | ") + "\n";
      table += "-".repeat(60) + "\n";

      // Rows
      result.values.forEach((row) => {
        table += row.join(" | ") + "\n";
      });

      setOutput(table);
    } catch (error) {
      setOutput("SQL Error:\n" + error.message);
    }
  }

  async function executeJudge0(sourceCode, languageId) {
    setRunning(true);
    setOutput("Running...");

    try {
      // Step 1: Create submission
      const submitResponse = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin: stdin,
          }),
        }
      );

      if (!submitResponse.ok) {
        throw new Error(`HTTP ${submitResponse.status}`);
      }

      const result = await submitResponse.json();

      let finalOutput =
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        result.message ||
        "No output";

      // Put common input prompts on a new line
      finalOutput = finalOutput.replace(/(Enter[^:\n]*:)/g, "$1\n");

      // Clean extra spaces/newlines
      finalOutput = finalOutput.replace(/\n{3,}/g, "\n\n").trim();

      setOutput(finalOutput);
    } catch (error) {
      setOutput("Execution Error:\n" + error.message);
    } finally {
      setRunning(false);
    }
  }

  async function runCode() {
    const mode = languageMap[language].mode;

    // HTML/CSS Live Preview
    if (mode === "web") {
      setWebPreview(code);
      setOutput("Live preview updated.");
      return;
    }

    // SQL
    if (mode === "sql") {
      executeSQL(code);
      return;
    }

    // Judge0 Languages
    executeJudge0(code, languageMap[language].judge0);
  }

  function resetCode() {
    setCode(starterCode[language]);
    setOutput("");

    if (language === "html" || language === "css") {
      setWebPreview(starterCode[language]);
    }
  }

  return (
    <div className="max-w-[1700px] mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="card-theme rounded-3xl p-6 border border-theme shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl primary-soft flex items-center justify-center">
              <Code2 className="primary-text" size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">SyVA Code Lab</h1>

              <p className="text-theme-muted">
                Practice coding in multiple languages with live execution
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-theme-muted whitespace-nowrap">
                Language
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="
                        min-w-45
                        px-4 py-3
                        rounded-2xl
                        border border-theme
                        bg-theme
                        text-theme
                        font-medium
                        outline-none
                        focus:ring-2 focus:ring-blue-500
                        focus:border-blue-500
                        transition-all duration-300
                        appearance-none
                        cursor-pointer
                        "
              >
                {Object.entries(languageMap).map(([key, value]) => (
                  <option
                    key={key}
                    value={key}
                    className="bg-gray-900 text-white"
                  >
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Layout C */}
      <div className="space-y-6">
        {/* FULL WIDTH EDITOR */}

        <div className="card-theme rounded-3xl border border-theme shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
            <div className="flex items-center gap-2">
              <Code2 className="primary-text" size={20} />

              <h2 className="text-xl font-bold">Editor</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetCode}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-theme hover:bg-theme-hover transition"
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                onClick={runCode}
                disabled={running}
                className="btn-primary px-5 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                <Play size={16} />
                {running ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          <Editor
            height="75vh"
            language={
              language === "cpp"
                ? "cpp"
                : language === "sql"
                  ? "sql"
                  : language === "html"
                    ? "html"
                    : language === "css"
                      ? "css"
                      : language
            }
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 17,
              lineHeight: 28,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 20, bottom: 20 },
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontLigatures: true,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              roundedSelection: true,
              renderLineHighlight: "all",
              wordWrap: "on",
            }}
          />
        </div>

        {/* INPUT + OUTPUT SIDE BY SIDE */}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* PROGRAM INPUT */}

          {languageMap[language].mode === "judge0" ? (
            <div className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
                <div className="flex items-center gap-2">
                  <Terminal className="text-blue-500" size={20} />

                  <h2 className="text-xl font-bold">Program Input (STDIN)</h2>
                </div>

                <span className="text-xs text-theme-muted bg-theme-hover px-3 py-1 rounded-full">
                  Custom Input
                </span>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-theme-muted">
                  Enter input exactly as the program expects. Each line is
                  treated as a separate input value.
                </p>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="line1 ...
line2 ...
line n..."
                  className="w-full h-64 rounded-2xl border border-theme bg-black text-green-400 p-5 font-mono text-base outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-7"
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="surface-secondary rounded-xl p-3">
                    <p className="font-semibold text-theme">Line 1</p>
                    <p className="text-theme-muted">First input value</p>
                  </div>

                  <div className="surface-secondary rounded-xl p-3">
                    <p className="font-semibold text-theme">Line 2</p>
                    <p className="text-theme-muted">Second input value</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-theme rounded-3xl border border-theme shadow-lg p-6 flex items-center justify-center text-theme-muted">
              Program input is available for executable languages.
            </div>
          )}

          {/* OUTPUT CONSOLE */}

          <div className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
              <div className="flex items-center gap-2">
                <Terminal className="text-green-500" size={20} />

                <h2 className="text-xl font-bold">Output Console</h2>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  running
                    ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/30"
                    : "bg-green-500/10 text-green-600 border border-green-500/30"
                }`}
              >
                {running ? "RUNNING" : "READY"}
              </div>
            </div>

            <div className="bg-black min-h-80 p-6 overflow-auto">
              <pre className="text-green-400 font-mono text-base whitespace-pre-wrap leading-8 tracking-wide">
                {output || "Run your code to see the output here..."}
              </pre>
            </div>
          </div>
        </div>

        {/* WEB PREVIEW */}

        {(language === "html" || language === "css") && (
          <div className="card-theme rounded-3xl border border-theme shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-theme">
              <Globe className="text-blue-500" size={20} />

              <h2 className="text-xl font-bold">Live Preview</h2>
            </div>

            <div className="h-125 bg-white">
              <iframe
                title="preview"
                srcDoc={
                  language === "css"
                    ? `<style>${code}</style><h1>CSS Preview</h1>`
                    : webPreview
                }
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Practice;
