import TableCell from '@material-ui/core/TableCell';
import { withStyles, createStyles } from '@material-ui/core';

const styles = createStyles({
    root: {
        minWidth: '10px',
        padding: '0 10px',
        '&:first-of-type': {
            paddingLeft: 0
        },
        '&:last-of-type': {
            paddingRight: 0
        }
    },
});

export default withStyles(styles)(TableCell);
