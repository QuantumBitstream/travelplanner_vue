const domain = "http://localhost:8081"

export const login = (credential) => {
    const loginUrl = `${domain}/auth/login`;
    return fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then((response) => {
        if (response.status >= 300) {
            throw Error("Fail to log in");
        }


        return response.json();  // 解析响应体为 JSON 格式
    });
};
