import Grid from "@material-ui/core/Grid/Grid";
import * as React from "react";
import SearchCmp, { TSearchCss } from "src/components/elements/search/Search";
import { withStyles } from "@material-ui/core";

interface IHomePageProps {
    onSearch: (value: string) => void;
}

const Search = withStyles<TSearchCss>((theme) => ({
    root: {
        width: 640,
    },
    input: {
        backgroundColor: '#ffffff',
    },
    magnifier: {
        color: theme.palette.primary.main,
    },
}))(SearchCmp);

export class HomePage extends React.Component<IHomePageProps> {
    public render() {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{minHeight: '80vh'}}
            >
                <Grid item xs={8}>
                    <h1 style={{textAlign: "center"}}>
                        SONM Blockchain Explorer
                    </h1>
                    <Search onSubmit={this.props.onSearch}/>
                </Grid>
            </Grid>
        );
    }
}
