export class TransformService {
    static fbObjectToArray(fbData) {
        if (fbData === null) {
            return null
        } else {
            return Object.keys(fbData).map(key => {
                const item = fbData[key]    // Объект
                item.id = key
                return item
            })
        }
    }
}