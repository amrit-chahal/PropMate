import React, { useEffect, useState } from 'react';

import { Chip } from '@material-ui/core';
import { LocationOn } from '@material-ui/icons';
export const InformationChip: React.FC<{ timeAndDistanceInformaton: string }> =
  ({ timeAndDistanceInformaton }) => {
    return (
      <Chip
        
        icon={<LocationOn />}
        label={timeAndDistanceInformaton}
      />
    );
  };
