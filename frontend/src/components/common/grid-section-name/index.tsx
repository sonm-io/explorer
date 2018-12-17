import * as React from 'react';
import { Grid } from '@material-ui/core';
import './grid-section-name.less';

const GridSectionName = (props: any) => (
    <Grid className="grid-section-name" item xs={12}>{props.children}</Grid>
);

export default GridSectionName;
