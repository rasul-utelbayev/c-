import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-0',
    title: '0-Dars: C++ ga Xush Kelibsiz!',
    badge: 'Boshlang\'ich',
    duration: '10 daqiqa',
    description: 'C++ nima, nega u dunyodagi eng tezkor til va birinchi "Salom, Dunyo!" dasturingizning anatomiyasi.',
    content: {
      intro: 'C++ — 1979-yilda daniyalik olim Bjarne Stroustrup tomonidan yaratilgan afsonaviy dasturlash tili. O\'yin dvigatellari (Unreal Engine), operatsion tizimlar (Windows, Linux yadrosi), brauzerlar (Chrome) va hatto kosmik kemalar C++ da yozilgan!',
      sections: [
        {
          heading: '1. C++ Dasturining Skeleti',
          text: 'Har bir C++ dasturi ma\'lum bir tartibda yoziladi. Quyidagi kod har bir C++ dasturchisining birinchi qadamidir:',
          codeExample: `#include <iostream>
using namespace std;

int main() {
    cout << "Salom, Dunyo!" << endl;
    return 0;
}`,
          explanation: 'Keling, har bir qatorni parchalab o\'rganamiz:',
          analogy: '#include <iostream> — bu oshxonaga borib "menga pichoq va qoshiqlar qutisini ber" degandek. cout (ekranga chiqarish) aynan shu iostream kutubxonasida yashaydi.',
        },
        {
          heading: '2. Nuqta-Vergul (;) — Dasturchi Qasami',
          text: 'C++ da har bir buyruq (statement) oxirida majburiy ravishda nuqta-vergul qo\'yilishi shart. Agar uni unutsangiz, kompilyator shunday baqiradi-ki, butun dastur to\'xtaydi.',
          warning: '⚠️ Agar bitta nuqta-vergulni unutib qoldirsangiz, g++ kompilyatori 40 ta qatordan xato chiqarib, sizni yig\'latishi mumkin!',
        },
        {
          heading: '3. main() Funksiyasi',
          text: 'Operatsion tizim dasturingizni ishga tushirganda, u birinchi bo\'lib aynan "main()" funksiyasini qidiradi. U sizning dasturingizning bosh darvozasi!',
          codeExample: `int main() {
    cout << "Men C++ ni 0 dan o'rganyapman!" << endl;
    return 0;
}`,
          explanation: 'return 0; — bu operatsion tizimga: "Hammasi yaxshi o\'tdi, hech kim o\'lmadi, dastur muvaffaqiyatli tugadi" deb hisobot berishdir.',
        }
      ],
      humorTip: 'Dasturchi maqoli: "C++ da kod yozish — bu qurol bilan ehtiyot bo\'lib nishonga olishdek. Bir xato qilsangiz, oyog\'ingizga emas, butun kompyuter xotirasiga o\'q uzasiz!" 😂',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Salom, O'zbekiston!" << endl;
    cout << "C++ tezligi: 100%" << endl;
    return 0;
}`,
      quiz: {
        question: 'C++ da ekranga matn chiqarish uchun qaysi oqim (stream) ishlatiladi?',
        options: [
          'cin >>',
          'cout <<',
          'print()',
          'System.out.println'
        ],
        correctIndex: 1,
        explanation: 'cout (Character Output) operatori << strelkalari bilan birga ekranga ma\'lumot chiqarish uchun xizmat qiladi!'
      }
    }
  },
  {
    id: 'lesson-1',
    title: '1-Dars: O\'zgaruvchilar va Ma\'lumot Turlari',
    badge: 'Xotira Qutilari',
    duration: '15 daqiqa',
    description: 'Kompyuter xotirasida sonlar, matnlar va belgilarni qanday saqlaymiz? int, double, char, string va cin.',
    content: {
      intro: 'O\'zgaruvchi — bu kompyuterning operativ xotirasida (RAM) siz uchun ajratilgan maxsus quticha. Har bir qutichaning o\'z turi va hajmi bor!',
      sections: [
        {
          heading: '1. Asosiy Ma\'lumot Turlari',
          text: 'C++ da xotirani tejash juda muhim. Shuning uchun turli ma\'lumotlar uchun har xil qutilar bor:',
          codeExample: `int yosh = 22;             // Butun son (4 bayt)
