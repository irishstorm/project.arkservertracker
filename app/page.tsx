"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Globe, Shield, User, ChevronDown } from "lucide-react";
import ARK_MAPS from "./data/maps.json";

interface Character {
  id: string;
  name: string;
  serverName: string;
  map: string;
  level: number;
}

export default function ArkTracker() {
  const [characters, setCharacters] = useState<Character[]>(() => {
    // Check if we are in a browser environment (to avoid SSR errors)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ark_characters");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serverName: "",
    map: ARK_MAPS[0],
    level: 1,
  });

  useEffect(() => {
    localStorage.setItem("ark_characters", JSON.stringify(characters));
  }, [characters]);

  const addCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    const newChar: Character = {
      ...formData,
      id: crypto.randomUUID(),
    };
    setCharacters([...characters, newChar]);
    setFormData({ name: "", serverName: "", map: ARK_MAPS[0], level: 1 });
    setIsAdding(false);
  };

  const deleteCharacter = (id: string) => {
    setCharacters(characters.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-end mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ARK TRACKER
            </h1>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
              Dude!?! Where&apos;s my Survivor?
            </p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-all px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/40 active:scale-95"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform"
            />
            Add Survivor
          </button>
        </header>

        {/* Add Form */}
        {isAdding && (
          <form
            onSubmit={addCharacter}
            className="mb-8 bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Survivor Name
              </label>
              <input
                required
                placeholder="Bob"
                value={formData.name}
                className="w-full bg-slate-800 placeholder:text-white border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-1 flex">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Server Number
              </label>
              <input
                required
                value={formData.serverName}
                placeholder="5583"
                className="w-full bg-slate-800 placeholder:text-white border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, serverName: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Current Map
              </label>
              <div className="relative">
                <select
                  value={formData.map}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, map: e.target.value })
                  }
                >
                  {ARK_MAPS.map((map) => (
                    <option key={map} value={map}>
                      {map}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-3 text-slate-500 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">
                Character Level
              </label>
              <input
                type="number"
                value={formData.level}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    level: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all"
              >
                Save Survivor
              </button>
            </div>
          </form>
        )}

        {/* Character List */}
        <div className="grid grid-cols-1 gap-4">
          {characters.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
              <div className="inline-flex p-4 bg-slate-800/50 rounded-full mb-4 text-slate-600">
                <Shield size={32} />
              </div>
              <p className="text-slate-500 font-medium italic">
                Add a survivor to begin tracking.
              </p>
            </div>
          ) : (
            characters.map((char) => (
              <div
                key={char.id}
                className="group bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/40 hover:bg-slate-900 transition-all shadow-xl hover:shadow-blue-900/10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight leading-none mb-1">
                        {char.name}
                      </h3>
                      <div className="flex items-center gap-2 w-96">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                          Lvl {char.level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 flex-1 max-w-md px-6 border-l border-slate-800/50">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-600 mb-1 tracking-widest">
                        Server
                      </p>
                      <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Globe size={14} className="text-blue-500" />{" "}
                        {char.serverName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-600 mb-1 tracking-widest">
                        Location
                      </p>
                      <p className="text-sm font-bold text-slate-300 uppercase truncate w-64">
                        {char.map}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCharacter(char.id)}
                    className="md:opacity-0 group-hover:opacity-100 transition-all p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
