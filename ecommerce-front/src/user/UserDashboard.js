import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory, setEligibleForDiscount } from "./apiUser";
import moment from "moment";
import ColoredHR from "./ColoredHR";

const Dashboard = () => {
    const MS_MONTH = 2592000000;
    const [history, setHistory] = useState([]);

    const loggedIn = isAuthenticated();

    const { user } = loggedIn
        ? loggedIn
        : {
              user: null,
          };

    const token = loggedIn ? loggedIn.token : null;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                let monthly_total = 0;
                for (let order of data) {
                    if (moment().diff(moment(order.createdAt)) < MS_MONTH) {
                        monthly_total += order.amount;
                    }
                }
                console.log("Monthly Total:", monthly_total);

                if (monthly_total > 300) {
                    setEligibleForDiscount(userId, token, true)
                        .then(response => console.log(response))
                        .catch(error => console.log(error));
                } else {
                    setEligibleForDiscount(userId, token, false);
                }

                setHistory(data.reverse());
                console.log(data);
            }
        });
    };

    useEffect(() => {
        init(user._id, token);
    }, []);

    const userLinks = () => {
        return (
            <div className='card review'>
                <h4 className='card-header bg-dark text-white'>User Links</h4>
                <ul className='list-group'>
                    <li className='list-group-item'>
                        <Link className='nav-link' to='/cart'>
                            My Cart
                        </Link>
                    </li>
                    <li className='list-group-item'>
                        <Link className='nav-link' to={`/profile/${user._id}`}>
                            Update Profile
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const userInfo = () => {
        return (
            <div className='card mb-5 review'>
                <h3 className='card-header bg-dark text-white'>
                    User Information
                </h3>
                <ul className='list-group'>
                    <li className='list-group-item'>{user.name}</li>
                    <li className='list-group-item'>{user.email}</li>
                    <li className='list-group-item'>
                        {user.role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    const purchaseHistory = history => {
        return (
            <div className='card mb-5 review'>
                <h3 className='card-header bg-dark text-white'>
                    Purchase history
                </h3>
                <ul className='list-group'>
                    <li className='list-group-item'>
                        {history.map(h => {
                            let alertClass = null;
                            switch (h.status) {
                                case "Not processed":
                                    alertClass = "danger";
                                    break;
                                case "Processing":
                                    alertClass = "warning";
                                    break;
                                case "Shipped":
                                    alertClass = "info";
                                    break;
                                case "Delivered":
                                    alertClass = "success";
                                    break;
                                case "Cancelled":
                                    alertClass = "danger";
                                    break;
                                default:
                                    break;
                            }
                            alertClass = `alert alert-${alertClass} m-auto`;
                            return (
                                <div
                                    key={h._id}
                                    style={{
                                        border: "2px solid grey",
                                        borderRadius: "5px",
                                    }}
                                    className='my-3 py-3 px-2'
                                >
                                    <div
                                        className={alertClass}
                                        style={{ width: "fit-content" }}
                                    >
                                        <h5>
                                            <b>Status:</b> {h.status}
                                        </h5>
                                        <h6>
                                            <b>Total Amount:</b> {h.amount}
                                        </h6>
                                        <h6>
                                            <b>Transaction Id:</b>{" "}
                                            {h.transaction_id}
                                        </h6>
                                        <h6
                                            className='m-0'
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <b>Purchased Date:</b>{" "}
                                            {moment(h.createdAt).fromNow()}
                                        </h6>
                                    </div>
                                    <ColoredHR color='#0e0918' />
                                    {h.products.map((p, i, arr) => {
                                        return (
                                            <div key={p._id}>
                                                <h6>Product Name: {p.name}</h6>
                                                <h6>
                                                    Product Price: ${p.price}
                                                </h6>
                                                <h6 className='m-0'>
                                                    Product Count: {p.count}
                                                </h6>
                                                {arr[i + 1] ===
                                                undefined ? null : (
                                                    <hr />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title='Dashboard'
            description={`G'day ${user.name}!`}
            className='container-fluid'
        >
            <div className='row'>
                <div className='col-3'>{userLinks()}</div>
                <div className='col-9'>
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
