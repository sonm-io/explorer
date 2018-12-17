import * as React from 'react';
import { Grid } from '@material-ui/core';
import './grid-label.less';
import * as cn from 'classnames';

const GridLabel = (props: any) => (
    <Grid className={cn('grid-label', props.className)} item xs={2}>{props.children}</Grid>
);

export default GridLabel;