double narx = 15.99;       // O'nlik kasr son (8 bayt)
char baho = 'A';           // Bitta belgi (1 bayt, bittalik qo'shtirnoq!)
string ism = "Jahongir";   // Matn (ikkitalik qo'shtirnoq)
bool talabami = true;      // true (1) yoki false (0)`,
          analogy: 'Tasavvur qiling, "char" bu kichik gugurt qutisi, "int" — poyafzal qutisi, "double" — katta chamadon. Katta narsani kichik qutiga tiqishga urinmang!',
        },
        {
          heading: '2. Foydalanuvchidan Ma\'lumot Olish: cin >>',
          text: 'Agar dasturimiz jonli bo\'lishini istasak, foydalanuvchidan klaviatura orqali qiymat kiritishini so\'raymiz:',
          codeExample: `int son;
cout << "Ixtiyoriy son kiriting: ";
cin >> son;
cout << "Siz kiritgan sonning 2 barobari: " << son * 2 << endl;`,
          warning: 'Diqqat qiling: cout da strelka chapga (<<) chiqadi, cin da esa o\'ngga (>>) o\'zgaruvchiga kiradi!',
        }
      ],
      humorTip: 'C++ da `int a = "Salom";` deb yozsangiz, kompilyator: "Brat, butun son qutisiga gap tiqishga uyalmaysizmi?" deydi.',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    int olma = 5;
    int anor = 7;
    int jami = olma + anor;
    cout << "Olma: " << olma << " ta" << endl;
    cout << "Anor: " << anor << " ta" << endl;
    cout << "Jami mevalar: " << jami << " ta" << endl;
    return 0;
}`,
      quiz: {
        question: 'C++ da bitta belgini (masalan, \'Z\') saqlash uchun qaysi turdan foydalanamiz?',
        options: [
          'string',
          'int',
          'char',
          'bool'
        ],
        correctIndex: 2,
        explanation: 'char turi 1 bayt xotira egallaydi va yagona belgini bittalik qo\'shtirnoq (\'A\') ichida saqlaydi!'
      }
    }
  },
  {
    id: 'lesson-2',
    title: '2-Dars: Shart Operatorlari (if, else if, else)',
    badge: 'Mantiqiy Tanlov',
    duration: '15 daqiqa',
    description: 'Dasturimiz o\'ylashni va qaror qabul qilishni o\'rganadi. Eng mashhur dasturchi tuzog\'i: = va == farqi!',
    content: {
      intro: 'Dasturlash — bu shartlar va tanlovlar san\'ati. "Agar yomg\'ir yog\'sa — soyabon ol, aks holda — ko\'zoynak taq".',
      sections: [
        {
          heading: '1. if va else Tuzilishi',
          text: 'Shart to\'g\'ri (true) bo\'lsa bitta kod bloki, noto\'g\'ri bo\'lsa boshqasi ishlaydi:',
          codeExample: `int yosh = 20;

if (yosh >= 18) {
    cout << "Hujjat topshirishingiz mumkin! Haydovchilik guvohnomasi beriladi." << endl;
} else {
    cout << "Hali erta, velosipedda yuring!" << endl;
}`,
        },
        {
          heading: '2. C++ ning 1-Raqamli Tuzog\'i: = va ==',
          text: 'Dunyoda minglab dasturchilar tunlari uxlamay shu xatoni qidirishadi:',
          codeExample: `int x = 5;
