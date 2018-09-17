import * as React from "react";
import {WithStyles} from "@material-ui/core";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Input from "@material-ui/core/Input/Input";

class SearchBar extends React.Component<WithStyles, any> {
    search() {

    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.search}>
                <div className={classes.searchIcon} onClick={this.search}>
                    <SearchIcon/>
                </div>
                <Input
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


export default SearchBar;
