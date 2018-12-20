export interface IFooterApi {
    getNavigation: () => Promise<string>;
    getSocials: () => Promise<string>;
}

const urlTpl = (type: string) => `https://sonm.com/get-some-footer/?type=${type}`;

const fetchContent = (url: string) => fetch(url, {
    method: 'POST'
}).then((response) => response.text());

const getNavigation = () => fetchContent(urlTpl('navigation'));
const getSocials = () => fetchContent(urlTpl('socials'));

const api: IFooterApi = {
    getNavigation,
    getSocials
};

export default api;
