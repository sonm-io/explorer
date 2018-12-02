import * as React from "react";
import TextField from '@material-ui/core/TextField';
import { InputAdornment, Theme, WithStyles, createStyles, withStyles } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
//import { SvgIconClassKey } from "@material-ui/core/SvgIcon";
//import * as classNames from 'classnames';

export type TSearchCss =
    | 'root'
    | 'input'
    | 'magnifier';

export const searchStyles = (theme: Theme) => createStyles<TSearchCss>({
    root: {},
    input: {
        backgroundColor: '#102834',
    },
    magnifier: {
        color: '#ffffff',
        opacity: 0.5,
    },
});

export interface ISearchProps extends WithStyles<TSearchCss> {
    onSubmit: (value: string) => void;
    clearAfterSubmit?: boolean;
}

interface ISearchState {
    value: string;
}

class Search extends React.Component<ISearchProps, ISearchState> {

    public static defaultProps: Partial<ISearchProps> = {
        clearAfterSubmit: true,
    };

    public state = {
        value: '',
    };

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: e.target.value });
    }

    private handleSubmit = () => {
        this.props.onSubmit(this.state.value);
        this.props.clearAfterSubmit === true && this.setState({ value: '' });
    }

    private handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    private renderMagnifier = () => {
        const { classes } = this.props;
        return (
            <InputAdornment position="end">
                <IconButton
                    onClick={this.handleSubmit}
                >
                    <SearchIcon
                        classes={{
                            root: classes.magnifier,
                        }}
                    />
                </IconButton>
            </InputAdornment>
        );
    }

    public render() {
        const { classes } = this.props;
        return (
            <TextField
                id="outlined-adornment-weight"
                className={classes.root}
                variant="outlined"
                placeholder="Search by Address / TxHash / BlockNumber"
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyPress}
                InputProps={{
                    endAdornment: this.renderMagnifier(),
                    classes: {
                        root: classes.input,
                    },
                }}
            />
        );
    }
}

export default withStyles(searchStyles)(Search);
