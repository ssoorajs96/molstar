'use client';

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

interface MolstarViewerProps {
    pdbId: string;
    className?: string;
    spin?: boolean;
}

export interface MolstarViewerHandle {
    changeColor: (hexColor: string) => void;
    changeTheme: (themeName: string) => void;
    resetColor: () => void;
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

const MolstarViewer = forwardRef<MolstarViewerHandle, MolstarViewerProps>(function MolstarViewer(
    { pdbId, className = '', spin = false },
    ref
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const initializingRef = useRef(false);

    // Expose changeColor, changeTheme, and resetColor methods via ref
    useImperativeHandle(ref, () => ({
        changeColor(hexColor: string) {
            const plugin = viewerRef.current?.plugin;
            if (!plugin) return;

            const structures = plugin.managers.structure.hierarchy.current.structures;
            if (!structures || structures.length === 0) return;

            const hexValue = parseInt(hexColor.replace('#', ''), 16);

            for (const structure of structures) {
                const components = structure.components;
                plugin.managers.structure.component.updateRepresentationsTheme(components, {
                    color: 'uniform',
                    colorParams: { value: hexValue },
                });
            }
        },
        changeTheme(themeName: string) {
            const plugin = viewerRef.current?.plugin;
            if (!plugin) return;

            const structures = plugin.managers.structure.hierarchy.current.structures;
            if (!structures || structures.length === 0) return;

            for (const structure of structures) {
                const components = structure.components;
                plugin.managers.structure.component.updateRepresentationsTheme(components, {
                    color: themeName as any,
                });
            }
        },
        resetColor() {
            const plugin = viewerRef.current?.plugin;
            if (!plugin) return;

            const structures = plugin.managers.structure.hierarchy.current.structures;
            if (!structures || structures.length === 0) return;

            for (const structure of structures) {
                const components = structure.components;
                plugin.managers.structure.component.updateRepresentationsTheme(components, {
                    color: 'default',
                });
            }
        },
    }));

    const initViewer = useCallback(async () => {
        if (!containerRef.current || initializingRef.current) return;
        initializingRef.current = true;

        try {
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

            // Access the plugin for low-level control
            const plugin = viewer.plugin;

            // Step 1: Download the CIF data
            const url = `https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`;
            const data = await plugin.builders.data.download(
                { url, isBinary: false },
                { state: { isGhost: true } }
            );

            // Step 2: Parse trajectory from the downloaded data
            const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif');

            // Step 3: Apply preset with default representation
            await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default', {
                structure: {
                    name: 'model',
                    params: {},
                },
                showUnitcell: false,
                representationPreset: 'auto',
            });

            // Enable spin if requested
            if (spin && plugin.canvas3d) {
                const trackball = plugin.canvas3d.props.trackball;
                plugin.canvas3d.setProps({
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
});

export default MolstarViewer;
