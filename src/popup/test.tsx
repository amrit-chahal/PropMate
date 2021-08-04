import { useReducer } from "react";

export interface FormState {
    name: Input;
    email: Input;
    isFormValid: boolean;
  }
  export interface Input {
    value: string;
    touched: boolean;
    hasError: boolean;
    error: string;
  }
  export interface FormActions {
    type: string;
    data: {
      name: string;
      value: string;
      hasError: boolean;
      error: string;
      touched: boolean;
      isFormValid: boolean;
    };
  }
  const initialState: FormState = {
    name: { value: '', touched: false, hasError: false, error: '' },
    email: { value: '', touched: false, hasError: false, error: '' },
    isFormValid: false
  };
const formReducer = (state: FormState, action: FormActions) => {
    switch (action.type) {
        case 'update': {
            const { name, value, hasError, error, touched, isFormValid } =
                action.data;
  
            return {
                ...state,
                [name]: {
                    ...(state[name as keyof FormState] as Input),
                    value,
                    hasError,
                    error,
                    touched
                },
                isFormValid
          
            };
        }
    }
}
//const [formState, dispatch] = useReducer(formReducer, initialState);
