"use client";
import { useState, useEffect } from "react";

type Todo = { id: string; text: string; completed: boolean };
type Filter = "all" | "active" | "completed";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: input.trim(), completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">✓</span> Todo App
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Dark mode · LocalStorage · Next.js</p>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
            />
            <button
              onClick={addTodo}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex gap-1">
            {(["all", "active", "completed"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-zinc-600 py-8">No tasks yet. Add one above!</p>
            ) : (
              filtered.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2 group"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-zinc-600 hover:border-violet-500"
                    }`}
                  >
                    {todo.completed && <span className="text-xs text-white">✓</span>}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed ? "line-through text-zinc-600" : "text-zinc-200"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
              <span>{todos.filter((t) => !t.completed).length} active</span>
              <span>{todos.length} total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}