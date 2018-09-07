import * as React from "react";

import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {VisibilityOff} from "@material-ui/icons";


export default class SearchBar extends React.Component {
    state = {
        value: ""
    };

    search() {

    }

    render() {
        return (
            <FormControl>
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
                <Input
                    type={"text"}
                    value={this.state.value}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.search}
                            >
                                <VisibilityOff/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        )
    }
}

