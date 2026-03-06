'use client';

import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getMoleculeById } from '../../data/mock-molecules';
import type { MolstarViewerHandle } from '../../components/MolstarViewer';

const MolstarViewer = dynamic(
    () => import('../../components/MolstarViewer'),
    {
        ssr: false,
        loading: () => (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Initializing Mol* viewer...</span>
            </div>
        ),
    }
);

type ColorOption = {
    name: string;
    type: 'color' | 'theme' | 'reset';
    value: string;
    swatch: string;
    description?: string;
};

const COLOR_OPTIONS: { group: string; items: ColorOption[] }[] = [
    {
        group: 'Reset',
        items: [
            { name: 'Default', type: 'reset', value: '', swatch: 'linear-gradient(135deg, #22c55e, #3b82f6, #ef4444)', description: 'Mol* auto coloring' },
        ],
    },
    {
        group: 'Coloring Modes',
        items: [
            { name: 'By Chain', type: 'theme', value: 'chain-id', swatch: 'linear-gradient(135deg, #22c55e, #3b82f6)', description: 'Each chain gets a unique color' },
            { name: 'By Secondary Structure', type: 'theme', value: 'secondary-structure', swatch: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', description: 'Helix / Sheet / Loop' },
            { name: 'By Element', type: 'theme', value: 'element-symbol', swatch: 'linear-gradient(135deg, #888, #ef4444, #3b82f6)', description: 'CPK (C=gray, O=red, N=blue)' },
            { name: 'By Residue', type: 'theme', value: 'residue-name', swatch: 'linear-gradient(135deg, #f59e0b, #ec4899, #06b6d4)', description: 'Color by amino acid type' },
            { name: 'By Entity', type: 'theme', value: 'entity-id', swatch: 'linear-gradient(135deg, #14b8a6, #f97316)', description: 'Groups identical chains' },
            { name: 'By Molecule Type', type: 'theme', value: 'molecule-type', swatch: 'linear-gradient(135deg, #6366f1, #22c55e, #ef4444)', description: 'Protein / DNA / Ligand' },
            { name: 'Hydrophobicity', type: 'theme', value: 'hydrophobicity', swatch: 'linear-gradient(135deg, #3b82f6, #ef4444)', description: 'Hydrophilic → Hydrophobic' },
            { name: 'By Sequence Position', type: 'theme', value: 'sequence-id', swatch: 'linear-gradient(135deg, #3b82f6, #22c55e, #eab308, #ef4444)', description: 'N-terminus → C-terminus rainbow' },
        ],
    },
    {
        group: 'Solid Colors',
        items: [
            { name: 'Red', type: 'color', value: '#ef4444', swatch: '#ef4444' },
            { name: 'Orange', type: 'color', value: '#f97316', swatch: '#f97316' },
            { name: 'Amber', type: 'color', value: '#f59e0b', swatch: '#f59e0b' },
            { name: 'Green', type: 'color', value: '#22c55e', swatch: '#22c55e' },
            { name: 'Teal', type: 'color', value: '#14b8a6', swatch: '#14b8a6' },
            { name: 'Cyan', type: 'color', value: '#06b6d4', swatch: '#06b6d4' },
            { name: 'Blue', type: 'color', value: '#3b82f6', swatch: '#3b82f6' },
            { name: 'Indigo', type: 'color', value: '#6366f1', swatch: '#6366f1' },
            { name: 'Violet', type: 'color', value: '#8b5cf6', swatch: '#8b5cf6' },
            { name: 'Pink', type: 'color', value: '#ec4899', swatch: '#ec4899' },
            { name: 'Rose', type: 'color', value: '#f43f5e', swatch: '#f43f5e' },
            { name: 'Gold', type: 'color', value: '#eab308', swatch: '#eab308' },
            { name: 'White', type: 'color', value: '#e2e8f0', swatch: '#e2e8f0' },
        ],
    },
];

function findOption(type: string, value: string): ColorOption | undefined {
    for (const group of COLOR_OPTIONS) {
        const found = group.items.find(item => item.type === type && item.value === value);
        if (found) return found;
    }
    return undefined;
}

export default function ViewerPage() {
    const params = useParams();
    const id = params.id as string;
    const molecule = getMoleculeById(id);
    const viewerRef = useRef<MolstarViewerHandle>(null);
    const [selectedType, setSelectedType] = useState('reset');
    const [selectedValue, setSelectedValue] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!molecule) {
        return (
            <div className="page-container" style={{ paddingTop: 120, textAlign: 'center' }}>
                <h1 style={{ fontSize: 32, marginBottom: 16 }}>Molecule Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
                    The molecule with ID &quot;{id}&quot; was not found in our database.
                </p>
                <Link href="/" className="viewer-back">
                    ← Back to Gallery
                </Link>
            </div>
        );
    }

    const handleOptionSelect = (option: ColorOption) => {
        setSelectedType(option.type);
        setSelectedValue(option.value);
        setIsDropdownOpen(false);

        if (option.type === 'reset') {
            viewerRef.current?.resetColor();
        } else if (option.type === 'theme') {
            viewerRef.current?.changeTheme(option.value);
        } else if (option.type === 'color') {
            viewerRef.current?.changeColor(option.value);
        }
    };

    const currentOption = findOption(selectedType, selectedValue) || COLOR_OPTIONS[0].items[0];

    return (
        <div className="viewer-layout">
            {/* Sidebar */}
            <aside className="viewer-sidebar">
                <Link href="/" className="viewer-back">
                    ← Back to Gallery
                </Link>

                <div>
                    <h1 className="viewer-mol-name">{molecule.name}</h1>
                    <span
                        className="viewer-mol-category"
                        style={{
                            background: `${molecule.color}15`,
                            color: molecule.color,
                            border: `1px solid ${molecule.color}30`,
                        }}
                    >
                        {molecule.category}
                    </span>
                </div>

                <p className="viewer-mol-desc">{molecule.description}</p>

                <div className="viewer-info-grid">
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">PDB ID</div>
                        <div className="viewer-info-value" style={{ color: molecule.color }}>
                            {molecule.pdbId}
                        </div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Resolution</div>
                        <div className="viewer-info-value">{molecule.resolution}</div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Atoms</div>
                        <div className="viewer-info-value">
                            {molecule.atomCount.toLocaleString()}
                        </div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Residues</div>
                        <div className="viewer-info-value">
                            {molecule.residueCount.toLocaleString()}
                        </div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Weight</div>
                        <div className="viewer-info-value">{molecule.molecularWeight}</div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Organism</div>
                        <div className="viewer-info-value">{molecule.organism}</div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Class</div>
                        <div className="viewer-info-value">{molecule.classification}</div>
                    </div>
                    <div className="viewer-info-card">
                        <div className="viewer-info-label">Source</div>
                        <div className="viewer-info-value">
                            <a
                                href={`https://www.rcsb.org/structure/${molecule.pdbId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--accent-primary)', fontSize: 13 }}
                            >
                                RCSB PDB ↗
                            </a>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Viewer */}
            <main className="viewer-main">
                {/* Color Picker Toolbar */}
                <div className="color-picker-toolbar">
                    <span className="color-picker-label">🎨 Coloring</span>
                    <div className="color-dropdown-wrapper">
                        <button
                            className="color-dropdown-trigger"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span
                                className="color-swatch"
                                style={{ background: currentOption.swatch }}
                            />
                            <span>{currentOption.name}</span>
                            <span className={`color-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▾</span>
                        </button>
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="color-dropdown-backdrop"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="color-dropdown-menu">
                                    {COLOR_OPTIONS.map((group) => (
                                        <div key={group.group}>
                                            <div className="color-dropdown-group-label">
                                                {group.group}
                                            </div>
                                            {group.items.map((option) => (
                                                <button
                                                    key={`${option.type}-${option.value}`}
                                                    className={`color-dropdown-item ${selectedType === option.type && selectedValue === option.value ? 'active' : ''}`}
                                                    onClick={() => handleOptionSelect(option)}
                                                >
                                                    <span
                                                        className="color-swatch"
                                                        style={{ background: option.swatch }}
                                                    />
                                                    <span className="color-dropdown-item-text">
                                                        <span>{option.name}</span>
                                                        {option.description && (
                                                            <span className="color-dropdown-item-desc">{option.description}</span>
                                                        )}
                                                    </span>
                                                    {selectedType === option.type && selectedValue === option.value && (
                                                        <span className="color-check">✓</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <MolstarViewer
                    ref={viewerRef}
                    pdbId={molecule.pdbId}
                    spin={true}
                />
                <div className="viewer-pdb-badge">
                    Viewing: <span>{molecule.pdbId}</span> — {molecule.name}
                </div>
            </main>
        </div>
    );
}
