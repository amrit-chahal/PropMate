/**
 * materi ui card that display individual user store location tile and address
 */
import React, { useEffect, useState } from 'react';

import {
  Box,
  IconButton,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from '@material-ui/core';

import { Delete, Edit, LocationOn } from '@material-ui/icons';

const LocationCard: React.FC<{
  userLocation: string;
  locationTitle: string;
  onEdit: () => void;
  onDelete: (event: any) => void;
}> = ({ userLocation, locationTitle, onEdit, onDelete }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const onDeleteClick = (event: any) => {
    onDelete(event);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              <Typography variant='subtitle2' style={{ fontWeight: 'bold' }}>
                {locationTitle}:
              </Typography>
              <Typography variant='caption'>{userLocation}</Typography>
            </Grid>
            <Grid item xs={2}>
              <CardActions style={{ padding: '0' }} onClick={onEdit}>
                <IconButton>
                  <Edit color='primary' />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item xs={2}>
              <CardActions style={{ padding: '0' }} onClick={handleClickOpen}>
                <IconButton>
                  <Delete color='secondary' />
                </IconButton>
              </CardActions>
            </Grid>
          </Grid>
        </CardContent>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle id='draggable-dialog-title'>Are you sure?</DialogTitle>
          <DialogActions>
            <Button
              autoFocus
              onClick={(event) => onDeleteClick(event)}
              color='primary'
            >
              Yes
            </Button>
            <Button onClick={handleClose} color='secondary'>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};
export default LocationCard;
