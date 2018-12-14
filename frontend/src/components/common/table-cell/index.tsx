import TableCell from '@material-ui/core/TableCell';
import { withStyles, createStyles } from '@material-ui/core';

const styles = createStyles({
    root: {
        minWidth: '10px',
        padding: 0,
    }
});

export default withStyles(styles)(TableCell);