// XATO: if (x = 10)  -> Bu x ga 10 qiymatini berib qo'yadi va doim true bo'ladi!
// TO'G'RI:
if (x == 10) {
    cout << "x haqiqatan ham 10 ga teng" << endl;
}`,
          warning: '⚠️ "=" — bu qiymat berish (o\'zlashtirish). "==" — bu solishtirish (tengmi?)!',
        }
      ],
      humorTip: 'Xotini dasturchi eriga: "Do\'konga bor, non ol. Agar tuxum bo\'lsa, 10 ta ol". Dasturchi 10 ta non olib keldi. Chunki tuxum bor edi!',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    int ball = 85;

    if (ball >= 90) {
        cout << "Baho: A'lo (5)" << endl;
    } else if (ball >= 70) {
        cout << "Baho: Yaxshi (4)" << endl;
    } else {
        cout << "Baho: Yana o'qish kerak!" << endl;
    }
    return 0;
}`,
      quiz: {
        question: 'C++ da ikkita o\'zgaruvchi tengligini tekshirish uchun qaysi belgi ishlatiladi?',
        options: [
          '=',
          '==',
          ':=',
          'equals()'
        ],
        correctIndex: 1,
        explanation: 'Solishtirish uchun ikki marta tenglik "==" belgisi qo\'yiladi. Bitta "=" esa qiymatni o\'zlashtiradi.'
      }
    }
  },
  {
    id: 'lesson-3',
    title: '3-Dars: Sikllar (for va while)',
    badge: 'Takrorlash Qudrati',
    duration: '20 daqiqa',
    description: 'Bir xil ishni 1000 marta yozmasdan, 3 qatorda bajarish siri. Cheksiz sikl xavfi!',
    content: {
      intro: 'Agar sizdan "Salom" so\'zini 100 marta ekranga chiqarishni so\'rashsa, 100 marta cout yozmaysiz. Buning uchun for va while sikllari mavjud!',
      sections: [
        {
          heading: '1. for Siklining 3 Ta Qadami',
          text: 'for sikli sanash uchun eng qulay vositadir:',
          codeExample: `// 1 dan 5 gacha sanash:
for (int i = 1; i <= 5; i++) {
    cout << "Qadam raqami: " << i << endl;
}`,
          explanation: '1. int i = 1 (boshlanish); 2. i <= 5 (shart); 3. i++ (har qadamda bittaga oshirish).',
        },
        {
          heading: '2. Cheksiz Sikl — Kompyuterni Qizdirish Sanoati!',
          text: 'Agar siz shartni to\'xtamaydigan qilib qo\'ysangiz, kompyuter to\'xtovsiz aylanadi:',
          codeExample: `// XAVFLI:
// while (true) {
//     cout << "Meni to'xtating!" << endl;
// }`,
          warning: '⚠️ Cheksiz sikl yozsangiz, protsessor 100% yuklanadi, sovutgich parraklari vertolyotdek aylanadi!',
        }
      ],
      humorTip: 'Junior dasturchining kuni: uyg\'onish -> kod yozish -> xatoni topolmaslik -> uxlash -> while(true)...',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    int yigindi = 0;
    for (int i = 1; i <= 5; i++) {
        yigindi = yigindi + i;
        cout << i << " qo'shildi, hozirgi yig'indi: " << yigindi << endl;
    }
    cout << "Jami yig'indi: " << yigindi << endl;
    return 0;
}`,
      quiz: {
        question: 'for (int i = 0; i < 5; i++) sikli necha marta aylanadi?',
        options: [
          '4 marta',
          '5 marta',
          '6 marta',
          'Cheksiz'
        ],
        correctIndex: 1,
        explanation: '0, 1, 2, 3, 4 — jami aniq 5 marta aylanadi!'
      }
    }
  },
  {
    id: 'lesson-4',
    title: '4-Dars: Massivlar (Arrays)',
    badge: 'Ketma-ket Xotira',
    duration: '20 daqiqa',
    description: 'Bir xil turdagi yuzlab ma\'lumotlarni bitta nom ostida saqlash. Nega dasturchilar sanashni 0 dan boshlaydi?',
    content: {
      intro: 'Tasavvur qiling, sizda 30 ta o\'quvchining baholari bor. 30 ta alohida o\'zgaruvchi ochish o\'rniga bitta "baho[30]" massivini ochamiz!',
      sections: [
        {
          heading: '1. Nega Sanash 0 dan Boshlanadi?',
          text: 'C++ da indeks — bu massiv boshidan qancha masofaga siljish (offset) degani. Birinchi element aynan massivning boshida turgani uchun uning siljishi 0 ga teng!',
          codeExample: `int baholar[4] = {85, 92, 78, 95};

cout << "Birinchi baho: " << baholar[0] << endl; // 85
cout << "Oxirgi baho: " << baholar[3] << endl;   // 95`,
          analogy: 'Mehmonxonadagi xona raqamlari kabi: 0-xona, 1-xona, 2-xona...',
        },
        {
          heading: '2. Massiv Chegarasidan Chiqish (Buffer Overflow)',
          text: 'Agar 4 ta xonali massivdan 10-elementni so\'rasangiz nima bo\'ladi?',
          codeExample: `int arr[4] = {1, 2, 3, 4};
cout << arr[10]; // 😱 Kutilmagan son: -858993460 yoki axlat qiymat!`,
          warning: '⚠️ C++ boshqa tillarga o\'xshab "indeks chegaradan chiqdi" deb jilmaymaydi. U shunchaki xotiraning boshqa joyidagi begonaning axlatini o\'qib beraveradi!',
        }
      ],
      humorTip: 'Dunyoda 10 xil odam bor: sanashni 0 dan boshlaydigan dasturchilar va oddiy insonlar.',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    int sonlar[5] = {10, 25, 4, 99, 32};
    int engKatta = sonlar[0];

    for (int i = 1; i < 5; i++) {
        if (sonlar[i] > engKatta) {
            engKatta = sonlar[i];
        }
    }
    cout << "Massivdagi eng katta son: " << engKatta << endl;
    return 0;
}`,
      quiz: {
        question: 'int a[5] deb e\'lon qilingan massivning eng oxirgi elementining indeksi necha?',
        options: [
          '5',
          '4',
          '0',
          '6'
        ],
        correctIndex: 1,
        explanation: '0 dan boshlangani uchun 5 ta elementli massivning oxirgi indeksi 4 bo\'ladi!'
      }
    }
  },
  {
    id: 'lesson-5',
    title: '5-Dars: Ko\'rsatkichlar (Pointers) va Xotira',
    badge: 'C++ ning Yuragi',
    duration: '25 daqiqa',
    description: 'Ko\'pchilik qo\'rqadigan mavzu! Pointer nima, & va * belgilarining sehri, xotira manzillari (Hex).',
    content: {
      intro: 'Ko\'rsatkichlar (Pointers) — C++ tilining eng kuchli va ayni paytda eng mashhur qismi. Agar pointerni tushunsangiz, siz haqiqiy C++ ustasisiz!',
      sections: [
        {
          heading: '1. Manzil nima? (& operatori)',
          text: 'Kompyuterning RAM xotirasi millionlab xonachalardan iborat. Har bir o\'zgaruvchi o\'zining unikal manziliga (Hex formatda, masalan 0x7ffd10) ega:',
          codeExample: `int a = 42;
