import { routeRequestParamDecorator } from 'yasui';

/** export custom decorators */
export const AuthUser: () => ParameterDecorator = routeRequestParamDecorator('user');
