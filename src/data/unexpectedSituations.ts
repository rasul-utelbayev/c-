import { UnexpectedSituation } from '../types';

export const UNEXPECTED_SITUATIONS: UnexpectedSituation[] = [
  {
    id: 'segfault',
    title: 'Segmentation Fault (Core Dumped)',
    uzbekName: 'Xotiraga Noqonuniy Bostirib Kirish',
    dangerLevel: 'Dahshatli',
    icon: 'Skull',
    description: 'C++ olamidagi eng mashhur fojia. Dastur bir zumda o\'ladi va terminalda sovuq yozuv qoladi: "Segmentation fault (core dumped)".',
    symptoms: [
      'Dastur to\'satdan qarsillab to\'xtaydi',
      'Operatsion tizim dasturni majburiy o\'ldiradi (SIGSEGV)',
      'Hech qanday ogohlantirishsiz yopiladi'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int* ptr = nullptr; // Manzil yo'q (nol manzil)
    
    // XAVFLI: Mavjud bo'lmagan xotiraga qiymat yozish!
    *ptr = 999; 
    
    cout << "Bu qatorga hech qachon yetib kelmaysiz!" << endl;
    return 0;
}`,
    effectType: 'shake',
    whatHappened: 'Siz nullptr (0x00000000) manziliga murojaat qildingiz. Bu manzil operatsion tizimning muqaddas hududi hisoblanadi. RAM qo\'riqchisi sizni ushlab oldi va dasturingizni darhol qatl etdi!',
    howToFix: 'Pointer ishlatishdan oldin har doim uning nullptr emasligini tekshiring: `if (ptr != nullptr) { *ptr = 999; }` yoki unga haqiqiy manzil biriktiring.',
    funnyQuote: '"Segmentation fault — bu operatsion tizimning: \'Ey uka, birovning hovlisiga poyabzal bilan kirmang!\' deb shapaloq urishidir."'
  },
  {
    id: 'infinite-loop',
    title: 'Infinite Loop (Cheksiz Sikl)',
    uzbekName: 'Protsessorni Qizdirish va Muzlatish',
    dangerLevel: 'Apokalipsis',
    icon: 'Flame',
    description: 'Sikl to\'xtash shartini unutdingiz yoki i++ qilmadingiz. Natijada protsessor 100% quvvatda aylanadi, sovutgich parraklari vertolyotdek ovoz chiqaradi!',
    symptoms: [
      'Dastur javob bermay qotib qoladi',
      'Ventilyatorlar shovqin ko\'taradi',
      'Kompyuter batareyasi ko\'z oldingizda eriydi'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int i = 1;
    // XATO: i hech qachon oshmaydi!
    while (i > 0) {
        cout << "Meni to'xtating! Qadam: " << i << endl;
        // i++; qatorini unutib qo'ydik...
    }
    return 0;
}`,
    effectType: 'fire',
    whatHappened: 'Sikl har doim `1 > 0` (haqiqat) bo\'lgani uchun to\'xtovsiz aylanmoqda. Protsessor soniyasiga milliardlab buyruqlarni bajarib charchadi!',
    howToFix: 'Sikl ichida sanagich o\'zgaruvchisini albatta yangilang (`i++` yoki `i--`) va shart qachondir yolg\'on (false) bo\'lishini ta\'minlang.',
    funnyQuote: '"Dasturchining orzusi — cheksiz pul, lekin haqiqati — cheksiz while(true)..."'
  },
  {
    id: 'array-out-of-bounds',
    title: 'Array Index Out of Bounds',
    uzbekName: 'Axlat Qiymatlar (Garbage Values) Falokati',
    dangerLevel: 'Kulguli',
    icon: 'Trash2',
    description: 'Massivda 3 ta element bor edi, lekin siz 100-elementni so\'radingiz. C++ sizga rad javobini bermaydi, balki xotiradagi begona axlatni olib beradi!',
    symptoms: [
      'Ekranda -858993460 yoki 32767 kabi sirli sonlar chiqadi',
      'Dastur xato bermaydi, lekin g\'alati natija beradi (Silent bug)',
      'Qo\'shni o\'zgaruvchilarning qiymati o\'z-o\'zidan buziladi'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int sonlar[3] = {10, 20, 30};
    
    // Massivda faqat 0, 1, 2 indekslar bor:
    cout << "sonlar[0]: " << sonlar[0] << endl;
    cout << "sonlar[50]: " << sonlar[50] << endl; // 😱 QAYERDAN KELDI BU SON?!
    return 0;
}`,
    effectType: 'garbage',
    whatHappened: 'C++ tezlik uchun massiv chegarasini avtomatik tekshirmaydi. `sonlar[50]` deganingizda u xotirada 50 qadam oldinga o\'tib, u yerda qolib ketgan eski dasturlarning axlat baytlarini o\'qib berdi!',
    howToFix: 'Har doim indeks massiv o\'lchamidan kichik ekanini tekshiring (`indeks < o\'lcham`) yoki zamonaviy `std::vector` va `.at()` metodidan foydalaning.',
    funnyQuote: '"Python chegaradan chiqsang yig\'laydi, Java qarg\'aydi, C++ esa shunchaki kulib axlat uzatadi."'
  },
  {
    id: 'dangling-pointer',
    title: 'Dangling Pointer (Arvoh Ko\'rsatkich)',
    uzbekName: 'O\'ldirilgan Xotira Arvohi',
    dangerLevel: 'Xavfli',
    icon: 'Ghost',
    description: 'Siz xotirani o\'chirdingiz (delete), lekin ko\'rsatkich hali ham o\'sha yerga qarab turibdi. Endi u xotira sharpasini ko\'rsatmoqda!',
    symptoms: [
      'Ba\'zida ishlaydi, ba\'zida qulaydi (Undefined Behavior)',
      'Qidirib topish eng qiyin bo\'lgan xatolik',
      'Xotirada kutilmagan buzilishlar'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int* ptr = new int(42);
    cout << "Qiymat: " << *ptr << endl;
    
    delete ptr; // Xotira bo'shatildi!
    
    // LEKIN ptr hali ham o'sha manzilni ushlab turibdi!
    // cout << *ptr; // 👻 ARVOH XOTIRA!
    return 0;
}`,
    effectType: 'ghost',
    whatHappened: '`delete ptr;` xotirani operatsion tizimga qaytarib berdi. Ammo `ptr` o\'zgaruvchisining ichida hali ham eski manzil turibdi. Unga murojaat qilsangiz, tasodifiy kutilmagan holat (Undefined Behavior) yuz beradi.',
    howToFix: 'Xotirani o\'chirgan zahoti pointerni nolga tenglashtiring: `delete ptr; ptr = nullptr;`',
    funnyQuote: '"O\'chirilgan xotiraga murojaat qilish — sobiq sevgilingizga tun yarmida xat yozishdek: hech qanday yaxshilik kutmang!"'
  },
  {
    id: 'semicolon-rage',
    title: 'Semicolon Apocalypse',
    uzbekName: 'Unutilgan Nuqta-Vergul Qasosi',
    dangerLevel: 'Kulguli',
    icon: 'AlertTriangle',
    description: 'Bitta nuqta-vergulni unutdingiz. g++ kompilyatori sizga 63 ta xatolik, 12 ta ogohlantirish chiqarib, butun avlodingizni ayblaydi!',
    symptoms: [
      'Xato kutilgan qatorda emas, undan keyingi qatorda ko\'rsatiladi',
      'Kompilyator "expected ; before..." deb dod soladi',
      'Birgina qavs yoki ; butun faylni qizilga bo\'yaydi'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10 // <<-- NUQTA-VERGUL QANI?!
    int b = 20;
    cout << a + b << endl;
    return 0;
}`,
    effectType: 'compiler-rage',
    whatHappened: 'C++ kompilyatori bo\'shliq va yangi qatorlarni inobatga olmaydi. U buyruq qayerda tugaganini faqat `;` orqali biladi. Nuqta-vergul bo\'lmasa, u keyingi qatorni ham oldingisiga qo\'shib yuborib gangib qoladi.',
    howToFix: 'Har bir buyruq (declaring, assignment, function call) oxiriga bexato `;` qo\'ying.',
    funnyQuote: '"C++ kompilyatori nuqta-vergulsiz bir qadam ham bosmaydigan dunyodagi eng qaysar inspektordir."'
  },
  {
    id: 'assignment-in-condition',
    title: 'The Silent Saboteur: = vs ==',
    uzbekName: 'Sokin Buzg\'unchi: O\'zlashtirish va Solishtirish',
    dangerLevel: 'Xavfli',
    icon: 'Bug',
    description: 'if (x = 5) deb yozdingiz. Dastur hech qanday xatosiz ishlayveradi, lekin shart DOIM to\'g\'ri (true) bo\'lib, sizni aqldan ozdiradi!',
    symptoms: [
      'Hech qanday kompilyatsiya xatosi yo\'q',
      'if bloki shartga qaramay har doim ishlayveradi',
      'Dasturchi 3 soat monitorga termulib o\'tiradi'
    ],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    int adminParol = 999;
    int kiritilganParol = 111; // Noto'g'ri parol!
    
    // XATO: == o'rniga = qo'yildi!
    if (kiritilganParol = adminParol) {
        cout << "Xush kelibsiz, Admin! (Tizim buzildi!)" << endl;
    }
    return 0;
}`,
    effectType: 'garbage',
    whatHappened: '`kiritilganParol = adminParol` ifodasi taqqoslamaydi, balki `adminParol` (999) ni unga nusxalaydi. Natija 999 (nol bo\'lmagan son) bo\'lgani uchun, C++ buni `true` deb hisoblaydi va tizimga kirishga ruxsat beradi!',
    howToFix: 'Doimo ikkita tenglik `==` ishlating. Tajribali dasturchilar "Yoda sharti" usulidan foydalanadilar: `if (999 == kiritilganParol)` — agar bu yerda bitta = qo\'ysangiz, kompilyator xato beradi!',
    funnyQuote: '"Bitta tenglik belgisi sizni yaxshi dasturchi qiladi, ikkitasi esa sizni ishdan haydalishdan saqlab qoladi."'
  }
];
