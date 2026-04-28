import {
  CuratedUserKey,
  CuratedSquareKey,
  CuratedServiceKey,
  CuratedEventKey,
  type SquareReviewSeed,
  type ServiceReviewSeed,
  type EventReviewSeed,
} from '../types';

export const SQUARE_REVIEWS: SquareReviewSeed[] = [
  { userKey: CuratedUserKey.PARTICIPANT_1, squareKey: CuratedSquareKey.TASHKENT_CITY_HALL, rating: 5, comment: 'Shahar markazidagi ajoyib maydon, barcha jihozlar mukammal ishlaydi.' },
  { userKey: CuratedUserKey.PARTICIPANT_2, squareKey: CuratedSquareKey.TASHKENT_CITY_HALL, rating: 4, comment: 'Yaxshi joy, xodimlar professional. Avtomobil turar joyi bilan kichik muammolar bor.' },
  { userKey: CuratedUserKey.PARTICIPANT_3, squareKey: CuratedSquareKey.SAMARKAND_GARDEN,   rating: 5, comment: "Samarqandning unutilmas muhiti. Eng yaxshi ochiq maydon." },
  { userKey: CuratedUserKey.PARTICIPANT_4, squareKey: CuratedSquareKey.BUKHARA_CONFERENCE,  rating: 4, comment: 'Qulay konferens-zal, akustika yaxshi va Wi-Fi barqaror ishlaydi.' },
  { userKey: CuratedUserKey.PARTICIPANT_5, squareKey: CuratedSquareKey.NAVOI_PALACE,        rating: 5, comment: 'Saroy — bu haqiqatan ham ajoyib joy. Mehmonlar hayratda qoldi.' },
  { userKey: CuratedUserKey.PARTICIPANT_1, squareKey: CuratedSquareKey.ANDIJAN_EXPO,        rating: 4, comment: "Keng ko'rgazma markazi, logistika qulay tashkil etilgan." },
  { userKey: CuratedUserKey.PARTICIPANT_2, squareKey: CuratedSquareKey.SAMARKAND_GARDEN,   rating: 4, comment: "Registonga chiroyli ko'rinish, lekin kechqurun biroz sovuq." },
  { userKey: CuratedUserKey.PARTICIPANT_5, squareKey: CuratedSquareKey.TASHKENT_CITY_HALL, rating: 5, comment: "Zal kutilganidan ham yaxshi chiqdi. Ovoz va yorug'lik eng yuqori darajada." },
  { userKey: CuratedUserKey.PARTICIPANT_1, squareKey: CuratedSquareKey.BUKHARA_CONFERENCE,  rating: 5, comment: 'Buxoroning kamtar muhiti konferensiyamiz uchun juda mos keldi.' },
  { userKey: CuratedUserKey.PARTICIPANT_3, squareKey: CuratedSquareKey.NAVOI_PALACE,        rating: 4, comment: 'Hashamatli zal, lekin narxi qimmat. Maxsus tadbir uchun arziydi.' },
];

export const SERVICE_REVIEWS: ServiceReviewSeed[] = [
  { userKey: CuratedUserKey.PARTICIPANT_1, serviceKey: CuratedServiceKey.PREMIUM_CATERING,   rating: 5, comment: 'Katering eng yuqori darajada! Taomlar juda mazali edi.' },
  { userKey: CuratedUserKey.PARTICIPANT_2, serviceKey: CuratedServiceKey.ELITE_SOUND,         rating: 4, comment: 'Ovoz jihozlari ajoyib, texnik doimo yonimizda edi.' },
  { userKey: CuratedUserKey.PARTICIPANT_3, serviceKey: CuratedServiceKey.CAPTURE_PHOTO,       rating: 5, comment: 'Fotograflar sezdirmay ishlashdi, natija esa kutilganidan ham yaxshi.' },
  { userKey: CuratedUserKey.PARTICIPANT_4, serviceKey: CuratedServiceKey.ELEGANT_DECOR,       rating: 5, comment: "Dekor zamonaviy va nafis edi, konsepsiyamizga to'liq mos keldi." },
  { userKey: CuratedUserKey.PARTICIPANT_5, serviceKey: CuratedServiceKey.SECURE_GUARD,        rating: 3, comment: "Qo'riqchilar professional ko'rinardi, lekin sekin javob berishdi." },
  { userKey: CuratedUserKey.PARTICIPANT_1, serviceKey: CuratedServiceKey.SAMARKAND_CATERING,  rating: 5, comment: "Somsa va palov juda mazali bo'ldi. Mehmonlar sifatdan hayratda qoldi!" },
  { userKey: CuratedUserKey.PARTICIPANT_2, serviceKey: CuratedServiceKey.PREMIUM_CATERING,   rating: 5, comment: "Banket benuqson o'tdi. Menyu xilma-xil, taqdimot restoran darajasida." },
  { userKey: CuratedUserKey.PARTICIPANT_4, serviceKey: CuratedServiceKey.CAPTURE_PHOTO,       rating: 4, comment: 'Suratlar jonli chiqdi. Dron suratga olish alohida plyus!' },
  { userKey: CuratedUserKey.PARTICIPANT_3, serviceKey: CuratedServiceKey.ELEGANT_DECOR,       rating: 5, comment: "Gul arklar — aynan biz xohlagandek bo'ldi. Jamoaga rahmat!" },
  { userKey: CuratedUserKey.PARTICIPANT_5, serviceKey: CuratedServiceKey.ELITE_SOUND,         rating: 5, comment: "Zal to'liq to'lganda ham ovoz toza va aniq eshitildi." },
];

export const EVENT_REVIEWS: EventReviewSeed[] = [
  { userKey: CuratedUserKey.PARTICIPANT_1, eventKey: CuratedEventKey.MARKETING_FORUM, rating: 5, comment: 'Eng yaxshi marketing konferensiyasi. Spikerlar top darajada.' },
  { userKey: CuratedUserKey.PARTICIPANT_2, eventKey: CuratedEventKey.MARKETING_FORUM, rating: 4, comment: "Juda ma'lumotli, foydali aloqalar. Yana qatnashaman." },
  { userKey: CuratedUserKey.PARTICIPANT_3, eventKey: CuratedEventKey.TECH_MEETUP,     rating: 5, comment: "Mitap a'lo darajada tashkil etilgan: pitch-sessiyalar jonli o'tdi." },
  { userKey: CuratedUserKey.PARTICIPANT_4, eventKey: CuratedEventKey.JAZZ_FESTIVAL,   rating: 5, comment: 'Unutilmas festival! Uch kunlik jaz, food-zona va art.' },
  { userKey: CuratedUserKey.PARTICIPANT_5, eventKey: CuratedEventKey.UX_WORKSHOP,     rating: 4, comment: "Vorkshop amaliy ko'nikmalar berdi. Keyslar dolzarb." },
  { userKey: CuratedUserKey.PARTICIPANT_3, eventKey: CuratedEventKey.SILK_ROAD_EXHIBITION, rating: 5, comment: "Ko'rgazma ta'sirli — turli mamlakatlardan rassomlar asarlari." },
  { userKey: CuratedUserKey.PARTICIPANT_5, eventKey: CuratedEventKey.MARKETING_FORUM, rating: 5, comment: 'Networking sessiyasi butun bilet narxiga arzidi! Ikkita mijoz topdim.' },
  { userKey: CuratedUserKey.PARTICIPANT_4, eventKey: CuratedEventKey.TECH_MEETUP,     rating: 4, comment: "Pitch-sessiyalar foydali, lekin Q&A uchun ko'proq vaqt kerak edi." },
];
