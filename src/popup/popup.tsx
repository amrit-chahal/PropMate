import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import {
  Box,
  Grid,
  InputBase,
  IconButton,
  Paper,
  TextField
} from '@material-ui/core';
import { AddCircle as AddIcon } from '@material-ui/icons';
import {
  setUserLocationsInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';
import GoogleMaps from '../utils/autoComplete';

const App: React.FC<{}> = () => {
  const listingLocationRef = useRef('Auckland');
  const [userLocations, setUserLocations] = useState<UserLocationItems>([]);
  const [locationInput, setLocationInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  useEffect(() => {
    getUserLocationsInStorage().then((userLocations) =>
      setUserLocations(userLocations)
    );
  }, []);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (titleInput && locationInput) {
      setUserLocations((prevUserLocation) => [
        ...prevUserLocation,
        { locationTitle: titleInput, userLocation: locationInput }
      ]);
      setLocationInput((previousLocationInput) => (previousLocationInput = ''));
      setTitleInput((previousTitleInput) => (previousTitleInput = ''));

      setUserLocationsInStorage([
        ...userLocations,
        { locationTitle: titleInput, userLocation: locationInput }
      ]);

      console.log(userLocations);
    }
  };
  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
  };
  return (
    <div>
      <Box mx='4px' my='8px'>
        <Paper>
          <Box px='16px' py='4px'>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
              >
                <Grid item xs={3}>
                  <TextField
                    label='Title'
                    variant='outlined'
                    color='primary'
                    value={titleInput}
                    onChange={(event) =>
                      setTitleInput((input) => (input = event.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label='Address'
                    variant='outlined'
                    color='primary'
                    value={locationInput}
                    onChange={(event) =>
                      setLocationInput((input) => (input = event.target.value))
                    }
                    onKeyUp={(event) => {
                      if (event.key === 'Enter') {
                        handleSubmit;
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <IconButton type='submit'>
                    <AddIcon color='primary' />
                  </IconButton>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Box>
      {userLocations.map((location, index) => (
        <LocationCard
          userLocation={location.userLocation}
          locationTitle={location.locationTitle}
          listingLocation={listingLocationRef.current}
          key={index}
          onDelete={() => handleLocationDeleteBtnClick(index)}
          onEdit={() => {}}
        />
      ))}
      <Box height='8px'></Box>
    </div>
  );
};
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
