import React, { useEffect, useRef, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Switch,
  Toolbar,
  Typography
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  FormatShapesTwoTone,
  LocationOn
} from '@material-ui/icons';
import {
  setUserLocationsInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';
import { FormInput } from './FormInput/FormInput';
interface PopupState {
  extensionEnabled: boolean;
  bottomNavigation: string;
  functionalError: boolean;
}
interface PopupActions {
  type: string;
  data: {
    bottomNavigation: string;
  };
}
const ACTIONS = {
  STARTUP: 'startup',
  OFFSTATE: 'offstate',
  EDITSTATE: 'editstate',
  ADDSTATE: 'addstate',
  ERRORSTATE: 'errorstate',
  SWITCH: 'switch'
};
const initialState: PopupState = {
  extensionEnabled: true,
  bottomNavigation: 'myPlaces',
  functionalError: false
};

const popupReducer = (state: PopupState, action: PopupActions) => {
  switch (action.type) {
    // case ACTIONS.STARTUP:
    //   return {
    //     ...state,
    //     extensionEnabled: true,
    //     bottomNavigation: 'myPlaces',
    //     functionalError: false,
    //     formMode: 'AddNew',
    //     headingText:'Add new place'
    //   };

    // case ACTIONS.ADDSTATE:
    //   return {
    //     ...state,
    //     extensionEnabled: true,
    //     bottomNavigation: 'addNewPlace',
    //     functionalError: false,
    //     formMode: 'AddNew',
    //     headingText: 'Add new place'
    //   };

    // case ACTIONS.OFFSTATE:
    //   return {
    //     ...state,
    //     extensionEnabled: false,
    //     bottomNavigation: 'addNewPlace',
    //     functionalError: false,
    //     formMode: 'AddNew',
    //     headingText: 'Add new place'
    //   };

    // case ACTIONS.ERRORSTATE:
    //   return {
    //     ...state,
    //     extensionEnabled: true,
    //     bottomNavigation: 'addNewPlace',
    //     functionalError: true,
    //     formMode: 'AddNew',
    //     headingText: 'Add new place'
    //   };
    case ACTIONS.EDITSTATE:
      return {
        ...state,
        bottomNavigation: action.data.bottomNavigation
      };

    case ACTIONS.SWITCH:
      return {
        ...state,
        bottomNavigation: action.data.bottomNavigation
      };

    default:
      return state;
  }
};

const App: React.FC<{}> = () => {
  const [userLocations, setUserLocations] = useState<UserLocationItems>([]);
  const [popupState, dispatch] = useReducer(popupReducer, initialState);
  const [location, setLocation] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>();

  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) =>
      setUserLocations(userLocations)
    );
  }, []);
 
  const updateUserLocation = (titleInput: string, locationInput: string) => {
    const newUserLocations = [...userLocations];
    newUserLocations[editIndex!] = {
      locationTitle: titleInput,
      userLocation: locationInput
    };
    setUserLocations(
      (prevUserLocations) => (prevUserLocations = [...newUserLocations])
    );
    setUserLocationsInStorage(newUserLocations);
    console.log(
      'popuptitle from Update ' +
        titleInput +
        ' popuplocation from update ' +
        locationInput
    );

    console.log('Userlocations '+userLocations);
  };
  const addUserLocation = (titleInput: string, locationInput: string) => {
    setUserLocations(
      (prevUserLocations) =>
        (prevUserLocations = [
          ...prevUserLocations,
          { locationTitle: titleInput, userLocation: locationInput }
        ])
    );

    setUserLocationsInStorage([
      ...userLocations,
      {
        locationTitle: titleInput,
        userLocation: locationInput
      }
    ]);
    console.log('popuptitle ' + titleInput + ' popuplocation ' + locationInput);

    console.log(userLocations);
  };

  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
  };

  const handleLocationEditBtnClick = (index: number) => {
    setEditIndex(index);
    setTitle(userLocations[index].locationTitle);
    setLocation(userLocations[index].userLocation);
    dispatch({
      type: ACTIONS.EDITSTATE,
      data: {
        bottomNavigation: 'editPlace'
      }
    });
  };
  const handleBottomNavigationChange = (
    event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    dispatch({
      type: ACTIONS.SWITCH,
      data: {
        bottomNavigation: newValue
      }
    });
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
                      checked={popupState.extensionEnabled}
                      aria-label='turn on or off'
                    />
                  }
                  label={popupState.extensionEnabled ? 'On' : 'Off'}
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className='propMate-inner'>
        {popupState.bottomNavigation === 'editPlace' && (
          <FormInput
            title={title}
            location={location}
            updateUserLocation={updateUserLocation}
          ></FormInput>
        )}
        {popupState.bottomNavigation === 'addNewPlace' && (
          <FormInput addUserLocation={addUserLocation}></FormInput>
        )}
        {popupState.bottomNavigation === 'myPlaces' && (
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
          value={popupState.bottomNavigation}
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
