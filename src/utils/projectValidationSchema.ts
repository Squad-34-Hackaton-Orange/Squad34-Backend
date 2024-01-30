import * as yup from "yup"

const projectSchema = yup.object({
    body: yup.object({
        title: yup.string().min(2).max(100).required(),
        description: yup.string().min(2).max(500).required(),
        link: yup.string().url().required(),
        id_user: yup.number().required()
    }),
    params: yup.object({
        userId: yup.number().optional(),
        projectId: yup.number().optional()
    })
})

export default projectSchema;