cout << "a ning qiymati: " << a << endl;
cout << "a ning xotiradagi manzili: " << &a << endl;`,
          analogy: 'Siz do\'stingizga sovg\'a bermoqchisiz: yo sovg\'ani qo\'liga berasiz (qiymat), yoki sovg\'a yashiringan sandiqning manzilini aytasiz (& manzil)!',
        },
        {
          heading: '2. Ko\'rsatkich (Pointer) nima? (* operatori)',
          text: 'Pointer — bu qiymat emas, aynan boshqa o\'zgaruvchining manzilini saqlaydigan maxsus o\'zgaruvchidir:',
          codeExample: `int son = 100;
int* ptr = &son; // ptr endi "son" ning manzilini ko'rsatmoqda!

cout << "Pointerdagi manzil: " << ptr << endl;
cout << "Pointer orqali o'qilgan qiymat: " << *ptr << endl;

*ptr = 500; // Sehr! "son" o'zgaruvchisi ham 500 ga o'zgardi!
cout << "Yangi son qiymati: " << son << endl;`,
        },
        {
          heading: '3. Dahshatli "Segmentation Fault"',
          text: 'Agar pointer mavjud bo\'lmagan manzilni ko\'rsatsa (nullptr) va siz undan qiymat o\'qimoqchi bo\'lsangiz:',
          codeExample: `int* xato = nullptr;
