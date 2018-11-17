import * as React from "react";
import {withRouter, RouteComponentProps} from "react-router-dom";
import { StaticContext } from "react-router";

class RouterDebugger extends React.Component<RouteComponentProps<any, StaticContext, any>> {
    public componentWillUpdate(nextProps: any, nextState: any) {
        console.log('componentWillUpdate', nextProps, nextState);
    }

    public componentDidUpdate(prevProps: any) {
        console.log('componentDidUpdate', prevProps);
    }

    public render() {
        return null;
    }
}

export default withRouter(RouterDebugger);
