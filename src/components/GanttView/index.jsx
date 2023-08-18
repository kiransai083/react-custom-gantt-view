import React from 'react';
import { SplitView } from '../SplitView';
import { Grid } from './components/Grid';
import { Timeline } from './components/Timeline';


export const GanttView = () => {
    return <SplitView left={<Grid />} right={<Timeline />} />;
};