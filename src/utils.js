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

// export const register = (credential) => {
//     const registerUrl = `${domain}/auth/register`;
//     return fetch(registerUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credential),
//     }).then((response) => {
//         if (response.status >= 300) {
//             throw Error("Fail to register");
//         }
//     });
// };



export const getDestinations = () => {
    // const authToken = localStorage.getItem("authToken");
    const listDestinations = `${domain}/api/v1/destinations`;


    return fetch(listDestinations, {
        headers: {
            // Authorization: `Bearer ${authToken}`,
        },
    }).then((response) => {
        if (response.status >= 300) {
            throw Error("Fail to get Destinations list");
        }


        return response.json();
    });
};
