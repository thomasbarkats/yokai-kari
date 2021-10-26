import { connect, connection, ConnectOptions } from 'mongoose';
import yasui, { ConfigService, LoggerService } from 'yasui';
import { UsersController, AuthMiddleware, AuthController, YokaisController } from './application';
import { provideDocuments } from './infrastructure';


yasui.createServer({
    controllers: [
        AuthController,
        UsersController,
        YokaisController,
    ],
    middlewares: [AuthMiddleware],
    injections: [...provideDocuments],
    environment: process.env.ENV,
    port: process.env.PORT,
    debug: process.env.DEV !== undefined,
    apiKey: process.env.API_KEY,
});


/** mongo database connection */
const mongoOptions: ConnectOptions = {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
const logger: LoggerService = new LoggerService().start();
logger.log('establishing database connection...');
connect(
    ConfigService.get('MONGO_URL'),
    mongoOptions
).catch((err: Error) => logger.error(err.message));
connection.on('error', () => logger.error('database connection: error'));
connection.once('open', () => logger.success('database connection: success'));
