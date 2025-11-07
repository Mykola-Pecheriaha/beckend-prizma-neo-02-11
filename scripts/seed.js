// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Начало добавления тестовых данных...');

  // Создание тестовых пациентов
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'Іван',
      lastName: 'Петренко',
      middleName: 'Олександрович',
      dateOfBirth: new Date('1985-05-15'),
      gender: 'Чоловік',
      phone: '+380501234567',
      email: 'ivan.petrenko@email.com',
      address: 'вул. Шевченка, 10',
      city: 'Київ',
      postalCode: '01001',
      emergencyContact: 'Марія Петренко',
      emergencyPhone: '+380507654321',
      allergies: 'Пеніцилін, арахіс',
      medications: 'Ліпіксор 20мг щоденно',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Марія',
      lastName: 'Іваненко',
      middleName: 'Сергіївна',
      dateOfBirth: new Date('1992-08-22'),
      gender: 'Жінка',
      phone: '+380509876543',
      email: 'maria.ivanenko@email.com',
      address: 'вул. Франка, 25',
      city: 'Львів',
      postalCode: '79000',
      emergencyContact: 'Сергій Іваненко',
      emergencyPhone: '+380502345678',
      allergies: 'Аспірин',
      medications: 'Вітаміни групи В',
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      firstName: 'Олександр',
      lastName: 'Сидоренко',
      dateOfBirth: new Date('1978-12-03'),
      gender: 'Чоловік',
      phone: '+380503456789',
      address: 'вул. Грушевського, 7',
      city: 'Одеса',
      emergencyContact: 'Наталія Сидоренко',
      emergencyPhone: '+380508765432',
    },
  });

  // Создание тестовых консультаций
  await prisma.consultation.create({
    data: {
      patientName: 'Іван Петренко Олександрович',
      age: 38,
      gender: 'чоловік',
      phone: '+380501234567',
      height: 180,
      weight: 85,
      bmi: 26.2,
      bmiStatus: 'Избыточная масса',
      complaints: 'Біль в грудях, задишка при навантаженні, підвищений тиск',
      hasOglad: true,
      hasAnalizi: true,
      hasEkg: true,
      hasRentgen: false,
      hasUzi: true,
      hasKt: false,
      hasMrt: false,
      hasChronicDiseases: true,
      takesMedications: true,
      hasAllergies: true,
      painLevel: 6,
      additionalComments:
        'Пацієнт має гіпертонію, рекомендується консультація кардіолога',
    },
  });

  await prisma.consultation.create({
    data: {
      patientName: 'Марія Іваненко Сергіївна',
      age: 31,
      gender: 'жінка',
      phone: '+380509876543',
      height: 165,
      weight: 58,
      bmi: 21.3,
      bmiStatus: 'Нормальная масса',
      complaints: 'Головний біль, запаморочення, втома',
      hasOglad: true,
      hasAnalizi: true,
      hasEkg: false,
      hasRentgen: false,
      hasUzi: false,
      hasKt: false,
      hasMrt: true,
      hasChronicDiseases: false,
      takesMedications: true,
      hasAllergies: true,
      painLevel: 4,
      additionalComments:
        'Можлива мігрень, рекомендується спостереження невролога',
    },
  });

  await prisma.consultation.create({
    data: {
      patientName: 'Олександр Сидоренко',
      age: 45,
      gender: 'чоловік',
      phone: '+380503456789',
      height: 175,
      weight: 92,
      bmi: 30.0,
      bmiStatus: 'Ожирение',
      complaints: 'Біль в колінах, швидка втомлюваність, проблеми зі сном',
      hasOglad: true,
      hasAnalizi: true,
      hasEkg: true,
      hasRentgen: true,
      hasUzi: false,
      hasKt: false,
      hasMrt: false,
      hasChronicDiseases: true,
      takesMedications: false,
      hasAllergies: false,
      painLevel: 7,
      additionalComments:
        'Рекомендується схуднення, консультація ендокринолога та ортопеда',
    },
  });

  console.log('Тестові дані успішно додано:');
  console.log('- Пацієнтів: 3');
  console.log('- Консультацій: 3');
  console.log('');
  console.log('Створені пацієнти:');
  console.log(
    `1. ${patient1.firstName} ${patient1.lastName} (${patient1.city})`
  );
  console.log(
    `2. ${patient2.firstName} ${patient2.lastName} (${patient2.city})`
  );
  console.log(
    `3. ${patient3.firstName} ${patient3.lastName} (${patient3.city})`
  );
}

async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Помилка при додаванні тестових даних:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
