// components/pages.js

export const pages = [
  {
    type: "info",
    icon: "info-icon1",
    text: `Привіт, друже!\n\n Ми з командою створюємо інноваційну платформу для пошуку \\gпідробіткуg\\!`,
    buttonText: "І що?",
  },
  {
    type: "info",
    icon: "info-icon2",
    text: `\\gНаша метаg\\ - зробити цей процес якомога простіше та ефективніше як для тих, хто шукає \\gпідробітокg\\, так і для тих, хто його надає`,
    buttonText: "І при чому тут я?",
  },
  {
    type: "choice",
    question:
      "Зараз ми цікавимося які саме \\gпотребиg\\ є в роботодавців\nДопоможи нам та пройди невеличке опитування",
    name: "c1",
    options: ["Поїхали!", "Не сьогодні"],
    icon: "choice-icon1",
  },
  {
    type: "quiz",
    question: "Перед початком, обери варіант, який найкраще характеризує тебе",
    typeInput: "radio",
    options: [
      "Підприємець",
      "Працюю в компанії, але наймаю співробіників",
      "Фрілансер/працюю на себе",
      "Інша відповідь:  _____________",
    ],
    name: "q1",
    icon: "quiz-icon1",
    buttonText: "Далі",
  },
  {
    type: "quiz",
    question: "Який розмір твого підприємства?",
    typeInput: "radio",
    options: [
      "Мале (до 50 робітників)",
      "Середнє (до 250 робітників)",
      "Велике (більше 250 робітників)",
    ],
    name: "q2",
    icon: "quiz-icon2",
    buttonText: "Далі",
  },
  {
    type: "quiz",
    question:
      "Супер, давай почнемо! Чи є у тебе \\gпідробітокg\\, який ти би міг дати \\gпочатківцюg\\?  ",
    typeInput: "radio",
    options: [
      "Так, але важко знайти виконавця",
      "Так, але вона поки не потребує виконання",
      "Hi",
    ],
    name: "q3",
    icon: "quiz-icon3",
    buttonText: "Далі",
  },
  {
    type: "quiz",
    name: "q4a",
    question: "Чому тобі важко знайти виконавця?",
    options: [
      "Не вистачає відповідальних людей",
      "Немає людей з необхідними навичками",
      "Потрібно витрачати багато часу на пошук",
      "У моїй сфері не вистачає кадрів",
      "Інша відповідь: _______________________",
    ],
    typeInput: "radio",
    icon: "quiz-icon4a",
  },
  {
    type: "quiz",
    name: "q4b",
    question: "Чому ця робота поки не потребує виконання? ",
    options: [
      "Є задачі пріоритетніше",
      "Поки не вистачає людей або інших ресурсів на реалізацію",
      "Займає багато часу та не дає необхідного результату",
      "Інша відповідь: _______________________",
    ],
    typeInput: "radio",
    icon: "quiz-icon4b",
  },
  {
    type: "quiz",
    name: "q4с",
    question: "Чому у вас немає підробітку?",
    options: [
      "Делегую співробітникам",
      "Маю власних фрілансерів",
      "Виконую сам",
      "Інша відповідь: _______________________",
    ],
    typeInput: "radio",
    icon: "quiz-icon4c",
  },
  {
    type: "quiz",
    name: "q5bef",
    question: "Чи готовий працювати з початківцями?",
    options: ["Так", "Ні"],
    typeInput: "radio",
    icon: "quiz-icon5bef",
  },
  {
    type: "quiz",
    name: "q5befno",
    question: "Чому не хочеш працювати з початківцями?",
    options: [
      "Потрібно багато часу та коштів на навчання",
      "Немає впевненості в отриманні необхідного результату",
      "Був негативний досвід",
      "Інша відповідь: _______________________",
    ],
    typeInput: "radio",
    icon: "quiz-icon5befno",
  },
  {
    type: "quiz",
    name: "q5",
    question: "Прийнято! Тепер, скажи, який тип підробітку ти можеш надати?",
    options: [
      "Одноразова робота",
      "Постійна, неповний робочий день",
      "Інша відповідь: _______________________",
    ],
    typeInput: "radio",
    icon: "quiz-icon5",
  },
  {
    type: "quiz",
    name: "q6",
    question: "Онлайн чи офлайн?",
    options: ["Онлайн", "Офлайн"],
    typeInput: "radio",
    icon: "quiz-icon6",
  },
  {
    type: "quiz",
    name: "q7",
    question: "На скільки годин в день тобі потрібна людина?",
    options: ["1-2 години", "2-4 години", "4-6 годин", "Більше 6"],
    typeInput: "radio",
    icon: "quiz-icon7",
  },
  {
    type: "quiz",
    name: "q8",
    question: "Яка тривалість підробітку?",
    options: ["До 1 тижня", "До 1 місяця", "До 3 місяців", "Більше 3 місяців"],
    typeInput: "radio",
    icon: "quiz-icon8",
  },
  {
    type: "choice",
    question:
      "Просто супер! Розкажи, будь ласка, детальніше про цю \\gроботуg\\ за нашим шаблоном. \n\nЦе займе НЕ більше \\g5 хвилин!g\\ ",
    name: "c2",
    options: ["Поїхали!", "Не хочу"],
    icon: "choice-icon2",
  },
  {
    type: "quiz",
    name: "i1",
    question: "Дякуємо, що ти з нами! Почнемо)",
    typeInput: "text",
    optionen: ["Назва", "Категорія", "Короткий опис"],
    icon: "input-icon1",
  },
  {
    type: "quiz",
    name: "i2",
    question: "По бажанню",
    typeInput: "text",
    optionen: ["Обов’язки"],
    icon: "input-icon2",
  },
  {
    type: "quiz",
    name: "q9",
    question: "Необхідний рівень фрілансера",
    options: [
      "Будь-хто відповідальний",
      "Людина з базовими навичками у сфері/пройденими курсами",
      "Людина, з практичним досвідом до 3 місяців",
      "Людина з практичним досвідом до 1 року",
    ],
    typeInput: "radio",
    icon: "quiz-icon9",
  },
  {
    type: "quiz",
    name: "arbeitszeiten",
    question: "Графік роботи",
    typeInput: "arbeitszeiten",
    optionen: ["З ___ до ___", "Вільний графік"],
    icon: "arbeitszeiten-icon",
  },
  {
    type: "quiz",
    name: "budget",
    question: "Твій бюджет",
    typeInput: "slider",
    min: 0,
    max: 100000,
    step: 500,
    unit: "грн",
    icon: "budget-icon",
  },
  {
    type: "quiz",
    name: "i3",
    placeholder: "Мобільний телефон, Telegram, Viber",
    question:
      "Твій \\gпідроботокg\\ може зацікавити наших фрілансерів, яких ми зараз активно набираємо.\n\nТож рекомендуємо залишити свої \\gконтактиg\\, щоб не втрачати можливості!",
    typeInput: "text",
    optionen: ["Контакти"],
    icon: "input-icon3",
  },
  {
    type: "end",
    icon: "end-icon",
    text: "Твої відповіді прийнято. Дуже дякуємо за допомогу! Використовуй промокод \\gsurveyg\\ на gigsy.io після нашого запуску та отримуй бонуси. До зустрічі! ",
    buttonText: "Zurück zur Startseite",
  },
];
