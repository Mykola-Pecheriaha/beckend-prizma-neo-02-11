import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/patients - получить всех пациентов
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: typeof error,
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch patients',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/patients - создать нового пациента
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      city,
      postalCode,
      emergencyContact,
      emergencyPhone,
      medicalHistory,
      allergies,
      medications,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !phone ||
      !address ||
      !city
    ) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        middleName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        email,
        address,
        city,
        postalCode,
        emergencyContact,
        emergencyPhone,
        medicalHistory,
        allergies,
        medications,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
