import * as React from 'react';
import { Grid } from '@material-ui/core';
import * as cn from 'classnames';
import './grid-section-name.less';

const GridSectionName = (props: any) => (
    <Grid className={cn('grid-section-name', props.className)} item xs={12}>{props.children}</Grid>
);

export default GridSectionName;
