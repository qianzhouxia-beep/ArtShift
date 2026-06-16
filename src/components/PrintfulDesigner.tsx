import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PrintfulDesignerProps {
  /** Printful product ID (number, from Printful catalog) */
  productId: number;
  /** Your external product identifier string */
  externalProductId: string;
  /** Optional: auto-apply an image URL when designer opens */
  initialImageUrl?: string;
  /** Called when the user saves a template in the designer */
  onTemplateSaved?: (templateId: string) => void;
  /** Called when the designer is closed */
  onClose: () => void;
}

type LoadState = 'loading_nonce' | 'loading_script' | 'creating_designer' | 'ready' | 'error';

// ─── Globals ────────────────────────────────────────────────────────────────

let embedScriptLoaded = false;
let embedScriptPromise: Promise<void> | null = null;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function loadEmbedScript(): Promise<void> {
  if (embedScriptLoaded) return;
  if (embedScriptPromise) return embedScriptPromise;

  embedScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src*="embed.js"]');
    if (existing) {
      embedScriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://files.cdn.printful.com/embed/embed.js';
    script.async = true;
    script.onload = () => {
      embedScriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      embedScriptPromise = null;
      reject(new Error('Failed to load Printful embed script'));
    };
    document.head.appendChild(script);
  });

  return embedScriptPromise;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PrintfulDesigner({
  productId,
  externalProductId,
  initialImageUrl,
  onTemplateSaved,
  onClose,
}: PrintfulDesignerProps) {
  const [state, setState] = useState<LoadState>('loading_nonce');
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<any>(null);
  const initAttempted = useRef(false);

  const initDesigner = useCallback(async () => {
    try {
      setState('loading_nonce');
      setErrorMessage('');

      // Step 1: Fetch nonce
      const res = await fetch('/api/printful/edm-nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          external_product_id: externalProductId,
          external_customer_id: null,
        }),
      });
      const nonceData = await res.json();
      if (!nonceData.ok || !nonceData.nonce) {
        throw new Error(nonceData.error || 'Failed to get designer session');
      }

      // Step 2: Load embed script
      setState('loading_script');
      await loadEmbedScript();

      // Step 3: Create PFDesignMaker instance
      setState('creating_designer');
      const PFDesignMaker = (window as any).PFDesignMaker;
      if (!PFDesignMaker) {
        throw new Error('PFDesignMaker not found after script load');
      }
      if (!containerRef.current) {
        throw new Error('Container not ready');
      }

      const designer = new PFDesignMaker({
        container: containerRef.current,
        nonce: nonceData.nonce,
        externalProductId,
        productId,
        ...(initialImageUrl ? { applyImageFromUrl: initialImageUrl } : {}),
        onSave: (template: any) => {
          const templateId = template?.id || template?.template_id || '';
          if (templateId && onTemplateSaved) {
            onTemplateSaved(String(templateId));
          }
        },
        onClose: () => {
          onClose();
        },
      });

      designerRef.current = designer;
      setState('ready');
    } catch (err: any) {
      console.error('[PrintfulDesigner] Init failed:', err);
      setErrorMessage(err.message || 'Failed to load the design editor');
      setState('error');
    }
  }, [productId, externalProductId, initialImageUrl, onTemplateSaved, onClose]);

  // ── Lifecycle ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initAttempted.current) {
      initAttempted.current = true;
      initDesigner();
    }

    return () => {
      if (designerRef.current) {
        try {
          if (typeof designerRef.current.destroy === 'function') {
            designerRef.current.destroy();
          }
        } catch (e) {
          console.warn('[PrintfulDesigner] Cleanup error:', e);
        }
        designerRef.current = null;
      }
    };
  }, [initDesigner]);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl mx-4 h-[90vh] bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-on-surface">
            Customize Your Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-highest transition-colors"
            aria-label="Close designer"
          >
            <span className="material-symbols-outlined text-xl text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 relative bg-white">
          {/* Loading / Error overlay */}
          {state !== 'ready' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              {state === 'error' ? (
                <div className="text-center max-w-md px-6">
                  <span className="material-symbols-outlined text-5xl mb-4 text-red-400">error_outline</span>
                  <p className="text-on-surface font-semibold mb-2 text-lg">Failed to Load Designer</p>
                  <p className="text-on-surface-variant text-sm mb-6">{errorMessage}</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={initDesigner}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white bg-vivid-purple hover:bg-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      Retry
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-xl px-5 py-2.5 text-sm font-bold text-on-surface-variant border border-outline-variant hover:bg-surface-container-high transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-vivid-purple border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-on-surface-variant text-sm">
                    {state === 'loading_nonce' && 'Connecting to Printful...'}
                    {state === 'loading_script' && 'Loading designer...'}
                    {state === 'creating_designer' && 'Preparing editor...'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Designer iframe container */}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ display: state === 'ready' ? 'block' : 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
