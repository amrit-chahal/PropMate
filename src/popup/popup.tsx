import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './popup.css';
import LocationCard from './LocationCard';
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import { AddCircle as AddIcon } from '@material-ui/icons';

const App: React.FC<{}> = () => {
  const listingLocationRef = useRef('Auckland');
  const [userLocations, setUserLocations] = useState<string[]>([
    '230 Shirley Road, Papatoetoe, Auckland',
    '230 Great South Road'
  ]);
  return (
    <div>
      <Box mx='4px' my='8px'>
        <Paper>
          <Box px='16px' py='4px'>
            <Grid
              container
              direction='row'
              justifyContent='center'
              alignItems='center'
            >
              <Grid item xs={8}>
                <InputBase placeholder='enter address here...' />
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item alignItems='flex-end' xs={2}>
                <IconButton>
                  <AddIcon color='primary' />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      {userLocations.map((location, index) => (
        <LocationCard
          userLocation={location}
          listingLocation={listingLocationRef.current}
          key={index}
        />
      ))}
    </div>
  );
};
const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
