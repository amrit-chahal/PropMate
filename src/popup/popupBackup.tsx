import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Paper,
  Switch,
  TextField,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  LocationOn,
  Save as SaveIcon
} from '@material-ui/icons';
import {
  setUserLocationsInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';
import { checkForValidAddress } from '../utils/api';

const App: React.FC<{}> = () => {
  const [userLocations, setUserLocations] = useState<UserLocationItems>([]);
  const [locationInput, setLocationInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [extensionEnabled, setExtensionEnabled] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [bottomNavigation, setBottomNavigation] = useState<string>('myPlaces');
  const [inputFeedback, setFeedback] = useState<{
    isTitleValid: boolean;
    isLocationValid: boolean;
    isFormValid: boolean;
    feedback: string[];
  }>({
    isTitleValid: true,
    isLocationValid: true,
    isFormValid: false,
    feedback: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [addOrUpdate, setAddOrUpdate] = useState<{
    headingText: string;
    buttonText: string;
    successMessage: string;
  }>({
    headingText: 'Add New Place',
    buttonText: 'Add',
    successMessage: 'Sucess: New place added'
  });
  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) =>
      setUserLocations(userLocations)
    );
  }, []);
  const checkForEmptyInputs = (title: string, location: string): boolean => {
    if (title.trim() === '' && location) {
      setFeedback({
        isTitleValid: false,
        isLocationValid: true,
        isFormValid: false,
        feedback: ['Error: Title cannot be empty']
      });
      return false;
    } else if (location.trim() === '' && title) {
      setFeedback({
        isTitleValid: true,
        isLocationValid: false,
        isFormValid: false,
        feedback: ['Error: Address cannot be empty']
      });
      return false;
    } else if (!title && !location) {
      setFeedback({
        isTitleValid: false,
        isLocationValid: false,
        isFormValid: false,
        feedback: ['Error: Title and Address cannot be empty']
      });
      return false;
    } else if (!isNaN(Number(location))) {
      setFeedback({
        isTitleValid: true,
        isLocationValid: false,
        isFormValid: false,
        feedback: ['Address cant be only numeric']
      });
      return false;
    }
    console.log(location);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!checkForEmptyInputs(titleInput, locationInput)) return;
    setLoading(true);
    checkForValidAddress(locationInput).then((result) => {
      if (result) {
        setFeedback({
          isTitleValid: true,
          isLocationValid: true,
          isFormValid: true,
          feedback: ['']
        });

        const title = formatInput(titleInput);
        const location = formatInput(locationInput);
        setUserLocations((prevUserLocation) => [
          ...prevUserLocation,
          { locationTitle: title, userLocation: location }
        ]);
        setLoading(false);
        setTitleInput((previousTitleInput) => (previousTitleInput = ''));
        setLocationInput(
          (previousLocationInput) => (previousLocationInput = '')
        );

        if (titleRef.current) {
          titleRef.current?.focus();
        }

        setUserLocationsInStorage([
          ...userLocations,
          {
            locationTitle: title,
            userLocation: location
          }
        ]);

        console.log(userLocations);
      } else {
        setFeedback({
          isTitleValid: true,
          isLocationValid: false,
          isFormValid: false,
          feedback: ['Error: Incorrect address']
        });
        setLoading(false);
      }
    });
  };
  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
  };

  const handleLocationEditBtnClick = (index: number) => {
    setBottomNavigation('addNewPlace');
    setTitleInput(userLocations[index].locationTitle);
    setLocationInput(userLocations[index].userLocation);
    setAddOrUpdate({
      headingText: 'Update place',
      buttonText: 'Update',
      successMessage: 'Sucess: Place updated'
    });
  };
  const handleBottomNavigationChange = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    setBottomNavigation(newValue);
    setAddOrUpdate({
      headingText: 'Add New Place',
      buttonText: 'Add',
      successMessage: 'Sucess: New place added'
    });
  };
  const formatInput = (input: string): string => {
    var wordArray = input.trim().split(' ');
    const arrayCapitalized: string[] = [];
    wordArray.map((item) => {
      arrayCapitalized.push(
        item[0].toUpperCase() + item.substring(1).toLowerCase()
      );
    });

    return arrayCapitalized.join(' ');
  };

  return (
    <div className='propMate-container'>
      <AppBar position='static'>
        <Toolbar>
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Grid item xs={3}>
              <Icon>
                <img height='32px' className='proMate-icon' src='icon.svg' />
              </Icon>
            </Grid>
            <Grid item xs={6}>
              <Typography align='center' variant='h6' noWrap>
                Propmate
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      size='small'
                      checked={extensionEnabled}
                      aria-label='turn on or off'
                    />
                  }
                  label={extensionEnabled ? 'On' : 'Off'}
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className='propMate-inner'>
        {bottomNavigation === 'addNewPlace' && (
          <Box margin='8px'>
            <Paper elevation={3}>
              <Box px='8px' py='4px'>
                <form noValidate autoComplete='off' onSubmit={handleSubmit}>
                  <Grid
                    container
                    direction='column'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <Grid item>
                      <Box margin='5px'>
                        <Typography variant='subtitle2' color='primary'>
                          <Box fontWeight='bold'>{addOrUpdate.headingText}</Box>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box margin='5px'>
                        <TextField
                          error={!inputFeedback?.isTitleValid}
                          inputRef={titleRef}
                          autoFocus
                          name='title'
                          label='Title'
                          variant='outlined'
                          color='primary'
                          value={titleInput}
                          onChange={(event) =>
                            setTitleInput(
                              (input) => (input = event.target.value)
                            )
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box margin='5px'>
                        <TextField
                          error={!inputFeedback?.isLocationValid}
                          label='Address'
                          variant='outlined'
                          color='primary'
                          value={locationInput}
                          onChange={(event) =>
                            setLocationInput(
                              (input) => (input = event.target.value)
                            )
                          }
                          onKeyUp={(event) => {
                            if (event.key === 'Enter') {
                              handleSubmit;
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box margin='5px' height='20px'>
                        {inputFeedback.isFormValid && (
                          <Typography
                            variant='caption'
                            style={{ color: 'green' }}
                          >
                            <span className='propMate-submit-message'>
                              {addOrUpdate.successMessage}
                            </span>
                          </Typography>
                        )}
                        {!inputFeedback.isFormValid && (
                          <Typography variant='caption' color='secondary'>
                            <span className='propMate-submit-message'>
                              {inputFeedback?.feedback.toString()}
                            </span>
                          </Typography>
                        )}
                      </Box>
                    </Grid>

                    <Grid item>
                      <Box margin='5px'>
                        <Button
                          disabled={loading}
                          type='submit'
                          variant='contained'
                          color='primary'
                          size='small'
                          startIcon={
                            addOrUpdate.buttonText === 'Update' ? (
                              <SaveIcon />
                            ) : (
                              <AddIcon />
                            )
                          }
                        >
                          {addOrUpdate.buttonText}
                        </Button>
                        {loading && (
                          <CircularProgress
                            size={24}
                            style={{
                              position: 'absolute',
                              zIndex: 1,
                              top: '270px',
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
        )}
        {bottomNavigation === 'myPlaces' && (
          <div className='propMate-location-cards'>
            {userLocations.map((location, index) => (
              <LocationCard
                userLocation={location.userLocation}
                locationTitle={location.locationTitle}
                key={index}
                onDelete={() => handleLocationDeleteBtnClick(index)}
                onEdit={() => handleLocationEditBtnClick(index)}
              />
            ))}
          </div>
        )}
      </div>
      <Box
        width='100%'
        position='fixed'
        bottom='0'
        borderTop='1px solid rgba(0, 0, 0, 0.1)'
      >
        <BottomNavigation
          showLabels
          value={bottomNavigation}
          onChange={handleBottomNavigationChange}
        >
          <BottomNavigationAction
            label='My places'
            value='myPlaces'
            icon={<LocationOn />}
            style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}
          />

          <BottomNavigationAction
            label='Add new place'
            value='addNewPlace'
            icon={<AddIcon />}
          />
        </BottomNavigation>
      </Box>
    </div>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
