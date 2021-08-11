import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core';
import React, { useState, useEffect, useReducer, useRef } from 'react';
import { AddCircle as AddIcon, Save as SaveIcon } from '@material-ui/icons';
import validateInput, { onFocusOut } from './formUtil';

export interface FormState {
  title: Input;
  location: Input;
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
    hasError?: boolean;
    error?: string;
    touched?: boolean;
    isFormValid?: boolean;
  };
}
export const ACTIONS = {
  EDIT: 'edit',
  ADD: 'add',
  INPUT_CHANGE: 'input change'
};

const initialState: FormState = {
  title: { value: '', touched: false, hasError: false, error: '' },
  location: { value: '', touched: false, hasError: false, error: '' },
  isFormValid: false
};
const formReducer = (state: FormState, action: any) => {
  switch (action.type) {
    case ACTIONS.ADD: {
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
    case ACTIONS.EDIT: {
      const { name, value } = action.data;
      return {
        ...state,
        [name]: { ...(state[name as keyof FormState] as Input), value }
      };
    }
    case ACTIONS.INPUT_CHANGE: {
      const { name, value } = action.data;

      return {
        ...state,
        [name]: { ...(state[name as keyof FormState] as Input), value }
      };
    }
    default:
      return state;
  }
};

export const FormInput: React.FC<{
  title?: string;
  location?: string;
  addUserLocation?: (title: string, location: string) => void;
  updateUserLocation?: (title: string, location: string) => void;
}> = ({ title, location, addUserLocation, updateUserLocation }) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formHeading, setFormHeading] = useState<string>('Add new place');
  const [formMode, setFormMode] = useState<string>('Add');
  const [sucessMessage, setSucessMessage] = useState<string>(
    'Sucess: New place added'
  );
  const [isSubmitted,setIsSubmitted] = useState<boolean>(false)
  useEffect(() => {
    console.log('Initial render formstate ' + formState.isFormValid);
    if (title && location) {
      dispatch({
        type: ACTIONS.EDIT,
        data: {
          name: 'title',
          value: title
        }
      });
      dispatch({
        type: ACTIONS.EDIT,
        data: {
          name: 'location',
          value: location
        }
      });

      setFormHeading('Update place');
      setFormMode('Update');
      setSucessMessage('Sucess: Place updated');
    }
  }, []);

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    console.log('Before submit ');
    console.log(formState);
    let isFormValid = true;
    setIsLoading(true);
    console.log('isloading ' + isLoading);
    let name: keyof FormState;
    for (name in formState) {
      const item = formState[name] as Input;
      const { value } = item;
      const { hasError, error } = await validateInput(name, value);
      if (hasError) {
        isFormValid = false;
      }
      if (name) {
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
      console.log(
        'name ' + name + ' value ' + value + ' has Error ' + hasError
      );
    }
    console.log('After submit ');
    console.log(formState);
    console.log('form valid ' + isFormValid);
    console.log('formstate valid ' + formState.isFormValid);

    if (isFormValid) {
      if (formMode === 'Add' && addUserLocation) {
        addUserLocation(formState.title.value, formState.location.value);
      }
      if (formMode === 'Update' && updateUserLocation) {
        updateUserLocation(formState.title.value, formState.location.value);
      }
    }
    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false)
      
    }, 5000);
  };
  const formatInput = (input: string): string => {
    if (!input) {
      return '';
    }
    var wordArray = input.trim().split(/(\s|,)+/);
    const arrayCapitalized: string[] = [];
    wordArray.map((item) => {
      arrayCapitalized.push(
        item[0].toUpperCase() + item.substring(1).toLowerCase()
      );
    });

    return arrayCapitalized.join(' ');
  };

  return (
    <Box margin='8px'>
      <Paper elevation={3}>
        <Box px='8px' py='4px'>
          <form
            noValidate
            autoComplete='off'
            onSubmit={async (event) => {
             await  handleFormSubmit(event);
            }}
          >
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              <Grid item>
                <Box margin='5px'>
                  <Typography variant='subtitle2' color='primary'>
                    <Box fontWeight='bold'>{formHeading}</Box>
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box margin='5px'>
                  <TextField
                    error={formState.title.hasError}
                    size='small'
                    autoFocus
                    name='title'
                    label='Title'
                    variant='outlined'
                    color='primary'
                    value={formState.title.value}
                    onChange={(event) =>
                      dispatch({
                        type: ACTIONS.INPUT_CHANGE,
                        data: {
                          name: 'title',
                          value: event.target.value
                        }
                      })
                    }
                    onBlur={async (event) => {
                      await onFocusOut(
                        'title',
                        formatInput(event.target.value),
                        dispatch,
                        formState
                      );
                    }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box height='10px' marginBottom='5px'>
                  {formState.title.touched && formState.title.hasError && (
                    <Typography variant='caption' color='secondary'>
                      <span className='propMate-submit-message'>
                        {formState.title.error}
                      </span>
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item>
                <Box margin='5px'>
                  <TextField
                    size='small'
                    error={formState.location.hasError}
                    name='location'
                    label='Address'
                    variant='outlined'
                    color='primary'
                    value={formState.location.value}
                    onChange={(event) =>
                      dispatch({
                        type: ACTIONS.INPUT_CHANGE,
                        data: {
                          name: 'location',
                          value: event.target.value
                        }
                      })
                    }
                    onBlur={async (event) => {
                      await onFocusOut(
                        'location',
                        formatInput(event.target.value),
                        dispatch,
                        formState
                      );
                    }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box height='35px' marginBottom='5px' textAlign='center'>
                  {formState.location.touched && formState.location.hasError && (
                    <Typography variant='caption' color='secondary'>
                      <span>{formState.location.error}</span>
                    </Typography>
                  )}
                  {formState.isFormValid && isSubmitted &&(
                    <Typography variant='caption' style={{ color: 'green' }}>
                      {sucessMessage}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item>
                <Box margin='5px'>
                  <Button
                    disabled={isLoading}
                    type='submit'
                    variant='contained'
                    color='primary'
                    size='small'
                    startIcon={
                      formMode === 'Update' ? <SaveIcon /> : <AddIcon />
                    }
                    onClick={handleFormSubmit}
                  >
                    {formMode}
                  </Button>
                  {isLoading && (
                    <CircularProgress
                      size={20}
                      style={{
                        position: 'absolute',
                        zIndex: 1,
                        top: '260px',
                        left: '130px'
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
