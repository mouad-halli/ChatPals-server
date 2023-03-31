export const createError = (status: number , message: string) => {

    const error: any = new Error(message)

    error.status = status

    return error
}