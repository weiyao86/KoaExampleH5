import { matchPath } from "dva/router";

/**
 * 
 * @param {arr} arr 路由配置数组
 * @return 路由扁平化数组
 */
const flattenRouters = arr => arr.reduce(function (prev, item) {
    let isArray = Array.isArray(item.routes);
    prev.push(item);
    return isArray ? prev.concat(flattenRouters(item.routes)) : prev;
}, []);

//匹配单个路由数据
const getBreadcrumb = (flattenRouters = [], cur, pathSection) => {
    const matchRoute = flattenRouters.find(ele => {
        const { breadcrumbName, path } = ele;
        if (!breadcrumbName || !path) {
            throw new Error('Router中的每个Route必须包含`path`及`breadcrumbName`属性')
        }
        return matchPath(pathSection, { path, exact: true });
    })
    if (matchRoute) {
        return {
            path: matchRoute.path,
            breadcrumbName: matchRoute.breadcrumbName || cur
        }
    }
    return {
        path: '',
        breadcrumbName: ''
    }
}

export const getBreadcrumbs = (routers = [], location) => {
    let matchs =[];
    //  [{
    //     path: '/',
    //     breadcrumbName: '首页'
    // }];

    const router = flattenRouters(routers);

    location.pathname.split('?')[0].split('/').reduce((prev, cur) => {
        const pathSection = `${prev}/${cur}`;
        const breadcrumb = getBreadcrumb(router, cur, pathSection);
        matchs.push(breadcrumb);
        return pathSection;
    });

    return matchs;

}