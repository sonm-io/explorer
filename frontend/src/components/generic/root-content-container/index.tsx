import * as React from 'react';
import './root-content-container.less';

export class RootContentContainer extends React.Component {
    public render() {
        return (
            <div className="root-content-container">
                {this.props.children}
            </div>
        );
    }
}

export default RootContentContainer;
