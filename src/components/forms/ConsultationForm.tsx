'use client';

import { useState } from 'react';

interface ConsultationFormData {
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  height: string;
  weight: string;
  complaints: string;
  // Обстеження
  hasOglad: boolean;
  hasAnalizi: boolean;
  hasEkg: boolean;
  hasRentgen: boolean;
  hasUzi: boolean;
  hasKt: boolean;
  hasMrt: boolean;
  // Медична історія
  hasChronicDiseases: boolean;
  takesMedications: boolean;
  painLevel: number;
  hasAllergies: boolean;
  // Додаткові коментарі
  additionalComments: string;
}

export default function ConsultationForm() {
  const [formData, setFormData] = useState<ConsultationFormData>({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    height: '',
    weight: '',
    complaints: '',
    // Обстеження
    hasOglad: false,
    hasAnalizi: false,
    hasEkg: false,
    hasRentgen: false,
    hasUzi: false,
    hasKt: false,
    hasMrt: false,
    // Медична історія
    hasChronicDiseases: false,
    takesMedications: false,
    painLevel: 0,
    hasAllergies: false,
    // Додаткові коментарі
    additionalComments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiStatus, setBmiStatus] = useState('');

  // Расчет ИМТ в реальном времени
  const calculateBMI = (height: string, weight: string) => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = w / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));

      if (calculatedBmi < 18.5) {
        setBmiStatus('Недостатня вага');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiStatus('Нормальна вага');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiStatus('Надлишкова вага');
      } else {
        setBmiStatus('Ожиріння');
      }
    } else {
      setBmi(null);
      setBmiStatus('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else if (type === 'range') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Пересчитываем ИМТ при изменении роста или веса
    if (name === 'height') {
      calculateBMI(value, formData.weight);
    } else if (name === 'weight') {
      calculateBMI(formData.height, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Консультація успішно додана!');

        // Автоматически скрываем сообщение через 3 секунды
        setTimeout(() => {
          setSubmitMessage('');
        }, 3000);

        // Очищення форми после успешной отправки
        setFormData({
          patientName: '',
          age: '',
          gender: '',
          phone: '',
          height: '',
          weight: '',
          complaints: '',
          // Обстеження
          hasOglad: false,
          hasAnalizi: false,
          hasEkg: false,
          hasRentgen: false,
          hasUzi: false,
          hasKt: false,
          hasMrt: false,
          // Медична історія
          hasChronicDiseases: false,
          takesMedications: false,
          painLevel: 0,
          hasAllergies: false,
          // Додаткові коментарі
          additionalComments: '',
        });
        setBmi(null);
        setBmiStatus('');
      } else {
        setSubmitMessage('Помилка при додаванні консультації');
      }
    } catch (error) {
      console.error('Помилка відправки форми:', error);
      setSubmitMessage('Сталася помилка при відправці форми');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Форма консультації
      </h1>

      {submitMessage && (
        <div
          className={`p-4 mb-4 rounded-md ${
            submitMessage.includes('успішно')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Информация о пациенте */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-purple-800 flex items-center">
            <span className="mr-2">👤</span>
            Інформація про пацієнта
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Имя */}
            <div>
              <label
                htmlFor="patientName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ім&apos;я *
              </label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введіть ім'я"
              />
            </div>

            {/* Возраст */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Вік
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="1"
                max="120"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введіть вік"
              />
            </div>

            {/* Пол */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Стать
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Чоловік</option>
                <option value="male">Чоловік</option>
                <option value="female">Жінка</option>
              </select>
            </div>

            {/* Телефон */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+380 XX XXX XX XX"
              />
            </div>

            {/* Рост */}
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ріст (см)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="50"
                max="250"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введіть ріст в см"
              />
            </div>

            {/* Вес */}
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Вага (кг)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="20"
                max="300"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Введіть вагу в кг"
              />
            </div>
          </div>

          {/* ИМТ калькулятор */}
          {bmi && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Індекс маси тіла (ІМТ)
                </span>
                <span className="text-sm text-gray-500">
                  Нормальна вага: 18.5-24.9
                  <br />
                  Формула: вага/(ріст²)
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-blue-600">{bmi}</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    bmiStatus === 'Нормальна вага'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {bmiStatus}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Жалобы пациента */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-orange-800 flex items-center">
            <span className="mr-2">📋</span>
            Скарги пацієнта
          </h2>

          <div>
            <label
              htmlFor="complaints"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Опишіть скарги
            </label>
            <textarea
              id="complaints"
              name="complaints"
              value={formData.complaints}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
              placeholder="Опишіть скарги пацієнта..."
            />
          </div>
        </div>

        {/* Які мають обстеження */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
            <span className="mr-2">📋</span>
            Які мають обстеження
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasOglad"
                checked={formData.hasOglad}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Огляд</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasAnalizi"
                checked={formData.hasAnalizi}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Аналізи</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasEkg"
                checked={formData.hasEkg}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">ЕКГ</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasRentgen"
                checked={formData.hasRentgen}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Рентген</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasUzi"
                checked={formData.hasUzi}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">УЗД</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasKt"
                checked={formData.hasKt}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">КТ</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="hasMrt"
                checked={formData.hasMrt}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">МРТ</span>
            </label>
          </div>
        </div>

        {/* Медична історія */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-purple-800 flex items-center">
            <span className="mr-2">🩺</span>
            Медична історія
          </h2>

          <div className="space-y-4">
            {/* Хронічні хвороби */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Чи є хронічні хвороби?
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasChronicDiseases"
                    value="true"
                    checked={formData.hasChronicDiseases === true}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hasChronicDiseases: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Так</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasChronicDiseases"
                    value="false"
                    checked={formData.hasChronicDiseases === false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hasChronicDiseases: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ні</span>
                </label>
              </div>
            </div>

            {/* Приймає ліки */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Чи приймає ліки постійно?
              </p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="takesMedications"
                    value="true"
                    checked={formData.takesMedications === true}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        takesMedications: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Так</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="takesMedications"
                    value="false"
                    checked={formData.takesMedications === false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        takesMedications: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ні</span>
                </label>
              </div>
            </div>

            {/* Рівень болю */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Рівень болю (0-10): {formData.painLevel}
              </label>
              <div className="relative">
                <input
                  type="range"
                  name="painLevel"
                  min="0"
                  max="10"
                  value={formData.painLevel}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Немає болю (0)</span>
                  <span>Нестерпний біль (10)</span>
                </div>
              </div>
            </div>

            {/* Алергії */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Алергії</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="true"
                    checked={formData.hasAllergies === true}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hasAllergies: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Так</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasAllergies"
                    value="false"
                    checked={formData.hasAllergies === false}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hasAllergies: e.target.value === 'true',
                      })
                    }
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ні</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Додаткові коментарі */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span className="mr-2">💬</span>
            Додаткові коментарі
          </h2>

          <div>
            <label
              htmlFor="additionalComments"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Додаткові замітки
            </label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-vertical"
              placeholder="Додаткові коментарі або рекомендації..."
            />
          </div>
        </div>

        {/* Кнопка отправки */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {isSubmitting ? 'Надсилання...' : 'Надіслати консультацію'}
          </button>
        </div>
      </form>
    </div>
  );
}
