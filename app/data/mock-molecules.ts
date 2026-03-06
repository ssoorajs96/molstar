export interface Molecule {
    id: string;
    name: string;
    description: string;
    pdbId: string;
    category: string;
    atomCount: number;
    residueCount: number;
    molecularWeight: string;
    resolution: string;
    organism: string;
    classification: string;
    color: string;
    gradient: string;
}

export const molecules: Molecule[] = [
    {
        id: 'crambin',
        name: 'Crambin',
        description: 'A small, well-characterized protein from the seeds of the Crambe abyssinica plant. One of the highest resolution protein structures ever determined.',
        pdbId: '1CRN',
        category: 'Protein',
        atomCount: 327,
        residueCount: 46,
        molecularWeight: '4.7 kDa',
        resolution: '0.54 Å',
        organism: 'Crambe abyssinica',
        classification: 'Plant Protein',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
        id: 'hemoglobin',
        name: 'Hemoglobin',
        description: 'The oxygen-carrying metalloprotein in red blood cells. This tetrameric protein is responsible for transporting oxygen from lungs to tissues.',
        pdbId: '4HHB',
        category: 'Protein',
        atomCount: 4779,
        residueCount: 574,
        molecularWeight: '64.5 kDa',
        resolution: '1.74 Å',
        organism: 'Homo sapiens',
        classification: 'Oxygen Transport',
        color: '#000',
        gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    },
    {
        id: 'dna-dodecamer',
        name: 'DNA B-Form',
        description: 'The classic Dickerson-Drew dodecamer — a 12 base-pair DNA duplex that revealed the detailed atomic structure of B-form DNA.',
        pdbId: '1BNA',
        category: 'Nucleic Acid',
        atomCount: 566,
        residueCount: 24,
        molecularWeight: '7.7 kDa',
        resolution: '1.90 Å',
        organism: 'Synthetic',
        classification: 'DNA',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    },
    {
        id: 'insulin',
        name: 'Insulin',
        description: 'A peptide hormone produced by beta cells of the pancreatic islets. It regulates glucose metabolism and is critical for diabetes treatment.',
        pdbId: '3I40',
        category: 'Protein',
        atomCount: 786,
        residueCount: 51,
        molecularWeight: '5.8 kDa',
        resolution: '1.85 Å',
        organism: 'Homo sapiens',
        classification: 'Hormone',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #eab308)',
    },
    {
        id: 'lysozyme',
        name: 'Lysozyme',
        description: 'An antimicrobial enzyme found in tears, saliva, and nasal secretions. It damages bacterial cell walls by catalyzing hydrolysis of peptidoglycan.',
        pdbId: '1AKI',
        category: 'Enzyme',
        atomCount: 1001,
        residueCount: 129,
        molecularWeight: '14.3 kDa',
        resolution: '1.50 Å',
        organism: 'Gallus gallus',
        classification: 'Antimicrobial',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #d946ef)',
    },
    {
        id: 'grp',
        name: 'Green Fluorescent Protein',
        description: 'A protein originally isolated from the jellyfish Aequorea victoria that fluoresces bright green when exposed to blue-to-UV light.',
        pdbId: '1EMA',
        category: 'Protein',
        atomCount: 1766,
        residueCount: 229,
        molecularWeight: '26.9 kDa',
        resolution: '1.90 Å',
        organism: 'Aequorea victoria',
        classification: 'Fluorescent Protein',
        color: '#22c55e',
        gradient: 'linear-gradient(135deg, #22c55e, #84cc16)',
    },
];

export function getMoleculeById(id: string): Molecule | undefined {
    return molecules.find((m) => m.id === id);
}

export function getMoleculeUrl(pdbId: string): string {
    return `https://files.rcsb.org/download/${pdbId}.cif`;
}
