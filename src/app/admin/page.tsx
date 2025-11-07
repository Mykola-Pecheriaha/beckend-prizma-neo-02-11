'use client';

import { useState, useEffect, useCallback } from 'react';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string;
  medications?: string;
  createdAt: string;
}

interface Consultation {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  bmiStatus: string;
  complaints: string;
  hasOglad: boolean;
  hasAnalizi: boolean;
  hasEkg: boolean;
  hasRentgen: boolean;
  hasUzi: boolean;
  hasKt: boolean;
  hasMrt: boolean;
  hasChronicDiseases: boolean;
  takesMedications: boolean;
  hasAllergies: boolean;
  painLevel: number;
  additionalComments?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState<'patients' | 'consultations'>(
    'patients'
  );
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null); // Очищаем ошибки при явном обновлении
      } else {
        setIsAutoRefreshing(true);
      }

      // Fetch patients
      const patientsResponse = await fetch('/api/patients');
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
      } else {
        throw new Error(
          `Помилка завантаження пацієнтів: ${patientsResponse.status}`
        );
      }

      // Fetch consultations
      const consultationsResponse = await fetch('/api/consultations');
      if (consultationsResponse.ok) {
        const consultationsData = await consultationsResponse.json();
        setConsultations(consultationsData);
      } else {
        throw new Error(
          `Помилка завантаження консультацій: ${consultationsResponse.status}`
        );
      }

      // Если все успешно, очищаем ошибки
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Невідома помилка';
      console.error('Ошибка при загрузке данных:', errorMessage);

      // Показываем ошибку только если это не тихое обновление
      if (!silent) {
        setError(errorMessage);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setIsAutoRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(false); // Первоначальная загрузка с индикатором

    // Автоматическое обновление данных каждые 30 секунд
    const interval = setInterval(() => {
      if (autoRefreshEnabled) {
        fetchData(true); // Тихое обновление без индикатора загрузки
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData, autoRefreshEnabled]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження даних...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Адміністративна панель
              </h1>
              <p className="mt-2 text-gray-600">
                Управління даними пацієнтів та консультацій
              </p>
              {error && (
                <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p className="text-sm">
                    <strong>Помилка:</strong> {error}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end space-x-3">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={e => setAutoRefreshEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  Автоматичне оновлення
                </label>
                <button
                  onClick={() => fetchData(false)}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium"
                >
                  {loading ? 'Оновлення...' : 'Оновити дані'}
                </button>
              </div>
              {lastUpdate && (
                <p className="text-sm text-gray-500 mt-1">
                  Останнє оновлення: {lastUpdate.toLocaleTimeString('uk-UA')}
                  {isAutoRefreshing && (
                    <span className="text-blue-500 ml-2">• оновлюється...</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('patients')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'patients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Пацієнти ({patients.length})
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'consultations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Консультації ({consultations.length})
            </button>
          </nav>
        </div>

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Зареєстровані пацієнти
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Список всіх пацієнтів, зареєстрованих через форму
              </p>
            </div>
            {patients.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Немає зареєстрованих пацієнтів</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {patients.map(patient => (
                  <li key={patient.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {patient.firstName.charAt(0)}
                                {patient.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              {patient.lastName} {patient.firstName}{' '}
                              {patient.middleName}
                            </h4>
                            <div className="mt-1 text-sm text-gray-500 space-y-1">
                              <p>
                                Дата народження:{' '}
                                {formatDateOfBirth(patient.dateOfBirth)}
                              </p>
                              <p>Стать: {patient.gender}</p>
                              <p>Телефон: {patient.phone}</p>
                              {patient.email && <p>Email: {patient.email}</p>}
                              <p>
                                Адреса: {patient.address}, {patient.city}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Екстренний контакт:
                            </h5>
                            <p className="text-gray-600">
                              {patient.emergencyContact}
                            </p>
                            <p className="text-gray-600">
                              {patient.emergencyPhone}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              Медична інформація:
                            </h5>
                            {patient.allergies && (
                              <p className="text-gray-600">
                                Алергії: {patient.allergies}
                              </p>
                            )}
                            {patient.medications && (
                              <p className="text-gray-600">
                                Ліки: {patient.medications}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-sm text-gray-500">
                        Зареєстровано: {formatDate(patient.createdAt)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Консультації
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Список всіх проведених консультацій
              </p>
            </div>
            {consultations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Немає записів про консультації</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {consultations.map(consultation => (
                  <li key={consultation.id} className="px-4 py-4 sm:px-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {consultation.patientName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {consultation.age} років, {consultation.gender}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(consultation.createdAt)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Фізичні параметри
                          </h5>
                          <p className="text-sm text-gray-600">
                            Ріст: {consultation.height} см
                          </p>
                          <p className="text-sm text-gray-600">
                            Вага: {consultation.weight} кг
                          </p>
                          <p className="text-sm text-gray-600">
                            ІМТ: {consultation.bmi}
                          </p>
                          <p className="text-sm font-medium text-blue-600">
                            {consultation.bmiStatus}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Обстеження
                          </h5>
                          <div className="space-y-1 text-sm">
                            {consultation.hasOglad && (
                              <span className="block text-green-600">
                                ✓ Огляд
                              </span>
                            )}
                            {consultation.hasAnalizi && (
                              <span className="block text-green-600">
                                ✓ Аналізи
                              </span>
                            )}
                            {consultation.hasEkg && (
                              <span className="block text-green-600">
                                ✓ ЕКГ
                              </span>
                            )}
                            {consultation.hasRentgen && (
                              <span className="block text-green-600">
                                ✓ Рентген
                              </span>
                            )}
                            {consultation.hasUzi && (
                              <span className="block text-green-600">
                                ✓ УЗІ
                              </span>
                            )}
                            {consultation.hasKt && (
                              <span className="block text-green-600">✓ КТ</span>
                            )}
                            {consultation.hasMrt && (
                              <span className="block text-green-600">
                                ✓ МРТ
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Медична історія
                          </h5>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600">
                              Хронічні хвороби:{' '}
                              {consultation.hasChronicDiseases ? 'Так' : 'Ні'}
                            </p>
                            <p className="text-gray-600">
                              Приймає ліки:{' '}
                              {consultation.takesMedications ? 'Так' : 'Ні'}
                            </p>
                            <p className="text-gray-600">
                              Алергії:{' '}
                              {consultation.hasAllergies ? 'Так' : 'Ні'}
                            </p>
                            <p className="text-gray-600">
                              Рівень болю: {consultation.painLevel}/10
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Скарги пацієнта
                        </h5>
                        <p className="text-sm text-gray-700">
                          {consultation.complaints}
                        </p>
                      </div>

                      {consultation.additionalComments && (
                        <div className="bg-blue-50 p-3 rounded">
                          <h5 className="font-medium text-gray-900 mb-2">
                            Додаткові замітки
                          </h5>
                          <p className="text-sm text-gray-700">
                            {consultation.additionalComments}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
