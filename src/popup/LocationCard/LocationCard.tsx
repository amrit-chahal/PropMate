import React, { useEffect, useState } from 'react';

import {
  Box,
  IconButton,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import { fetchTimeAndDistance } from '../../utils/api';
import { Delete, Edit, LocationOn } from '@material-ui/icons';

export const LocationCard: React.FC<{
  userLocation: string;
  locationTitle: string;
  listingLocation: string;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ userLocation, locationTitle, listingLocation, onEdit, onDelete }) => {
  const [distance, setDistance] = useState<string | null>(null);
  useEffect(() => {
    fetchTimeAndDistance(userLocation, listingLocation)
      .then((data) => {
        console.log(data);
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
            <Grid item xs={2}>
              <LocationOn />
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>({locationTitle})</Typography>
              <Typography variant='caption'>{userLocation}</Typography>
            </Grid>
            <Grid item xs={2}>
              <CardActions onClick={onEdit}>
                <IconButton>
                  <Edit color='primary' />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item xs={2}>
              <CardActions onClick={onDelete}>
                <IconButton>
                  <Delete color='secondary' />
                </IconButton>
              </CardActions>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
