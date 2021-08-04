import { checkForValidAddress } from '../../utils/api';
import { ACTIONS, FormActions, FormState, Input } from './FormInput';

export async function onFocusOut(
  name: string,
  value: string,
  dispatch: React.Dispatch<FormActions>,
  formState: FormState
): Promise<any> {
  const { hasError, error } = await validateInput(name, value);
  let isFormValid = true;
  let key: keyof FormState;
  for (key in formState) {
    const item = formState[key] as Input;
    if (key === name && hasError) {
      isFormValid = false;
      break;
    } else if (key !== name && item.hasError) {
      isFormValid = false;
      break;
    }
  }

  dispatch({
    type: ACTIONS.ADD,
    data: {
      name,
      value,
      hasError,
      error,
      touched: true,
      isFormValid
    }
  });
}
export default async function validateInput(name: string, value: string) {
  let hasError: boolean = false,
    error: string = '';

  switch (name) {
    case 'title':
      if (value.trim() === '') {
        hasError = true;
        error = 'Title cannot be empty';
      } else if (value.trim().length > 16) {
        hasError = true;
        error = 'Title cannot be longer than 16 characters';
      } else {
        hasError = false;
        error = '';
      }
      break;
    case 'location':
      const addressIsValid = await checkForValidAddress(value.trim());

      if (value.trim() === '') {
        hasError = true;
        error = 'Address cannot be empty';
      } else if (value.trim().length > 60) {
        hasError = true;
        error = 'Address too long! Please enter a shorter address';
      } else if (
        !/^(\d{0,10}\s)?(((\d{0,10}[a-zA-Z]{0,3})|(\d{0,10}(\/|\\)(([a-zA-Z]{0,3})|(\d{1,5}))))\s)?([a-zA-Z]{1,30},?\s?)*(\s?[a-zA-Z]{1,30})$/.test(
          value.trim()
        )
      ) {
        hasError = true;
        error = 'Error: Please check the address';
      } else if (!addressIsValid) {
        hasError = true;
        error = 'Cannot find address please enter correct address';
      } else {
        hasError = false;
        error = '';
      }
      break;

    default:
      break;
  }
  return { hasError, error };
}
