import * as React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {StaticContext} from "react-router";

class RouterDebugger extends React.Component<RouteComponentProps<any, StaticContext, any>> {
    public componentWillUpdate(nextProps: any, nextState: any) {

    }

    public componentDidUpdate(prevProps: any) {

    }

    public render() {
        return null;
    }
}

export default withRouter(RouterDebugger);
