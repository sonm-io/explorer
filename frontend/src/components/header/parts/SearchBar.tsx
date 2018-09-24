import Input from "@material-ui/core/Input/Input";
import * as React from "react";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import withStyles from "@material-ui/core/styles/withStyles";
import SearchIcon from '@material-ui/icons/Search';
import {Redirect} from "react-router";


interface SearchBarState {
    inputValue: string,
    redirect: boolean,
    redirectTo: string;
}

class SearchBar extends React.Component<WithStyles, SearchBarState> {
    constructor(props: any) {
        super(props);

        this.state = {
            inputValue: "",
            redirect: false,
            redirectTo: "",
        } as SearchBarState;

        this.search = this.search.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    redirect(to: string) {
        this.setState({
            redirect: true,
            redirectTo: to,
        } as SearchBarState);
    }

    search() {
        const value = this.state.inputValue.trim();

        if (value === "") {
            return
        }

        try {
            parseInt(value);
            this.redirect("/block/" + value);
        } catch (e) {
            console.log("its not block number");
        }

        if (value.length === 66) {
            this.redirect("/transaction/" + value);
        } else if (value.length === 42) {
            this.redirect("/address/" + value);
        } else {
            // TODO: redirect to not found
        }

    }

    updateInputValue(event: any) {
        this.setState({
            inputValue: event.target.value
        });
    }


    render() {
        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirectTo}/>
            )
        }
        const {classes} = this.props;
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon} onClick={this.search}>
                    <SearchIcon/>
                </div>
                <Input
                    value={this.state.inputValue}
                    onChange={this.updateInputValue}
                    placeholder="Search by address/TxHash"
                    disableUnderline
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                />
            </div>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    search: {
        position: 'relative',
        cursor: 'pointer',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#fff", 0.15),
        '&:hover': {
            backgroundColor: fade("#fff", 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: fade("#b3b3b3", 0.15),
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '75%',
        marginLeft: theme.spacing.unit * 9
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
});

export default withStyles(styles)(SearchBar);
