import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Получить все консультации
export async function GET() {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    console.error('Ошибка при получении консультаций:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении консультаций' },
      { status: 500 }
    );
  }
}

// Создать новую консультацию
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Расчет ИМТ
    const heightInMeters = body.height / 100;
    const bmi = body.weight / (heightInMeters * heightInMeters);

    // Определение статуса ИМТ
    let bmiStatus = '';
    if (bmi < 18.5) {
      bmiStatus = 'Недостаточная масса';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiStatus = 'Нормальная масса';
    } else if (bmi >= 25 && bmi < 30) {
      bmiStatus = 'Избыточная масса';
    } else {
      bmiStatus = 'Ожирение';
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientName: body.patientName,
        age: parseInt(body.age),
        gender: body.gender,
        phone: body.phone,
        height: parseInt(body.height),
        weight: parseInt(body.weight),
        bmi: parseFloat(bmi.toFixed(1)),
        bmiStatus,
        complaints: body.complaints || null,
        // Обстеження
        hasOglad: body.hasOglad || false,
        hasAnalizi: body.hasAnalizi || false,
        hasEkg: body.hasEkg || false,
        hasRentgen: body.hasRentgen || false,
        hasUzi: body.hasUzi || false,
        hasKt: body.hasKt || false,
        hasMrt: body.hasMrt || false,
        // Медична історія
        hasChronicDiseases: body.hasChronicDiseases || false,
        takesMedications: body.takesMedications || false,
        painLevel: parseInt(body.painLevel) || 0,
        hasAllergies: body.hasAllergies || false,
        // Додаткові коментарі
        additionalComments: body.additionalComments || null,
      },
      include: {
        patient: true,
      },
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании консультации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при создании консультации' },
      { status: 500 }
    );
  }
}
