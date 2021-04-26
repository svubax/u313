//Вывод информации о пользователе в верху страницы
function addTopInfo(user){
    document.getElementById("user-top-email").innerHTML = user.email
    document.getElementById("user-top-role").innerHTML = user.roles.map((role) => role.name).join(" ")
}
//Получить список ролей
async function getRoles() {
    const response = await fetch("/api/role/all")
    return await response.json()
}
//Чтение данных с формы
function readFromForm(form) {
    const values = {}
    for (const field of form) {
        if (field.name) {
            if (field.type === "select-multiple") {
                values[field.name] = []
                for (const option of field.options) {
                    if (option.selected) {
                        values[field.name].push(option.value)
                    }
                }
            } else {
                if (field.value) {
                    values[field.name] = field.value
                }
            }
        }
    }
    return values
}