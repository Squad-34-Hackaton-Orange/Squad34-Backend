import * as yup from "yup"

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
        id_user: yup.number().required("Campo obrigatório")
    }),
    params: yup.object({
        userId: yup.number().optional(),
        projectId: yup.number().optional()
    })
})

export default projectSchema;