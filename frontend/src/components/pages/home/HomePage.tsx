import * as React from "react";
import Grid from "@material-ui/core/Grid/Grid";
import SearchBar from "./parts/SearchBar";


class HomePage extends React.Component {
    render() {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >

                <Grid item xs={3}>
                    <h1>SONM SE</h1>
                    <SearchBar classes={{

                    }}/>
                </Grid>

            </Grid>
        )
    }
}

export default HomePage;
