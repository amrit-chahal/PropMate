import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@material-ui/core';

import { LocationOn } from '@material-ui/icons';
export const InformationChip: React.FC<{ timeAndDistanceInformaton: string }> =
  ({ timeAndDistanceInformaton }) => {
    if (timeAndDistanceInformaton.split(' ').includes('Error:')) {
      return (
        <Box mr='5px' mt='5px'>
          <Chip
            color='secondary'
            variant='outlined'
            icon={<LocationOn />}
            label={timeAndDistanceInformaton}
          />
        </Box>
      );
    }

    return (
      <Box mr='5px' mt='5px'>
        <Chip icon={<LocationOn />} label={timeAndDistanceInformaton} />
      </Box>
    );
  };
