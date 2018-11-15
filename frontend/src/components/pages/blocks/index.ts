import { BlocksPage } from './BlocksPage';
import { EndpointAddr } from 'src/config';
import { createListPage } from 'src/components/list';

const fetchData = async (page: number, pageSize: number) => {
    const offset = pageSize * page;
    const limit = pageSize;
    const url = EndpointAddr + "/blocks?order=number.desc&limit=" + limit + "&offset=" + offset;
    console.log(url);
    return await fetch(url)
        .then((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .catch((error) => {
            return error.toString();
        });
};

export default () => createListPage(BlocksPage, fetchData);
