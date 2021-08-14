/*import {
    IRouter,
    RouterOptions
} from 'express'
*/
/*
import {
    Application,
    NextFunction,
    ParamsDictionary,
    PathParams,
    Request as CoreRequest,
    Response,
    RouteParameters
} from 'express-serve-static-core';
*/
import * as e from 'express';
import * as core from 'express-serve-static-core';
import { ParsedQs } from 'qs'

declare namespace routing {

    //--- META

    export interface BaseMeta<ResType> {
        name?: string;
        description?: string;
        tags?: string | string[];
        auth?: boolean;
        parameters?: Record<string, any>;
        responses?: ResType;
    }

    export interface RouteMeta extends BaseMeta<any> {
        path: string | RegExp;
        methods: Record<string, any>;
    }

    export interface RequestMeta<ResType = any> extends BaseMeta<ResType> {
        method: string;
    }

    //--- REQUEST 

    export interface Request<
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {
        meta: RequestMeta<MetaResType>
    }

    export interface RequestHandler<
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > {
        // tslint:disable-next-line callable-types (This is extended from and can't extend from a type alias in ts<2.2)
        (
            req: Request<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            res: core.Response<ResBody, Locals>,
            next: core.NextFunction,
        ): void;
    }

    export type ErrorRequestHandler<
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > = ((
            err: any,
            req: Request<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            res: core.Response<ResBody, Locals>,
            next: core.NextFunction,
        ) => void);

    export type RequestHandlerParams<
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > =
        | RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
        | Array<RequestHandler<P> | ErrorRequestHandler<P>>;

    //--- ROUTE SETTINGS

    export interface RouteSettings
        <
        Path = string,
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > extends BaseMeta<MetaResType> {
        path: Path;
        preValidators?:
        RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        | RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>[];
    }

    export interface RouteSettingsParams
        <
        Path = string,
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        > extends BaseMeta<MetaResType> {
        path: Path;
        preValidators?:
        RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        | RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>[];
    }

    //--- ROUTER MATCHER

