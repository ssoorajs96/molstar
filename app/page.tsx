import Link from 'next/link';
import { molecules } from './data/mock-molecules';

const categoryIcons: Record<string, string> = {
  'Protein': '🧬',
  'Nucleic Acid': '🔬',
  'Enzyme': '⚗️',
};

export default function Home() {
  const totalAtoms = molecules.reduce((sum, m) => sum + m.atomCount, 0);
  const totalResidues = molecules.reduce((sum, m) => sum + m.residueCount, 0);
  const categories = [...new Set(molecules.map((m) => m.category))];

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="nav animate-in">
        <div className="nav-brand">
          <div className="nav-logo">M*</div>
          <div className="nav-title">
            Mol<span>Viz</span>
          </div>
        </div>
        <div className="nav-badge">Powered by Mol*</div>
      </nav>

      {/* Hero */}
      <section className="hero animate-in delay-1">
        <div className="hero-eyebrow">
          <span>⚛️</span> Molecular Visualization Platform
        </div>
        <h1>Explore Molecular Structures in 3D</h1>
        <p>
          Interactive visualization of proteins, DNA, and biomolecules powered by
          the Mol* library. Click any molecule below to explore its 3D structure.
        </p>
      </section>

      {/* Stats */}
      <div className="stats-row animate-in delay-2">
        <div className="stat-card">
          <div className="stat-label">Molecules</div>
          <div className="stat-value">
            {molecules.length}
            <span>structures</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Atoms</div>
          <div className="stat-value">
            {totalAtoms.toLocaleString()}
            <span>atoms</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Residues</div>
          <div className="stat-value">
            {totalResidues.toLocaleString()}
            <span>residues</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">
            {categories.length}
            <span>types</span>
          </div>
        </div>
      </div>

      {/* Molecule Grid */}
      <div className="section-header animate-in delay-3">
        <div>
          <h2>Molecule Gallery</h2>
          <p>Select a molecule to launch the interactive 3D viewer</p>
        </div>
      </div>

      <div className="molecule-grid">
        {molecules.map((molecule, index) => (
          <Link
            href={`/viewer/${molecule.id}`}
            key={molecule.id}
            className={`molecule-card animate-in delay-${Math.min(index + 3, 6)}`}
          >
            <div className="molecule-card-visual">
              <div
                className="molecule-card-gradient"
                style={{ background: molecule.gradient }}
              />
              <div className="molecule-card-icon">
                {categoryIcons[molecule.category] || '🧪'}
              </div>
              <div className="molecule-card-arrow">→</div>
            </div>
            <div className="molecule-card-body">
              <span
                className="molecule-card-category"
                style={{
                  background: `${molecule.color}15`,
                  color: molecule.color,
                  border: `1px solid ${molecule.color}30`,
                }}
              >
                {molecule.category}
              </span>
              <h3 className="molecule-card-name">{molecule.name}</h3>
              <p className="molecule-card-desc">{molecule.description}</p>
              <div className="molecule-card-meta">
                <div className="molecule-card-meta-item">
                  <span className="molecule-card-meta-label">PDB ID</span>
                  <span
                    className="molecule-card-meta-value"
                    style={{ color: molecule.color }}
                  >
                    {molecule.pdbId}
                  </span>
                </div>
                <div className="molecule-card-meta-item">
                  <span className="molecule-card-meta-label">Atoms</span>
                  <span className="molecule-card-meta-value">
                    {molecule.atomCount.toLocaleString()}
                  </span>
                </div>
                <div className="molecule-card-meta-item">
                  <span className="molecule-card-meta-label">Resolution</span>
                  <span className="molecule-card-meta-value">
                    {molecule.resolution}
                  </span>
                </div>
                <div className="molecule-card-meta-item">
                  <span className="molecule-card-meta-label">Weight</span>
                  <span className="molecule-card-meta-value">
                    {molecule.molecularWeight}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer animate-in">
        Powered by{' '}
        <a href="https://molstar.org" target="_blank" rel="noopener noreferrer">
          Mol*
        </a>{' '}
        — Molecular visualization for the modern web
      </footer>
    </div>
  );
}
