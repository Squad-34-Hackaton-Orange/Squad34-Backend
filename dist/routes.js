"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
function routes(app) {
    app.use('/doc', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default, { explorer: true }));
    app.use('/user', userRoutes_1.default);
    app.use('/project', projectRoutes_1.default);
    app.use('/tag', tagRoutes_1.default);
}
exports.routes = routes;
