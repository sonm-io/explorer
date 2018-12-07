import * as React from 'react';
import { withStyles, createStyles, TextField, Theme, WithStyles } from '@material-ui/core';
import './index.less';

const styles = createStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
}));

type TDateTimePickerCss = 'container' | 'textField';

export interface IDateTimePickerProps extends WithStyles<TDateTimePickerCss> {
    label?: string;
}

const DateTimePicker = (p: IDateTimePickerProps) => {
    const { classes } = p;
    return (
        <form className={classes.container} noValidate>
            <TextField
                label={p.label}
                type="datetime-local"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    className: 'date-time-picker__input'
                }}
            />
        </form>
    );
};

export default withStyles(styles)(DateTimePicker);
