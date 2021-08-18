import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@material-ui/core';

import { LocationOn } from '@material-ui/icons';
export const InformationChip: React.FC<{ timeAndDistanceInformaton: string }> =
  ({ timeAndDistanceInformaton }) => {
    const notFound = /Address not found/.test(timeAndDistanceInformaton);

    return (
      <Box mr='5px' mt='5px'>
        <Chip
          color={notFound ? 'secondary' : 'default'}
          icon={<LocationOn />}
          label={timeAndDistanceInformaton}
          size='small'
          variant={notFound ? 'outlined' : 'default'}
        />
      </Box>
    );
  };
