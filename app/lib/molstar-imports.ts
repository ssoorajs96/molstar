// Consolidated molstar imports to avoid circular dependency issues with Turbopack
// By re-exporting from a single file, the bundler can resolve the module graph correctly

export { createPluginUI } from 'molstar/lib/mol-plugin-ui';
export { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
export { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
export { PluginCommands } from 'molstar/lib/mol-plugin/commands';
export { Color } from 'molstar/lib/mol-util/color';
export { Asset } from 'molstar/lib/mol-util/assets';
