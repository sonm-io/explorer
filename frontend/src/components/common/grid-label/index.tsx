import * as React from 'react';
import { Grid } from '@material-ui/core';
import './grid-label.less';

const GridLabel = (props: any) => (
    <Grid className="grid-label" item xs={2}>{props.children}</Grid>
);

export default GridLabel;
