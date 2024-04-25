export const createErrorsList = (payload: any): string[] => {
    let errorsList: string[] = []
    for (const [key, values] of Object.entries(payload)) {
        for (const value of (values as string[])) {
            errorsList.push(value.charAt(0).toUpperCase() + value.slice(1))
        }
    }
    return errorsList
}