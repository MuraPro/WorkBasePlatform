export const validatorConfig = {
  name: {
    isRequired: { message: 'Имя обязательно для заполнения' },
    min: { message: 'Имя должно состоять минимум из 3 символов', value: 3 },
  },
  email: {
    noCyrillic: { message: 'Используйте английские буквы для ввода' },
    isRequired: { message: 'Электронная почта обязательна для заполнения' },
    isEmail: { message: 'Email введён некорректно' },
  },
  password: {
    noCyrillic: { message: 'Используйте английские буквы для ввода' },
    isRequired: { message: 'Пароль обязателен для заполнения' },
    isCapitalSymbol: {
      message: 'Пароль должен содержать хотя бы одну заглавную букву',
    },
    isContainDigit: {
      message: 'Пароль должен содержать хотя бы одно число',
    },
    min: {
      message: 'Пароль должен состоять минимум из 8 символов',
      value: 8,
    },
  },
  about: {
    max: { message: 'Максимум 120 символов', value: 120 },
    noHTML: { message: 'HTML-теги в этом поле запрещены' },
    isRequired: { message: 'Сообщение не может быть пустым' },
  },
  profession: {
    isRequired: { message: 'Обязательно выберите вашу профессию' },
  },
  qualities: {
    isRequired: { message: 'Выберите хотя бы одно качество' },
  },
  licence: {
    isRequired: { message: 'Требуется подтверждение лицензионного соглашения' },
  },
  image: {
    isImageUrl: {
      message:
        'Введите корректную ссылку на картинку (jpg, png, gif, webp, svg)',
    },
  },
  content: {
    isRequired: { message: 'Комментарий не может быть пустым' },
    noHTML: { message: 'HTML-теги запрещены в комментариях' },
    minIfNotEmpty: {
      message: 'Минимум 1 символ, если поле заполнено',
      value: 1,
    },
    max: { message: 'Максимум 300 символов', value: 300 },
  },
  userId: {
    isRequired: {
      message: 'Выберите от чьего имени вы хотите отправить сообщение',
    },
  },
};
