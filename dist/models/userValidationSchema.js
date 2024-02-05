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
const userSchema = yup.object({
    body: yup.object({
        name: yup.string().required("Campo obrigatório")
            .matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, "Deve conter somente letras e espaços")
            .min(2, "Mínimo 2 caracteres")
            .max(50, "Máximo 50 caracteres"),
        last_name: yup.string().required("Campo obrigatório")
            .matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, "Deve conter somente letras e espaços")
            .min(2, "Mínimo 2 caracteres")
            .max(50, "Máximo 50 caracteres"),
        email: yup.string().required("CAmpo obrigatório").email("Email deve ser válido"),
        country: yup.string()
            .matches(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/, "Deve conter somente letras e espaços").optional(),
        password: yup.string().when("$isSignUp", {
            is: true,
            then: (field) => (field.matches(/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).*$/, "Deve conter no mínimo 1 letra maiúscula, 1 número e 1 caractere especial")
                .required("Campo obrigatório")
                .min(8, "Mínimo 8 caracteres")
                .max(16, "Máximo 16 caracteres")),
            otherwise: (field) => field
        })
    })
});
exports.default = userSchema;
