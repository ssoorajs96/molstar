'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MolstarViewerProps {
    pdbId: string;
    className?: string;
    spin?: boolean;
}

declare global {
    interface Window {
        molstar: {
            Viewer: {
                create: (elementOrId: string | HTMLElement, options?: Record<string, unknown>) => Promise<any>;
            };
        };
    }
}

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

function loadStylesheet(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
        document.head.appendChild(link);
    });
}

export default function MolstarViewer({
    pdbId,
    className = '',
    spin = false,
}: MolstarViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const initializingRef = useRef(false);

    const initViewer = useCallback(async () => {
        if (!containerRef.current || initializingRef.current) return;
        initializingRef.current = true;

        try {
            // Load pre-built molstar from public folder (bypasses Turbopack bundling)
            await loadStylesheet('/molstar.css');
            await loadScript('/molstar.js');

            if (!window.molstar) {
                throw new Error('Molstar failed to load');
            }

            if (viewerRef.current) {
                viewerRef.current.dispose();
            }

            const viewer = await window.molstar.Viewer.create(containerRef.current, {
                layoutIsExpanded: false,
                layoutShowControls: false,
                layoutShowRemoteState: false,
                layoutShowSequence: false,
                layoutShowLog: false,
                layoutShowLeftPanel: false,
                viewportShowExpand: false,
                viewportShowSelectionMode: false,
                viewportShowAnimation: false,
                pdbProvider: 'rcsb',
            });

            viewerRef.current = viewer;

            // Load structure by PDB ID
            await viewer.loadPdb(pdbId.toLowerCase());

            // Enable spin if requested
            if (spin && viewer.plugin?.canvas3d) {
                const trackball = viewer.plugin.canvas3d.props.trackball;
                viewer.plugin.canvas3d.setProps({
                    trackball: {
                        ...trackball,
                        animate: { name: 'spin', params: { speed: 0.5 } },
                    },
                });
            }
        } catch (error) {
            console.error('Failed to initialize Mol* viewer:', error);
        } finally {
            initializingRef.current = false;
        }
    }, [pdbId, spin]);

    useEffect(() => {
        initViewer();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
            }
            initializingRef.current = false;
        };
    }, [initViewer]);

    return (
        <div
            ref={containerRef}
            className={`molstar-viewer-container ${className}`}
            style={{ width: '100%', height: '100%', position: 'relative' }}
        />
    );
}
