import * as React from 'react';
import { Grid } from '@material-ui/core';

const GridValue = (props: any) => (
    <Grid className={props.className} item xs={10}>{props.children}</Grid>
);

export default GridValue;