// *xato = 10; // 💥 BOOOM! Segmentation fault (core dumped)!`,
          warning: '⚠️ Bo\'sh manzilga tegish xavflidir. Bu xuddi yo\'q uyga borib eshikni sindirishga urinishdek!',
        }
      ],
      humorTip: 'C++ dasturchidan soat nechi deb so\'rashdi. U esa soat nechi ekanini aytmay, ko\'chadagi soat minorasiga barmog\'i bilan ko\'rsatdi. Chunki u pointer edi! ⏱️👉',
      practiceCode: `#include <iostream>
using namespace std;

int main() {
    int xazina = 777;
    int* xarita = &xazina;

    cout << "Xazinaning o'zi: " << xazina << endl;
    cout << "Xarita ko'rsatayotgan manzil: " << xarita << endl;
    cout << "Xarita orqali xazinani olish: " << *xarita << endl;

    *xarita = 999;
    cout << "Xazina yangilandi: " << xazina << endl;
    return 0;
}`,
      quiz: {
        question: 'int* p = &x; bo\'lsa, *p nimani bildiradi?',
        options: [
          'x ning xotiradagi manzilini',
          'x ning ichidagi haqiqiy qiymatni',
          'p ni ko\'paytirish amalini',
          'Yangi o\'zgaruvchi nomini'
        ],
        correctIndex: 1,
        explanation: '*p (dereference) orqali biz pointer ko\'rsatayotgan xotira kamerasining ichidagi qiymatga kiramiz!'
      }
    }
  },
  {
    id: 'lesson-6',
    title: '6-Dars: Funksiyalar va OOPga Kirish',
    badge: 'Professional C++',
    duration: '25 daqiqa',
    description: 'Kodni qayta ishlatish, parametrlar, qiymat va havola (reference) orqali uzatish hamda struct/class asoslari.',
    content: {
      intro: 'Dasturimiz kattalashgan sari hamma narsani main() ichiga tiqib bo\'lmaydi. Kodni kichik, tushunarli bo\'laklarga (funksiyalarga) bo\'lamiz!',
      sections: [
        {
          heading: '1. Funksiya Qanday Yoziladi?',
          text: 'Funksiya kirish parametrlarini oladi, ishlaydi va natija qaytaradi:',
          codeExample: `int kvadrat(int x) {
    return x * x;
}

int main() {
    int javob = kvadrat(7);
    cout << "7 ning kvadrati: " << javob << endl;
    return 0;
}`,
        },
        {
          heading: '2. Havola orqali uzatish (Pass by Reference &)',
          text: 'Oddiy uzatishda qiymat nusxalanadi. Agar & ishlatsak, haqiqiy o\'zgaruvchining o\'zi o\'zgaradi!',
          codeExample: `void almashtir(int &a, int &b) {
    int vaqtinchalik = a;
    a = b;
    b = vaqtinchalik;
}`,
        },
        {
          heading: '3. struct — O\'z Turlaringizni Yarating',
          text: 'Talaba haqidagi barcha ma\'lumotlarni bitta ob\'ektga birlashtirish:',
          codeExample: `struct Talaba {
    string ism;
    int yosh;
    double ortachaBall;
};`,
        }
      ],
      humorTip: 'Katta C++ dasturchisi: "Men dasturimdagi har bir xotira baytini ism-familiyasi bilan taniyman!"',
      practiceCode: `#include <iostream>
using namespace std;

int yigindi(int a, int b) {
    return a + b;
}

int main() {
    int x = 15;
    int y = 25;
    int natija = yigindi(x, y);
    cout << x << " + " << y << " = " << natija << endl;
    return 0;
}`,
      quiz: {
        question: 'Hech qanday natija qaytarmaydigan funksiya qaysi kalit so\'z bilan e\'lon qilinadi?',
        options: [
          'null',
          'void',
          'empty',
          'none'
        ],
        correctIndex: 1,
        explanation: 'void turi funksiya hech qanday qiymat qaytarmasligini (faqat harakat bajarishini) bildiradi!'
      }
    }
  }
];
