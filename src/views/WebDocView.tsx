import React, { useState } from 'react';
import { SPECIFICATION_DOCS } from '../data/specsData';
import { DocFileSpec } from '../types';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Search, 
  ExternalLink,
  Code,
  Sparkles
} from 'lucide-react';
import { sound } from '../services/audioService';

export const WebDocView: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocFileSpec>(SPECIFICATION_DOCS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocs = SPECIFICATION_DOCS.filter(doc => 
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(selectedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sound.playClick();
    const blob = new Blob([selectedDoc.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedDoc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              TECHNICAL SPECIFICATIONS & PUBLIC SPECS
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Web Documentation Matrix
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Access, view, copy, and export all 16 foundational game design, movement, HUD, and compliance specifications.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-docs"
            type="text"
            placeholder="Search 16 specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11131a] border border-[#1e2230] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Document Sidebar (Left Col) */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase px-1">
            Available Specs ({filteredDocs.length})
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc.filename === doc.filename;
              return (
                <button
                  key={doc.filename}
                  id={`doc-select-${doc.filename}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedDoc(doc);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-left font-mono transition-all space-y-0.5 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/80 text-blue-200 shadow-sm'
                      : 'bg-[#0c0e14] border-[#1e2230] hover:border-slate-600 text-slate-400 hover:bg-[#11131a]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200 truncate">{doc.filename}</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#11131a] border border-[#1e2230] text-blue-300">
                      {doc.category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate font-sans">{doc.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Markdown Reader Panel (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          
          <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs shadow-md">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-slate-100 text-xs">{selectedDoc.filename}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px]">{selectedDoc.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-doc-btn"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-[#11131a] hover:bg-[#161821] text-slate-200 border border-[#1e2230] flex items-center gap-1.5 transition-colors text-xs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
              </button>

              <button
                id="download-doc-btn"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700/60 flex items-center gap-1.5 transition-colors text-xs font-semibold"
              >
                <Download className="w-3 h-3" />
                <span>Export .md</span>
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="p-5 rounded-xl bg-[#050608] border border-[#1e2230] font-mono text-xs leading-relaxed text-slate-300 max-h-[560px] overflow-y-auto whitespace-pre-wrap selection:bg-blue-950">
            {selectedDoc.content}
          </div>

        </div>

      </div>

    </div>
  );
};