    export interface IRouterMatcher<
        T,
        Method extends 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' = any
        > {
        <
            Route extends string,
            P = core.RouteParameters<Route>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            // tslint:disable-next-line no-unnecessary-generics (it's used as the default type parameter for P)
            path: RouteSettings<Route, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            Path extends string,
            P = core.RouteParameters<Path>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            // tslint:disable-next-line no-unnecessary-generics (it's used as the default type parameter for P)
            path: RouteSettingsParams<Path, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            path: RouteSettings<core.PathParams, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            path: RouteSettingsParams<core.PathParams, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            Route extends string,
            P = core.RouteParameters<Route>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            // tslint:disable-next-line no-unnecessary-generics (it's used as the default type parameter for P)
            path: Route,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>
        ): T;
        <
            Path extends string,
            P = core.RouteParameters<Path>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            // tslint:disable-next-line no-unnecessary-generics (it's used as the default type parameter for P)
            path: Path,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            path: core.PathParams,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            path: core.PathParams,
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals>>
        ): T;
        (path: core.PathParams, subApplication: core.Application): T;
    }

    //--- ROUTER MIDDLEWARE EDITOR

    export interface IRouterMiddlewareEditor<
        T
    > {
        <
        P = core.ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = ParsedQs,
        Locals extends Record<string, any> = Record<string, any>,
        MetaResType = any
        >(
        ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T; 
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
        >(
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
    }

    //--- ROUTER HANDLER

    export interface IRouterHandler<T, Route extends string = string, MetaResType = any> {
        (...handlers: Array<RequestHandler<
            core.RouteParameters<Route>,
            any, any, ParsedQs, Record<string, any>, MetaResType
            >>): T;
        (...handlers: Array<RequestHandlerParams<
            core.RouteParameters<Route>,
            any, any, ParsedQs, Record<string, any>, MetaResType
            >>): T;
        <
            P = core.RouteParameters<Route>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            P = core.RouteParameters<Route>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
            >(
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
        >(
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>
        >(
            // tslint:disable-next-line no-unnecessary-generics (This generic is meant to be passed explicitly.)
            ...handlers: Array<RequestHandlerParams<P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>>
        ): T;
    }

    //--- ROUTE

    export interface IRoute<Route extends string = string, MetaResType = any> {
        path: string;
        stack: any;
        all: IRouterHandler<this, Route, MetaResType>;
        get: IRouterHandler<this, Route, MetaResType>;
        post: IRouterHandler<this, Route, MetaResType>;
        put: IRouterHandler<this, Route, MetaResType>;
        delete: IRouterHandler<this, Route, MetaResType>;
        patch: IRouterHandler<this, Route, MetaResType>;
        options: IRouterHandler<this, Route, MetaResType>;
        head: IRouterHandler<this, Route, MetaResType>;
    
        checkout: IRouterHandler<this, Route, MetaResType>;
        copy: IRouterHandler<this, Route, MetaResType>;
        lock: IRouterHandler<this, Route, MetaResType>;
        merge: IRouterHandler<this, Route, MetaResType>;
        mkactivity: IRouterHandler<this, Route, MetaResType>;
        mkcol: IRouterHandler<this, Route, MetaResType>;
        move: IRouterHandler<this, Route, MetaResType>;
        'm-search': IRouterHandler<this, Route, MetaResType>;
        notify: IRouterHandler<this, Route, MetaResType>;
        purge: IRouterHandler<this, Route, MetaResType>;
        report: IRouterHandler<this, Route, MetaResType>;
        search: IRouterHandler<this, Route, MetaResType>;
        subscribe: IRouterHandler<this, Route, MetaResType>;
        trace: IRouterHandler<this, Route, MetaResType>;
        unlock: IRouterHandler<this, Route, MetaResType>;
        unsubscribe: IRouterHandler<this, Route, MetaResType>;
    }

    //--- ROUTE METHOD

    export interface IRouteMethod {
        <T extends string>(prefix: T): IRoute<T>;
        (prefix: core.PathParams): IRoute;
        <
            Route extends string,
            P = core.RouteParameters<Route>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            prefix: RouteSettings<Route, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        ): IRoute<Route, MetaResType>;
        <
            Path extends string,
            P = core.RouteParameters<Path>,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            prefix: RouteSettingsParams<Path, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        ): IRoute<Path, MetaResType>;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            prefix: RouteSettings<core.PathParams, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        ): IRoute<string, MetaResType>;
        <
            P = core.ParamsDictionary,
            ResBody = any,
            ReqBody = any,
            ReqQuery = ParsedQs,
            Locals extends Record<string, any> = Record<string, any>,
            MetaResType = any
            >(
            prefix: RouteSettingsParams<core.PathParams, P, ResBody, ReqBody, ReqQuery, Locals, MetaResType>
        ): IRoute<string, MetaResType>;
    }

    //--- ROUTER

    export interface IRouter extends e.IRouter {
        all: IRouterMatcher<this, 'all'>;
        get: IRouterMatcher<this, 'get'>;
        post: IRouterMatcher<this, 'post'>;
        put: IRouterMatcher<this, 'put'>;
        delete: IRouterMatcher<this, 'delete'>;
        patch: IRouterMatcher<this, 'patch'>;
        options: IRouterMatcher<this, 'options'>;
        head: IRouterMatcher<this, 'head'>;
        checkout: IRouterMatcher<this>;
        connect: IRouterMatcher<this>;
        copy: IRouterMatcher<this>;
        lock: IRouterMatcher<this>;
        merge: IRouterMatcher<this>;
        mkactivity: IRouterMatcher<this>;
        mkcol: IRouterMatcher<this>;
        move: IRouterMatcher<this>;
        'm-search': IRouterMatcher<this>;
        notify: IRouterMatcher<this>;
        propfind: IRouterMatcher<this>;
        proppatch: IRouterMatcher<this>;
        purge: IRouterMatcher<this>;
        report: IRouterMatcher<this>;
        search: IRouterMatcher<this>;
        subscribe: IRouterMatcher<this>;
        trace: IRouterMatcher<this>;
        unlock: IRouterMatcher<this>;
        unsubscribe: IRouterMatcher<this>;

        route: IRouteMethod;

        //--- ROUTER DEV METHODS
        
        getMeta(): RouteMeta[];

        setAuthHandlers: IRouterMiddlewareEditor<this>;
        setAuthHandlersIfNone: IRouterMiddlewareEditor<this>;
        setValidators: IRouterMiddlewareEditor<this>;
        setValidatorsIfNone: IRouterMiddlewareEditor<this>;
    }
}

declare function routing(options?: e.RouterOptions): routing.IRouter;

export = routing;