"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, CornerDownLeft, Search } from "lucide-react";
import type { PaletteItem } from "./palette-items";

const EMAIL = "mangalarapuarvind@gmail.com";
const MAX_RESULTS = 14;
export const OPEN_PALETTE_EVENT = "open-command-palette";

function matches(item: PaletteItem, query: string) {
  if (!query) return true;
  const haystack = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const results = useMemo(() => items.filter((item) => matches(item, query)).slice(0, MAX_RESULTS), [items, query]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActiveIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    const onOpenRequest = () => open();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenRequest);
    };
  }, [open, close]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const run = async (item: PaletteItem) => {
    if (item.action === "copy-email") {
      try {
        await navigator.clipboard.writeText(EMAIL);
        setToast("Email copied");
      } catch {
        window.location.href = `mailto:${EMAIL}`;
      }
      close();
      return;
    }
    if (!item.href) return;
    close();
    if (item.external) {
      window.open(item.href, item.href.startsWith("mailto:") ? "_self" : "_blank", "noopener");
      return;
    }
    router.push(item.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) void run(item);
    }
  };

  let lastGroup: PaletteItem["group"] | null = null;

  return (
    <>
      <dialog
        ref={dialogRef}
        className="command-palette"
        aria-label="Command palette"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="command-palette-panel">
          <div className="command-palette-search">
            <Search aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label="Search pages, projects and actions"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined}
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              placeholder="Jump to a project, page or action…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onInputKeyDown}
            />
            <kbd>esc</kbd>
          </div>

          <ul id={listId} role="listbox" aria-label="Results" className="command-palette-list">
            {results.length === 0 ? (
              <li className="command-palette-empty" role="presentation">No matches for “{query}”.</li>
            ) : null}
            {results.map((item, index) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <li key={item.id} role="presentation">
                  {showGroup ? <span className="command-palette-group" aria-hidden="true">{item.group}</span> : null}
                  <button
                    type="button"
                    role="option"
                    id={`${listId}-${item.id}`}
                    aria-selected={index === activeIndex}
                    className={index === activeIndex ? "active" : undefined}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => void run(item)}
                  >
                    <span>
                      <strong>{item.label}</strong>
                      {item.hint ? <small>{item.hint}</small> : null}
                    </span>
                    {item.external ? <ArrowUpRight aria-hidden="true" /> : <CornerDownLeft aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <footer className="command-palette-footer" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </footer>
        </div>
      </dialog>
      <div className="palette-toast" role="status" aria-live="polite">
        {toast ? <><Check aria-hidden="true" />{toast}</> : null}
      </div>
    </>
  );
}
