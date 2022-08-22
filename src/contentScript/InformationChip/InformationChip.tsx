/**
 * invidual chip component
 */
import React, { useEffect, useState } from 'react';
import { Box, Chip } from '@material-ui/core';

import { LocationOn } from '@material-ui/icons';
const InformationChip: React.FC<{ timeAndDistanceInformaton: string }> = ({
  timeAndDistanceInformaton
}) => {
  const error = /Error/.test(timeAndDistanceInformaton);

  return (
    <Box mr='5px' mt='5px'>
      <Chip
        color={error ? 'secondary' : 'default'}
        icon={<LocationOn />}
        label={timeAndDistanceInformaton}
        size='small'
        variant={error ? 'outlined' : 'default'}
      />
    </Box>
  );
};
export default InformationChip;
