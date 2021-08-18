import React, { useEffect, useRef, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  CardContent,
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
  UserLocationItems,
  setIsExtensionEnabledInStorage,
  getIsExtensionEnabledInStorage
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
    bottomNavigation?: string;
    extensionEnabled?: boolean;
  };
}
const ACTIONS = {
  STARTUP: 'startup',
  CHANGEENABLEDSTATE: 'offstate',
  EDITSTATE: 'editstate',
  ADDSTATE: 'addstate',
  ERRORSTATE: 'errorstate',
  SWITCHTABS: 'switchtabs'
};

const initialState: PopupState = {
  extensionEnabled: true,
  bottomNavigation: 'myPlaces',
  functionalError: false
};

const popupReducer = (state: PopupState, action: any) => {
  switch (action.type) {
    case ACTIONS.CHANGEENABLEDSTATE:
      return {
        ...state,
        bottomNavigation: action.data.bottomNavigation,
        extensionEnabled: action.data.extensionEnabled
      };

    // case ACTIONS.ERRORSTATE:
    //   return {
    //     ...state,
    //     extensionEnabled: true,
    //     bottomNavigation: 'addNewPlace',
    //     functionalError: true,
    //   };
    case ACTIONS.EDITSTATE:
      return {
        ...state,
        bottomNavigation: action.data.bottomNavigation
      };

    case ACTIONS.SWITCHTABS:
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
  const [editLocation, setEditLocation] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number>();
  const [isListFull, setIsListFull] = useState<boolean>(false);

  useEffect(() => {
    getIsExtensionEnabledInStorage().then((response) => {
      dispatch({
        type: ACTIONS.CHANGEENABLEDSTATE,
        data: {
          extensionEnabled: response,
          bottomNavigation: response ? 'myPlaces' : 'extensionDisabled'
        }
      });
      getUserLocationsInStorage().then((userLocations) => {
        setUserLocations(userLocations);
        if (userLocations.length >= 4) {
          setIsListFull(true);
        }
      });
    });
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
  };
  const addUserLocation = (titleInput: string, locationInput: string) => {
    setUserLocations(
      (prevUserLocations) =>
        (prevUserLocations = [
          ...prevUserLocations,
          { locationTitle: titleInput, userLocation: locationInput }
        ])
    );
    if (userLocations.length >= 4) {
      setIsListFull(true);
    }

    setUserLocationsInStorage([
      ...userLocations,
      {
        locationTitle: titleInput,
        userLocation: locationInput
      }
    ]);
  };

  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
    setIsListFull(false);
  };

  const handleLocationEditBtnClick = (index: number) => {
    setEditIndex(index);
    setEditTitle(userLocations[index].locationTitle);
    setEditLocation(userLocations[index].userLocation);
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
      type: ACTIONS.SWITCHTABS,
      data: {
        bottomNavigation: newValue
      }
    });
  };
  const handleExtensionEnabledChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: ACTIONS.CHANGEENABLEDSTATE,
      data: {
        bottomNavigation: event.target.checked
          ? 'myPlaces'
          : 'extensionDisabled',
        extensionEnabled: event.target.checked
      }
    });
    setIsExtensionEnabledInStorage(event.target.checked);
    chrome.runtime.sendMessage({isEnabled:  event.target.checked})
    if (event.target.checked) {
      chrome.action.setIcon({ path: 'icon.png' });
    } else {
      chrome.action.setIcon({ path: 'icon-disabled.png' });
    }
  };

  return (
    <div className='propMate-container'>
      <AppBar
        position='static'
        color={popupState.extensionEnabled ? 'primary' : 'transparent'}
      >
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
                Propmate<sup>beta</sup>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <FormGroup>
                <FormControlLabel
                  style={{ margin: 0 }}
                  control={
                    <Switch
                      size='small'
                      checked={popupState.extensionEnabled}
                      aria-label='turn on or off'
                      onChange={handleExtensionEnabledChange}
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
            title={editTitle}
            location={editLocation}
            updateUserLocation={updateUserLocation}
          ></FormInput>
        )}
        {popupState.bottomNavigation === 'addNewPlace' && (
          <FormInput
            addUserLocation={addUserLocation}
            isListFull={isListFull}
          ></FormInput>
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
        {popupState.bottomNavigation === 'extensionDisabled' && (
          <div>
            <Card style={{ margin: '70px 40px' }}>
              <CardContent style={{ textAlign: 'center' }}>
                <Typography variant='body2' style={{ color: 'grey' }}>
                  Propmate is currently turned off, Please click the enable
                  button on top right corner in order to turn it on.
                </Typography>
              </CardContent>
            </Card>
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
            disabled={!popupState.extensionEnabled}
            icon={<LocationOn />}
            style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}
          />

          <BottomNavigationAction
            disabled={!popupState.extensionEnabled}
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
