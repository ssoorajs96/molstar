'use client';

import { useEffect, useRef, useCallback } from 'react';
import 'molstar/lib/mol-plugin-ui/skin/light.scss';

interface MolstarViewerProps {
    pdbUrl: string;
    className?: string;
    backgroundColor?: string;
    spin?: boolean;
}

export default function MolstarViewer({
    pdbUrl,
    className = '',
    backgroundColor = '#0a0a1a',
    spin = false,
}: MolstarViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pluginRef = useRef<any>(null);
    const initializingRef = useRef(false);

    const initViewer = useCallback(async () => {
        if (!containerRef.current || initializingRef.current) return;
        initializingRef.current = true;

        try {
            // Dynamic imports to avoid SSR issues
            const { createPluginUI } = await import('molstar/lib/mol-plugin-ui');
            const { renderReact18 } = await import('molstar/lib/mol-plugin-ui/react18');
            const { DefaultPluginUISpec } = await import('molstar/lib/mol-plugin-ui/spec');
            const { PluginCommands } = await import('molstar/lib/mol-plugin/commands');
            const { Color } = await import('molstar/lib/mol-util/color');
            const { Asset } = await import('molstar/lib/mol-util/assets');

            if (pluginRef.current) {
                pluginRef.current.dispose();
            }

            const plugin = await createPluginUI({
                target: containerRef.current,
                render: renderReact18,
                spec: {
                    ...DefaultPluginUISpec(),
                    layout: {
                        initial: {
                            isExpanded: false,
                            showControls: false,
                        },
                    },
                    components: {
                        remoteState: 'none',
                    },
                },
            });

            pluginRef.current = plugin;

            // Set background color
            const hexColor = parseInt(backgroundColor.replace('#', ''), 16);
            PluginCommands.Canvas3D.SetSettings(plugin, {
                settings: (props: any) => {
                    props.renderer.backgroundColor = Color(hexColor);
                },
            });

            // Load structure
            const data = await plugin.builders.data.download(
                { url: Asset.Url(pdbUrl), isBinary: false },
                { state: { isGhost: true } }
            );
            const trajectory = await plugin.builders.structure.parseTrajectory(data, 'mmcif');
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
                PluginCommands.Canvas3D.SetSettings(plugin, {
                    settings: {
                        trackball: {
                            ...plugin.canvas3d.props.trackball,
                            animate: { name: 'spin', params: { speed: 0.5 } },
                        },
                    },
                });
            }
        } catch (error) {
            console.error('Failed to initialize Mol* viewer:', error);
        } finally {
            initializingRef.current = false;
        }
    }, [pdbUrl, backgroundColor, spin]);

    useEffect(() => {
        initViewer();

        return () => {
            if (pluginRef.current) {
                pluginRef.current.dispose();
                pluginRef.current = null;
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
