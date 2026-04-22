"use client";

interface MenuButtonProps {
  open: boolean;
  onClick: () => void;
}

export default function MenuButton({ open, onClick }: MenuButtonProps) {
  return (
    <>
      <style>{`
        .menu-btn {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hover-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, border-color 0.2s;
          padding: 0;
        }
        .menu-btn:hover {
          background: rgba(200,169,110,0.08);
          border-color: rgba(200,169,110,0.25);
        }
        .menu-btn:hover .bar-1 { transform: translateX(3px); }
        .menu-btn:hover .bar-2 { transform: translateX(-3px); }
        .menu-btn:hover .bar-3 { transform: translateX(3px); }

        .bar-wrap {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-start;
          width: 20px;
        }

        .bar {
          height: 2px;
          border-radius: 2px;
          background: #c8a96e;
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
                      width 0.35s cubic-bezier(0.23, 1, 0.32, 1),
                      opacity 0.25s ease,
                      background 0.2s;
        }

        /* Staggered widths when closed */
        .bar-1 { width: 20px; transition-delay: 0s, 0s, 0s, 0s; }
        .bar-2 { width: 13px; transition-delay: 0.04s, 0.04s, 0.04s, 0s; }
        .bar-3 { width: 17px; transition-delay: 0.08s, 0.08s, 0.08s, 0s; }

        /* Hover overrides — reset delays */
        .menu-btn:hover .bar-1,
        .menu-btn:hover .bar-2,
        .menu-btn:hover .bar-3 {
          transition-delay: 0s;
        }

        /* Open state */
        .bar-1.open {
          width: 20px;
          transform: translateY(7px) rotate(45deg);
          transition-delay: 0.05s, 0.05s, 0s, 0s;
        }
        .bar-2.open {
          width: 0;
          opacity: 0;
          transition-delay: 0s, 0s, 0s, 0s;
        }
        .bar-3.open {
          width: 20px;
          transform: translateY(-7px) rotate(-45deg);
          transition-delay: 0.05s, 0.05s, 0s, 0s;
        }
      `}</style>

      <button className="menu-btn" onClick={onClick} aria-label={open ? "Close menu" : "Open menu"}>
        <div className="bar-wrap">
          <div className={`bar bar-1${open ? " open" : ""}`} />
          <div className={`bar bar-2${open ? " open" : ""}`} />
          <div className={`bar bar-3${open ? " open" : ""}`} />
        </div>
      </button>
    </>
  );
}
