import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'quest-1',
    title: '1. Birinchi Qadam: "Salom, C++!"',
    difficulty: 'Oson',
    xp: 50,
    description: 'C++ olamiga kirib keldingiz! Ekranga aynan "Salom, C++!" yozuvini chiqaring.',
    instructions: [
      'iostream kutubxonasi ulanganiga ishonch hosil qiling.',
      'cout << "Salom, C++!" << endl; buyrug\'idan foydalaning.',
      'Har bir qator oxirida nuqta-vergul ; qo\'yishni unutmang!'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    // Sizning kodingiz bu yerda:
    
    return 0;
}`,
    hint: 'cout << "Salom, C++!" << endl; deb yozing.',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Salom, C++!" << endl;
    return 0;
}`,
    testCases: [
      {
        expectedOutput: 'Salom, C++!',
        description: 'Ekranda "Salom, C++!" chiqishi kerak'
      }
    ]
  },
  {
    id: 'quest-2',
    title: '2. Yilni Hisoblovchi Dastur',
    difficulty: 'Oson',
    xp: 75,
    description: '2026-yil bo\'lsa, 20 yoshli inson nechanchi yilda tug\'ilganini hisoblang.',
    instructions: [
      'int joriyYil = 2026; va int yosh = 20; o\'zgaruvchilarini e\'lon qiling.',
      'tugilganYil = joriyYil - yosh formulasi bilan hisoblang.',
      'Ekranga natijani: "Tugilgan yil: [yil]" ko\'rinishida chiqaring.'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int joriyYil = 2026;
    int yosh = 20;
    
    // Tug'ilgan yilni hisoblang va chiqaring:
    
    return 0;
}`,
    hint: 'int tugilganYil = joriyYil - yosh; deb yozing va cout << "Tugilgan yil: " << tugilganYil << endl; qiling.',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int joriyYil = 2026;
    int yosh = 20;
    int tugilganYil = joriyYil - yosh;
    cout << "Tugilgan yil: " << tugilganYil << endl;
    return 0;
}`,
    testCases: [
      {
        expectedOutput: 'Tugilgan yil: 2006',
        description: '2026 - 20 = 2006 chiqishi kerak'
      }
    ]
  },
  {
    id: 'quest-3',
    title: '3. Juft yoki Toq Son Tekshiruvi',
    difficulty: 'Oson',
    xp: 100,
    description: 'Berilgan son juft yoki toqligini if-else yordamida aniqlang.',
    instructions: [
      'int son = 18; berilgan.',
      'Agar son 2 ga qoldiqsiz bo\'linsa (son % 2 == 0), ekranga "Juft son" deb chiqsin.',
      'Aks holda "Toq son" deb chiqsin.'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int son = 18;
    
    // Shartni yozing:
    
    return 0;
}`,
    hint: 'if (son % 2 == 0) { cout << "Juft son" << endl; } else { ... }',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int son = 18;
    if (son % 2 == 0) {
        cout << "Juft son" << endl;
    } else {
        cout << "Toq son" << endl;
    }
    return 0;
}`,
    testCases: [
      {
        expectedOutput: 'Juft son',
        description: '18 uchun "Juft son" chiqishi lozim'
      }
    ]
  },
  {
    id: 'quest-4',
    title: '4. Karra Jadvali (for sikli)',
    difficulty: 'O\'rtacha',
    xp: 120,
    description: 'for siklidan foydalanib 5 sonining 1 dan 5 gacha bo\'lgan karra jadvalini chiqaring.',
    instructions: [
      'for (int i = 1; i <= 5; i++) siklidan foydalaning.',
      'Har bir qatorda "5 * i = [natija]" ko\'rinishida chop eting.'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    // for siklini yozing:
    
    return 0;
}`,
    hint: 'cout << n << " * " << i << " = " << n * i << endl;',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
    for (int i = 1; i <= 5; i++) {
        cout << n << " * " << i << " = " << n * i << endl;
    }
    return 0;
}`,
    testCases: [
      {
        expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25',
        description: '5 * 1 = 5 dan 5 * 5 = 25 gacha'
      }
    ]
  },
  {
    id: 'quest-5',
    title: '5. Ko\'rsatkich (Pointer) Sehrgarligi',
    difficulty: 'Qiyin',
    xp: 150,
    description: 'Xotira manzili orqali o\'zgaruvchi qiymatini o\'zgartiring va C++ xotirasini bo\'ysundiring!',
    instructions: [
      'int x = 50; e\'lon qiling.',
      'int* ptr = &x; orqali ko\'rsatkich yarating.',
      '*ptr = 100; orqali x ning qiymatini 100 ga o\'zgartiring.',
      'Ekranga x ning yangilangan qiymatini chiqaring.'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int x = 50;
    // Pointer orqali x ni 100 ga o'zgartiring:
    
    return 0;
}`,
    hint: 'int* ptr = &x; *ptr = 100; cout << x << endl;',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int x = 50;
    int* ptr = &x;
    *ptr = 100;
    cout << x << endl;
    return 0;
}`,
    testCases: [
      {
        expectedOutput: '100',
        description: 'Xotira orqali o\'zgargan 100 qiymati chiqishi lozim'
      }
    ]
  },
  {
    id: 'quest-6',
    title: '6. Xatoni Top: "Nuqta-Vergul va Tenglik Qotili"',
    difficulty: 'Sirli',
    xp: 200,
    description: 'Quyidagi kodda 2 ta xato bor: bittasi nuqta-vergul unutgan, ikkinchisi = bilan == ni adashtirgan. Kodni tuzating!',
    instructions: [
      'Koddagi sintaksis va mantiqiy xatoliklarni toping.',
      'Dastur faqat to\'g\'ri ishlaganda "Xush kelibsiz!" deb chiqarishi kerak.'
    ],
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int parol = 1234
    
    if (parol = 1234) {
        cout << "Xush kelibsiz!" << endl;
    }
    return 0;
}`,
    hint: 'int parol = 1234 oxiriga ; qo\'ying va if shartida == ishlating.',
    solutionCode: `#include <iostream>
using namespace std;

int main() {
    int parol = 1234;
    
    if (parol == 1234) {
        cout << "Xush kelibsiz!" << endl;
    }
    return 0;
}`,
    testCases: [
      {
        expectedOutput: 'Xush kelibsiz!',
        description: 'Tuzatilgan kod "Xush kelibsiz!" deb chiqaradi'
      }
    ]
  }
];
