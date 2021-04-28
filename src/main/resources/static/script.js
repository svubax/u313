//Вывод информации о пользователе в верху страницы
function addTopInfo(user){
    document.getElementById("user-top-email").innerHTML = user.email
    document.getElementById("user-top-role").innerHTML = user.roles.map((role) => role.name).join(" ")
}
//Вывод информации о пользователе в таблицу
function aboutUser(user){
    let elem = document.getElementById("user-id")
    elem.innerText = user.id
    elem = elem.nextElementSibling
    elem.innerHTML = user.name
    elem = elem.nextElementSibling
    elem.innerHTML = user.surname
    elem = elem.nextElementSibling
    elem.innerHTML = user.age
    elem = elem.nextElementSibling
    elem.innerHTML = user.email
    elem.nextElementSibling.innerHTML = user.roles.map(role => role.name).join(" ")
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
//Заполнение таблицы пользователей
function fillUserTable() {
    fetch(`http://localhost:8080/api/user/all`)
        .then(response => response.json())
        .then(data => {
            let userTable = document.getElementById("users-table")
            userTable.innerHTML = ""
            for (const user of data) {
                let tr = document.createElement('tr')
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.surname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>`
                let tdRole = document.createElement('td')
                tdRole.innerText = user.roles.map(role => role.name).join(" ")
                tr.appendChild(tdRole)
                let editButton = document.createElement('td')
                editButton.innerHTML = `<button type="button" class="btn btn-success" data-toggle="modal"
                                            data-target="#edit-modal" data-user-id="${user.id}">Edit</button>`
                tr.appendChild(editButton)
                let deleteButton = document.createElement('td')
                deleteButton.innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal"
                                            data-target="#delete-modal" data-user-id="${user.id}">Delete</button>`
                tr.appendChild(deleteButton)
                userTable.appendChild(tr)
            }
        })
        .catch(err => console.error(err))
}
//Подготовка формы для добавления нового пользователя
function fillNewUserForm() {
    const formNewUser = document.getElementById("new-user-form")
    getRoles().then(roles => roles.map(role => formNewUser.roles.appendChild(new Option(role.name, role.name))))
    formNewUser.onsubmit = (event) => {
        event.preventDefault()
        const values = readFromForm(formNewUser)
        getRoles()
            .then(roles => values.roles = roles.filter(role => values.roles.includes(role.name)))
            .then(() => fetch("/api/user", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(values)
                })
            )
            .then(response => {
                if (!response.ok) {
                    throw new Error("User not added")
                }
                formNewUser.reset()
                fillUserTable()
            })
            .catch(err => console.error(err))
    }
}
//Вызов модального окна удаления пользователя
$("#delete-modal").on("show.bs.modal", function (event) {
    let button = $(event.relatedTarget)
    const id = button.data("user-id")
    let modal = $(this)
    fetch(`http://localhost:8080/api/user/${id}`)
        .then(response => response.json())
        .then(data => {
            modal.find("#delete-user-id").val(data.id)
            modal.find("#delete-user-name").val(data.name)
            modal.find("#delete-user-surname").val(data.surname)
            modal.find("#delete-user-age").val(data.age)
            modal.find("#delete-user-email").val(data.email)
            modal.find("#delete-user-role").empty()
            for (const role of data.roles) {
                modal.find("#delete-user-role").append(`<option value="${role.name}">${role.name}</option>`)
            }
        })
        .catch(err => console.error(err))
    const form = document.getElementById("delete-user-form")
    form.onsubmit = function (event) {
        event.preventDefault()
        fetch(`/api/user/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("URL not found")
                }
                modal.modal("hide")
                fillUserTable()
            })
            .catch(error => console.error(error))
    }
})
//Вызов модального окна редактирования пользователя
$("#edit-modal").on("show.bs.modal", function (event) {
    let button = $(event.relatedTarget)
    const id = button.data("user-id")
    let modal = $(this)
    fetch(`http://localhost:8080/api/user/${id}`)
        .then(response => response.json())
        .then(data => {
            modal.find("#edit-user-id").val(data.id)
            modal.find("#edit-user-name").val(data.name)
            modal.find("#edit-user-surname").val(data.surname)
            modal.find("#edit-user-age").val(data.age)
            modal.find("#edit-user-email").val(data.email)
            modal.find("#edit-user-password").val(data.password)
            const rolesElem = modal.find("#edit-user-role").empty()
            const userRoles = data.roles.map(role => role.name)
            getRoles().then(roles => {
                roles.map(role => rolesElem.append(new Option(role.name, role.name, false, userRoles.includes(role.name))))
            })
        })
        .catch(err => console.error(err))
    const formEditUser = document.getElementById("edit-user-form")
    formEditUser.onsubmit = (event) => {
        event.preventDefault()
        const values = readFromForm(formEditUser)
        getRoles()
            .then(roles => values.roles = roles.filter(role => values.roles.includes(role.name)))
            .then(() => fetch("/api/user", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(values)
                })
            )
            .then(response => {
                console.log(response)
                if (!response.ok) {
                    throw new Error("User not updated")
                }
                modal.modal("hide")
                fillUserTable()
            })
            .catch(err => console.error(err))
    }
})