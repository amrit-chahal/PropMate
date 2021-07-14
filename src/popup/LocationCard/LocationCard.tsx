import React, { useEffect, useState } from 'react';

import {
  Box,
  IconButton,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { fetchTimeAndDistance } from '../../utils/api';
import { Delete, Edit, LocationOn } from '@material-ui/icons';

export const LocationCard: React.FC<{
  userLocation: string;
  listingLocation: string;
}> = ({ userLocation, listingLocation }) => {
  const [distance, setDistance] = useState<string | null>(null);
  useEffect(() => {
    fetchTimeAndDistance(userLocation, listingLocation)
      .then((data) => {
        setDistance(data.rows[0].elements[0].distance.text);
      })
      .catch((error) => console.log(error));
  }, [userLocation, listingLocation]);

  if (!location) {
    return <div>Loading...</div>;
  }
  return (
    <Box mx='4px' my='8px'>
      <Card>
        <CardContent>
          <Grid
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item alignItems='center' xs={2}>
              <LocationOn />
            </Grid>
            <Grid item alignItems='center' xs={6}>
              <Typography variant='subtitle2'>{userLocation}</Typography>
              <Typography variant='subtitle2'>({distance})</Typography>
            </Grid>
            <Grid item alignItems='center' xs={2}>
              <IconButton>
                <Edit color='primary' />
              </IconButton>
            </Grid>
            <Grid item alignItems='center' xs={2}>
              <IconButton>
                <Delete color='secondary' />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
