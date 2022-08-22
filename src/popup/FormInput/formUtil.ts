/**
 * includes helper functions to format and validate user input
 */
import { checkForValidAddress } from '../../utils/api';
import { ACTIONS, FormActions, FormState, Input } from './formInput';

export async function onFocusOut(
  name: string,
  input: string,
  dispatch: React.Dispatch<FormActions>,
  formState: FormState
): Promise<any> {
  const { hasError, error, value } = await validateInput(name, input);
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
export default async function validateInput(name: string, input: string) {
  let hasError: boolean = false,
    error: string = '',
    value: string = input;

  switch (name) {
    case 'title':
      if (value.trim() === '') {
        hasError = true;
        error = 'Title cannot be empty';
      } else if (value.length > 16) {
        hasError = true;
        error = 'Title cannot be longer than 16 characters';
      } else if (!/^[\w\d\s]*$/.test(value.trim())) {
        hasError = true;
        error = 'Only letters and numbers allowed';
      } else {
        hasError = false;
        error = '';
        value = formatInput(value);
      }
      break;
    case 'location':
      if (value.trim() === '') {
        hasError = true;
        error = 'Address cannot be empty';
      } else if (value.length > 60) {
        hasError = true;
        error = 'Address too long! Please enter a shorter address';
      } else if (
        !/^(\d{0,10}\s)?(((\d{0,10}[a-zA-Z]{0,3})|(\d{0,10}(\/|\\)(([a-zA-Z]{0,3})|(\d{1,5}))))\s)?([a-zA-Z]{1,30},?\s?)*(\s?[a-zA-Z]{1,30})$/.test(
          value.trim()
        )
      ) {
        hasError = true;
        error = 'Pleaes enter valid address';
      } else {
        const { isValidAddress, addressFromResponse } =
          await checkForValidAddress(value.trim());
        if (!isValidAddress) {
          hasError = true;
          error = 'Cannot find address please enter valid address';
        } else {
          hasError = false;
          error = '';
          value = addressFromResponse;
        }
      }
      break;

    default:
      break;
  }
  return { hasError, error, value };
}

const formatInput = (input: string): string => {
  if (!input) {
    return '';
  }
  var wordArray = input.trim().split(' ');
  const arrayCapitalized: string[] = [];
  wordArray.map((item) => {
    arrayCapitalized.push(
      item[0].toUpperCase() + item.substring(1).toLowerCase()
    );
  });

  return arrayCapitalized.join(' ');
};
