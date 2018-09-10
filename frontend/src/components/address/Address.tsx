import * as React from "react";

interface AddressState {
    address: string
}

export class Address extends React.Component<any, AddressState> {
    state = {
        address: this.props.match.params.address
    };

    componentDidMount() {

    }

    render() {
        console.log(this.state);
        return (
            <h1>Address - {this.state.address}</h1>
        )
    }
}
