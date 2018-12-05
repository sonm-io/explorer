import * as React from "react";

import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";

const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Loctions'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

class Footer extends React.Component {
    public render() {
        return (
            <footer>
                <Grid container spacing={32} justify="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs key={footer.title}>
                            <Typography variant="title" color="textPrimary" gutterBottom>
                                footer
                            </Typography>
                            {footer.description.map((item) => (
                                <Typography key={item} variant="subheading" color="textSecondary">
                                    {item}
                                </Typography>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </footer>
        );
    }
}

export default Footer;
