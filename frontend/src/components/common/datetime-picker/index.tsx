import * as React from 'react';
import { withStyles, createStyles, TextField, Theme, WithStyles } from '@material-ui/core';
import './index.less';

const styles = createStyles((theme: Theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 200,
    },
}));

type TDateTimePickerCss = 'container' | 'textField';

export interface IDateTimePickerProps extends WithStyles<TDateTimePickerCss> {
    type?: 'date' | 'datetime-local';
    label?: string;
    value?: Date;
    onChange: (value?: Date) => void;
}

const inputLabelProps = {
    shrink: true,
};

const inputProps = {
    className: 'date-time-picker__input'
};

function isValidDate(d: any) {
    return d instanceof Date && !isNaN(d as any);
}

class DateTimePicker extends React.Component<IDateTimePickerProps, never> {

    public static defaultProps: Partial<IDateTimePickerProps> = {
        type: 'date'
    };

    constructor(props: IDateTimePickerProps) {
        super(props);
    }

    private handleBlur = () => {
        if (this.props.onChange !== undefined) {
            const value = this.inputRef === undefined ? undefined : new Date(this.inputRef.value);
            console.log('inputRef value [' + value + ']');
            this.props.onChange(value);
        }
    }

    private inputRef: any;

    private saveInputRef = (ref: any) => {
        this.inputRef = ref;
    }

    private dateAsString = () => {
        const date = this.props.value;
        return date === undefined || !isValidDate(date)
            ? ''
            : date.toISOString().substring(0, 16);
    }

    public render() {
        console.log(this.dateAsString());
        const { classes, label, value, onChange, ...p } = this.props;
        return (
            <form className={classes.container} noValidate>
                <TextField
                    inputRef={this.saveInputRef}
                    label={label}
                    className={classes.textField}
                    InputLabelProps={inputLabelProps}
                    inputProps={inputProps}
                    onBlur={this.handleBlur}
                    defaultValue={this.dateAsString()}
                    {...p}
                />
            </form>
        );
    }
}

export default withStyles(styles)(DateTimePicker);
