export type ViewMode = 
  | 'lessons' 
  | 'simulator' 
  | 'memory' 
  | 'chaos' 
  | 'challenges' 
  | 'jokes' 
  | 'cheatsheet';

export interface Lesson {
  id: string;
  title: string;
  badge: string;
  duration: string;
  description: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      text: string;
      codeExample?: string;
      explanation?: string;
      analogy?: string; // Hayotiy o'xshatish
      warning?: string; // Kutilmagan tuzoq
    }[];
    humorTip?: string;
    practiceCode: string;
    quiz: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
}

export interface MemoryCell {
  address: string;
  name: string;
  type: 'int' | 'double' | 'string' | 'char' | 'bool' | 'pointer';
  value: any;
  pointsTo?: string; // If pointer, which address it points to
  bytes: number;
}

export interface ExecutionResult {
  output: string;
  errors: string[];
  stepsCount: number;
  memory: MemoryCell[];
  isInfiniteLoop?: boolean;
  isSegFault?: boolean;
  exitCode: number;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Oson' | 'O\'rtacha' | 'Qiyin' | 'Sirli';
  xp: number;
  description: string;
  instructions: string[];
  starterCode: string;
  hint: string;
  solutionCode: string;
  testCases: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
}

export interface UnexpectedSituation {
  id: string;
  title: string;
  uzbekName: string;
  dangerLevel: 'Xavfli' | 'Dahshatli' | 'Kulguli' | 'Apokalipsis';
  icon: string;
  description: string;
  symptoms: string[];
  sampleCode: string;
  effectType: 'shake' | 'fire' | 'ghost' | 'garbage' | 'compiler-rage';
  whatHappened: string;
  howToFix: string;
  funnyQuote: string;
}

export interface ProgrammerJoke {
  id: string;
  category: 'Xotira' | 'Sintaksis' | 'C++ vs Boshqalar' | 'Hayotiy';
  setup: string;
  punchline: string;
  authorOrContext?: string;
  likes: number;
}

export interface UserStats {
  xp: number;
  level: string;
  completedLessons: string[];
  solvedChallenges: string[];
  unlockedChaos: string[];
  soundEnabled: boolean;
}
