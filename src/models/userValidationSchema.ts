import * as yup from "yup"

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
})


export default userSchema