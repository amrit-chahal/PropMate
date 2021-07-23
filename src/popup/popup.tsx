import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import { Box, Grid, IconButton, Paper, TextField } from '@material-ui/core';
import { AddCircle as AddIcon } from '@material-ui/icons';
import {
  setUserLocationsInStorage,
  getUserLocationsInStorage,
  UserLocationItems
} from '../utils/storage';

const App: React.FC<{}> = () => {
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
      const title = capitalizeFirstLetter(titleInput);
      const location = capitalizeFirstLetter(locationInput);
      setUserLocations((prevUserLocation) => [
        ...prevUserLocation,
        { locationTitle: title, userLocation: location }
      ]);
      setLocationInput((previousLocationInput) => (previousLocationInput = ''));
      setTitleInput((previousTitleInput) => (previousTitleInput = ''));

      setUserLocationsInStorage([
        ...userLocations,
        {
          locationTitle: title,
          userLocation: location
        }
      ]);

      console.log(userLocations);
    }
  };
  const handleLocationDeleteBtnClick = (index: number) => {
    userLocations.splice(index, 1);
    setUserLocations((prevUserlocations) => [...prevUserlocations]);
    setUserLocationsInStorage(userLocations);
  };
  const capitalizeFirstLetter = (input: string): string => {
    var wordArray = input.split(' ');
    const arrayCapitalized: string[] = [];
    wordArray.map((item) => {
      arrayCapitalized.push(item[0].toUpperCase() + item.substring(1));
    });

    return arrayCapitalized.join(' ');
  };

  return (
    <div>
      <Box mx='6px' my='6px'>
        <Paper>
          <Box px='8px' py='4px'>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
              >
                <Grid item xs={3}>
                  <Box mr='5px'>
                    <TextField
                      autoFocus
                      size='small'
                      label='Title'
                      variant='outlined'
                      color='primary'
                      value={titleInput}
                      onChange={(event) =>
                        setTitleInput((input) => (input = event.target.value))
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={7}>
                  <Box mr='5px'>
                    <TextField
                      size='small'
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
          key={index}
          onDelete={() => handleLocationDeleteBtnClick(index)}
          onEdit={() => {}}
        />
      ))}
      <Box height='4px'></Box>
    </div>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
