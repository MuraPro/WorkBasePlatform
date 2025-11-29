import { toast } from 'react-toastify';

export function handleError(error) {
  const status = error?.response?.data.status;
  const ststusCode = error?.response?.data?.error;

  switch (status) {
    case 'BAD_REQUEST':
      toast.error('Неверный запрос. Проверьте данные.');
      break;

    case 'EMAIL_EXISTS':
      toast.error('Данный Email уже зарегестрирован.');
      break;

    case 'EMAIL_NOT_FOUND':
      toast.error('Данный Email не найден.');
      break;

    case 'INVALID_PASSWORD':
      toast.error('Email или пароль введены некорректно.');
      break;

    case 'USER_NOT_FOUND:':
      toast.error('Пользователь не найден.');
      break;

    case 'USERS_NOT_FOUND:':
      toast.error('Пользователи не найден.');
      break;

    case 'USER_DISABLED':
      toast.error('Этот аккаунт был отключен администратором.');
      break;

    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      toast.error('Слишком много попыток. Попробуйте позже.');
      break;

    case 'VALIDATION_ERROR':
      toast.error('Ошибка валидации данных.');
      break;

    case 'CANNOT_LIKE_YOURSELF':
      toast.error('Не возможно оценить свой профиль.');
      break;

    case 'ALREADY_LIKED':
      toast.error('Вы уже оценили этот профиль.');
      break;

    case 'QUALITIES_NOT_FOUND':
      toast.error('Данные по персональным качествам не найдены.');
      break;

    case 'PROFESSIONS_NOT_FOUND':
      toast.error('Данные по профессии не найдены.');
      break;

    default:
      if (ststusCode === 400) {
        toast.error('Неверный запрос. Проверьте данные.');
      } else if (ststusCode === 401) {
        toast.error('Нет доступа. Авторизуйтесь снова.');
      } else if (ststusCode === 403) {
        toast.error('У вас нет прав на данную операцию.');
      } else if (ststusCode === 404) {
        toast.error('Ресурс не найден.');
      } else if (ststusCode === 409) {
        toast.error('Конфликт данных попробуйте обновить странницу.');
      } else if (ststusCode === 500) {
        toast.error('Ошибка сервера. Попробуйте позже.');
      } else {
        toast.error('Произошла неизвестная ошибка. Попробуйте снова.');
      }

      throw new Error('Произошла неизвестная ошибка. Попробуйте снова.');
  }
}
