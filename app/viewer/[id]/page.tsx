'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getMoleculeById } from '../../data/mock-molecules';

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

export default function ViewerPage() {
    const params = useParams();
    const id = params.id as string;
    const molecule = getMoleculeById(id);

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
                <MolstarViewer
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
