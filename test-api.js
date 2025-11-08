// Test API endpoints
const API_BASE = 'http://localhost:3000/api';

async function testPatients() {
  console.log('🧪 Testing /api/patients...');
  try {
    const response = await fetch(`${API_BASE}/patients`);
    const data = await response.json();
    console.log('✅ Patients API working:', data.length, 'patients found');
    return true;
  } catch (error) {
    console.error('❌ Patients API error:', error.message);
    return false;
  }
}

async function testConsultations() {
  console.log('🧪 Testing /api/consultations...');
  try {
    const response = await fetch(`${API_BASE}/consultations`);
    const data = await response.json();
    console.log(
      '✅ Consultations API working:',
      data.length,
      'consultations found'
    );
    return true;
  } catch (error) {
    console.error('❌ Consultations API error:', error.message);
    return false;
  }
}

async function testCreateConsultation() {
  console.log('🧪 Testing POST /api/consultations...');
  try {
    const testData = {
      patientName: 'Тест Пацієнт',
      age: '30',
      gender: 'male',
      phone: '+380501234567',
      height: '180',
      weight: '75',
      complaints: 'Test complaint',
      hasOglad: true,
      hasAnalizi: false,
      hasEkg: false,
      hasRentgen: false,
      hasUzi: false,
      hasKt: false,
      hasMrt: false,
      hasChronicDiseases: false,
      takesMedications: false,
      painLevel: 3,
      hasAllergies: false,
      additionalComments: 'Test comment',
    };

    const response = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Create consultation working:', data.id);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Create consultation failed:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Create consultation error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');

  const tests = [testPatients, testConsultations, testCreateConsultation];

  let passed = 0;
  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    console.log('');
  }

  console.log(`📊 Results: ${passed}/${tests.length} tests passed`);
}

runTests();
