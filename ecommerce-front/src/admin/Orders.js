import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "../Spinner.css";
import { listOrders, getStatusValues, updateOrderStatus } from "./apiAdmin";
import moment from "moment";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const { user, token } = isAuthenticated();

    const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setOrders(data.reverse());
            }
        });
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setStatusValues(data);
            }
        });
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h1 className='text-danger'>
                    <b>Total Orders: {orders.length}</b>
                </h1>
            );
        } else {
            // <h1 className='text-danger'>No orders</h1>
            return <div className='loader'>Loading...</div>;
        }
    };

    const showInput = (key, value) => (
        <div className='input-group mb-2 mr-sm-2'>
            <div className='input-group-prepend'>
                <div className='input-group-text'>
                    <b>{key}</b>
                </div>
            </div>
            <input
                type='text'
                value={value}
                className='form-control'
                readOnly
            />
        </div>
    );

    const handleStatusChange = (e, orderId) => {
        updateOrderStatus(user._id, token, orderId, e.target.value).then(
            data => {
                if (data.error) {
                    console.log("Status update failed");
                } else {
                    console.log("Status:", data);
                    loadOrders();
                }
            }
        );
    };

    const showStatus = o => {
        let alertClass = null;
        switch (o.status) {
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
        alertClass = `alert alert-${alertClass}`;
        return (
            <div className='form-group'>
                <h3 className={`${alertClass} mb-4`}>
                    <b>Status:</b> <span className='stylish'>{o.status}</span>
                </h3>
                <select
                    className='form-control'
                    onChange={e => handleStatusChange(e, o._id)}
                >
                    <option>Update Status</option>
                    {statusValues.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <Layout
            title='Orders'
            description={`G'day ${user.name}, you can manage all the orders here`}
            className='container-fluid'
        >
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {showOrdersLength()}

                    {orders.map((o, oIndex) => {
                        return (
                            <div
                                className='mt-5'
                                key={oIndex}
                                style={{
                                    borderBottom: "5px solid indigo",
                                    boxShadow: "0px 0px 10px 6px #474d5d",
                                }}
                            >
                                <h2 className='p-3 bg-dark text-white'>
                                    <span>Order ID: {o._id}</span>
                                </h2>

                                <ul className='list-group mb-2 mx-3'>
                                    <li className='list-group-item'>
                                        {showStatus(o)}
                                    </li>
                                    <li className='list-group-item'>
                                        <b>Transaction ID:</b>{" "}
                                        {o.transaction_id}
                                    </li>
                                    <li className='list-group-item'>
                                        <b>Amount:</b> ${o.amount}
                                    </li>
                                    <li className='list-group-item'>
                                        <b>Ordered by:</b> {o.user.name}
                                    </li>
                                    <li className='list-group-item'>
                                        <b>Ordered on:</b>{" "}
                                        {moment(o.createdAt).fromNow()}
                                    </li>
                                    <li className='list-group-item'>
                                        <b>Delivery address:</b> {o.address}
                                    </li>
                                </ul>

                                <h3 className='my-4 mx-3 px-3 alert alert-info'>
                                    <b>Total products in the order:</b>{" "}
                                    <span className='stylish'>
                                        {o.products.length}
                                    </span>
                                </h3>

                                {o.products.map((p, pIndex) => (
                                    <div
                                        className='mb-4 px-3 mx-3'
                                        key={pIndex}
                                        style={{
                                            padding: "20px",
                                            border: "1px solid indigo",
                                        }}
                                    >
                                        {showInput("Product name", p.name)}
                                        {showInput("Product price", p.price)}
                                        {showInput("Product total", p.count)}
                                        {showInput("Product Id", p._id)}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
