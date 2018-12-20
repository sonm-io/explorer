import * as React from "react";
import './footer.less';
import { IFooterState } from "src/stores/footer-store";

export class Footer extends React.Component<IFooterState, never> {

    private createMarkup = (html?: string) => {
        return { __html: html || '' };
    }

    private renderFooter() {
        return (
            <footer className="footer">
                <div className="footer__description">
                    SONM Blockchain Explorer is a Transactions Explorer and Analytics Platform for SONM Blockchain, a decentralized fog computing platform.
                </div>
                <div className="footer__navigation" dangerouslySetInnerHTML={this.createMarkup(this.props.navigation)} />
                <div className="footer__socials" dangerouslySetInnerHTML={this.createMarkup(this.props.socials)} />
            </footer>
        );
    }

    public render() {
        return this.props.isReady ? this.renderFooter() : null;
    }
}

export default Footer;
