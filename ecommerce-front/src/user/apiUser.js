import { API } from "../config";

export const read = (userId, token) => {
    return fetch(`${API}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const update = (userId, token, user) => {
    return fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};

export const getPurchaseHistory = (userId, token) => {
    return fetch(`${API}/orders/by/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const setEligibleForDiscount = (userId, token, isEligible) => {
    return fetch(`${API}/discount/eligible/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isEligible: isEligible }),
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const setLastCouponUsed = (userId, token, lastCouponUsed) => {
    return fetch(`${API}/discount/coupon/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lastCouponUsed: lastCouponUsed }),
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const setSubscriber = (userId, token) => {
    return fetch(`${API}/subscribe/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

/* export const getEligibleForDiscount = (userId, token) => {
    return fetch(`${API}/discount/get/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}; */
