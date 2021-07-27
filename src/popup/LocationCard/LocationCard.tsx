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

import { Delete, Edit, LocationOn } from '@material-ui/icons';

export const LocationCard: React.FC<{
  userLocation: string;
  locationTitle: string;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ userLocation, locationTitle, onEdit, onDelete }) => {
  if (!location) {
    return <div>Loading...</div>;
  }
  return (
    <Box mx='6px' my='6px'>
      <Card>
        <CardContent style={{ padding: 0 }}>
          <Grid
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <LocationOn style={{ color: '#55c1db' }} />
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
