const request = (option) => {
    if (String(option) !== '[object Object]') return undefined
    option.method = option.method ? option.method.toUpperCase() : 'GET'
    option.data = option.data || {}
    let formData = []
    for (let key in option.data) {
        formData.push(''.concat(key, '=', option.data[key]))
    }
    option.data = formData.join('&')

    if (option.method === 'GET') {
        option.url += location.search.length === 0 ? ''.concat('?', option.data) : ''.concat('&', option.data)
    }

    let xhr = new XMLHttpRequest()
    xhr.responseType = option.responseType || 'json'
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (option.success && typeof option.success === 'function') {
                    option.success(xhr.response)
                }
            } else {
                if (option.error && typeof option.error === 'function') {
                    option.error()
                }
            }
        }
    }
    xhr.open(option.method, option.url, true)
    if (option.method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    xhr.send(option.method === 'POST' ? option.data : null)
}

export default request