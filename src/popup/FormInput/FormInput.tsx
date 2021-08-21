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
  INPUT_CHANGE: 'input change',
  RESET_FORM: 'resetForm'
};

const initialState: FormState = {
  title: { value: '', touched: false, hasError: false, error: '' },
  location: { value: '', touched: false, hasError: false, error: '' },
  isFormValid: true
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
    case ACTIONS.RESET_FORM:
      return initialState;
    default:
      return state;
  }
};

export const FormInput: React.FC<{
  title?: string;
  location?: string;
  addUserLocation?: (title: string, location: string) => void;
  updateUserLocation?: (title: string, location: string) => void;
  isListFull?: boolean;
}> = ({ title, location, addUserLocation, updateUserLocation, isListFull }) => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formHeading, setFormHeading] = useState<string>('Add new place');
  const [formMode, setFormMode] = useState<string>('Add');
  const [sucessMessage, setSucessMessage] = useState<string>(
    'Sucess: New place added'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
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
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    if (isSubmitted) {
      if (formMode === 'Add' && addUserLocation) {
        addUserLocation(formState.title.value, formState.location.value);
        dispatch({ type: ACTIONS.RESET_FORM });
      }
      if (formMode === 'Update' && updateUserLocation) {
        updateUserLocation(formState.title.value, formState.location.value);
      }
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isSubmitted]);

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
      const result = await validateInput(name, value);

      if (result.hasError) {
        isFormValid = false;
      }
      if (name) {
        dispatch({
          type: ACTIONS.ADD,
          data: {
            name,
            value: result.value,
            hasError: result.hasError,
            error: result.error,
            touched: true,
            isFormValid
          }
        });
      }
    }
    if (isFormValid) {
      setIsSubmitted(true);
    }

    setIsLoading(false);
    if (isMountedRef.current) {
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <Box margin='8px'>
      <Paper elevation={3}>
        <Box px='8px' py='4px'>
          <form
            noValidate
            autoComplete='off'
            onSubmit={async (event) => {
              await handleFormSubmit(event);
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
                  <Typography
                    style={{ fontWeight: 'bold' }}
                    variant='subtitle2'
                    color='primary'
                  >
                    {formHeading}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box margin='5px'>
                  <TextField
                    error={formState.title.hasError}
                    disabled={isListFull}
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
                        event.target.value,
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
                    disabled={isListFull}
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
                        event.target.value,
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

                  {formState.isFormValid && isSubmitted && (
                    <Typography variant='caption' style={{ color: 'green' }}>
                      {sucessMessage}
                    </Typography>
                  )}
                  {isListFull && !isSubmitted && (
                    <Typography variant='caption' color='secondary'>
                      <span>
                        Max capacity of 5 addresses reached please delete older
                        items to add new
                      </span>
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item>
                <Box margin='5px'>
                  <Button
                    disabled={isLoading || isListFull}
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
