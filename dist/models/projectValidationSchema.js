"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const projectSchema = yup.object({
    body: yup.object({
        title: yup.string()
            .min(2, "Mínimo 2 caracteres")
            .max(50, "Máximo 50 caracteres")
            .required("Campo obrigatório"),
        description: yup.string()
            .min(2, "Mínimo 2 caracteres")
            .max(255, "Máximo 255 caracteres")
            .required("Campo Obrigatório"),
        link: yup.string()
            .url("Deve ser uma URL válida")
            .required("Campo obrigatório"),
        tags: yup.array().of(yup.number().integer("Os ids devem ser números inteiros")),
        date_post: yup.date(),
        id_user: yup.string().required("Campo obrigatório")
    }),
    params: yup.object({
        userId: yup.number().optional(),
        projectId: yup.number().optional()
    })
});
exports.default = projectSchema;
