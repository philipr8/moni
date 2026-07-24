export const COURSES = [
  {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    chapters: [
      'Cell Biology & Organelles',
      'Molecular Biology & Genetics',
      'DNA Replication & Repair',
      'Transcription & Translation',
      'Cell Division & Cancer',
      'Microbiology',
      'Eukaryotic Cell Cycle',
      'Evolution & Natural Selection',
      'Embryology & Development',
      'Anatomy & Physiology Overview',
      'Respiratory System',
      'Cardiovascular System',
    ],
  },
  {
    id: 'psychology',
    name: 'Psychology & Sociology',
    icon: '🧠',
    color: '#7c3aed',
    bgColor: '#faf5ff',
    chapters: [
      'Sensation & Perception',
      'Learning & Conditioning',
      'Memory',
      'Cognition & Language',
      'Motivation & Emotion',
      'Psychological Disorders',
      'Treatment of Psychological Disorders',
      'Social Psychology',
      'Socialization & Culture',
      'Social Stratification',
      'Research Methods',
      'Demographics & Epidemiology',
    ],
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    icon: '⚗️',
    color: '#1d4ed8',
    bgColor: '#eff6ff',
    chapters: [
      'Chapter 1: Amino Acids, Peptides, and Proteins',
      'Chapter 2: Enzymes',
      'Chapter 3: Nonenzymatic Protein Function and Protein Analysis',
      'Chapter 4: Carbohydrate Structure and Function',
      'Chapter 5: Lipid Structure and Function',
      'Chapter 6: DNA and Biotechnology',
      'Chapter 7: RNA and the Genetic Code',
      'Chapter 8: Biological Membranes',
      'Chapter 9: Carbohydrate Metabolism I: Glycolysis, Glycogen, Gluconeogenesis, and the Pentose Phosphate Pathway',
      'Chapter 10: Carbohydrate Metabolism II: Aerobic Respiration',
      'Chapter 11: Lipid and Amino Acid Metabolism',
      'Chapter 12: Bioenergetics and Regulation of Metabolism',
    ],
  },
  {
    id: 'organicChem',
    name: 'Organic Chemistry',
    icon: '🔬',
    color: '#c2410c',
    bgColor: '#fff7ed',
    chapters: [
      'Nomenclature & Structure',
      'Stereochemistry',
      'Substitution & Elimination',
      'Alkenes & Alkynes',
      'Aromatic Compounds',
      'Carbonyl Chemistry',
      'Carboxylic Acids & Derivatives',
      'Amines & Nitrogen Compounds',
      'Spectroscopy (NMR, IR, MS)',
      'Separations & Purification',
      'Biological Molecules in OC',
      'Lab Techniques',
    ],
  },
  {
    id: 'generalChem',
    name: 'General Chemistry',
    icon: '🧪',
    color: '#b45309',
    bgColor: '#fffbeb',
    chapters: [
      'Chapter 1: Atomic Structure',
      'Chapter 2: The Periodic Table',
      'Chapter 3: Bonding and Chemical Interactions',
      'Chapter 4: Compounds and Stoichiometry',
      'Chapter 5: Chemical Kinetics',
      'Chapter 6: Equilibrium',
      'Chapter 7: Thermochemistry',
      'Chapter 8: The Gas Phase',
      'Chapter 9: Solutions',
      'Chapter 10: Acids and Bases',
      'Chapter 11: Oxidation-Reduction Reactions',
      'Chapter 12: Electrochemistry',
    ],
  },
  {
    id: 'physicsMath',
    name: 'Physics & Math',
    icon: '📐',
    color: '#dc2626',
    bgColor: '#fff1f2',
    chapters: [
      'Kinematics',
      'Forces & Newton\'s Laws',
      'Work, Energy & Power',
      'Momentum & Collisions',
      'Rotational Motion',
      'Fluids & Pressure',
      'Waves & Sound',
      'Electricity & Circuits',
      'Magnetism',
      'Optics & Light',
      'Atomic & Nuclear Physics',
      'Math Review',
    ],
  },
];

export const STAGE_CONFIG = {
  'not-started': { label: 'Not Started', short: 'NS', color: '#9ca3af', bg: '#f9fafb', ring: '#e5e7eb' },
  'in-progress': { label: 'In Progress', short: 'IP', color: '#f59e0b', bg: '#fffbeb', ring: '#fde68a' },
  'reviewed': { label: 'Reviewed', short: 'RV', color: '#3b82f6', bg: '#eff6ff', ring: '#bfdbfe' },
  'mastered': { label: 'Mastered', short: 'MA', color: '#16a34a', bg: '#f0fdf4', ring: '#bbf7d0' },
};

export const STAGE_ORDER = ['not-started', 'in-progress', 'reviewed', 'mastered'];

// Flattens a course's chapters into the trackable leaf list — plain-string
// chapters pass through as-is, and { title, subs } groups expand to their subs
// (the group title itself is a non-trackable section divider, not a leaf).
export function getLeafChapters(course) {
  const leaves = [];
  course.chapters.forEach(item => {
    if (typeof item === 'string') leaves.push(item);
    else if (item.subs?.length) leaves.push(...item.subs);
    else leaves.push(item.title);
  });
  return leaves;
}
