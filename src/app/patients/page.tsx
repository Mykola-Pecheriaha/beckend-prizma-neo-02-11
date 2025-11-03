import PatientForm from '@/components/forms/PatientForm';

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Система управления пациентами
        </h1>
        <PatientForm />
      </div>
    </div>
  );
}
