import React, { useState, useEffect } from "react";
import {
    getProducts,
    getBraintreeClientToken,
    processPayment,
    createOrder,
} from "./apiCore";
import { emptyCart } from "./cartHelpers";
import { isAuthenticated } from "../auth";
import { read, setLastCouponUsed } from "../user/apiUser";
import { Link } from "react-router-dom";
// import "braintree-web"; // not using this package
import DropIn from "braintree-web-drop-in-react";
import "../Spinner.css";

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {},
        address: "",
        youPaid: 0,
    });

    const [user, setUser] = useState(null);
    const [displayCoupon, setDisplayCoupon] = useState(true);
    const [usingCoupon, setUsingCoupon] = useState(false);
    const coupon = 50000 + Math.floor(Math.random() * 50000);
    let finalTotal = 0;

    const MS_WEEK = 604800000;

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
                setData({ ...data, error: data.error });
            } else {
                console.log(data);
                setData({ clientToken: data.clientToken });
            }
        });

        read(userId, token).then(response => {
            if (response.error) {
                console.log(response.error);
            } else {
                console.log(response);
                setUser(response);
            }
        });
    };

    useEffect(() => {
        getToken(userId, token);
    }, []);

    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to='/signin'>
                <button className='btn btn-primary'>Sign in to checkout</button>
            </Link>
        );
    };

    let deliveryAddress = data.address;

    const buy = () => {
        setData({ loading: true });
        finalTotal = usingCoupon ? getTotal() * 0.75 : getTotal();

        if (usingCoupon) {
            setLastCouponUsed(userId, token, Date.now())
                .then(response => console.log(response))
                .catch(error => console.log(error));
        }

        // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance
            .requestPaymentMethod()
            .then(data => {
                // console.log(data);
                nonce = data.nonce;
                // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                // and also total to be charged
                console.log(
                    "send nonce and total to process: ",
                    nonce,
                    finalTotal
                );

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: finalTotal,
                };

                processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response);
                        // empty cart
                        // create order

                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress,
                            couponUsed: usingCoupon ? coupon : -1,
                        };

                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    console.log(
                                        "payment success and empty cart"
                                    );
                                    setData({
                                        loading: false,
                                        success: true,
                                        youPaid: finalTotal,
                                    });
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false });
                            });
                    })
                    .catch(error => {
                        console.log(error);
                        setData({ loading: false });
                    });
            })
            .catch(error => {
                // console.log("dropin error: ", error);
                setData({ ...data, error: error.message });
            });
    };

    const discardCoupon = () => {
        setDisplayCoupon(false);
        setUsingCoupon(false);
    };

    const useCoupon = () => {
        setDisplayCoupon(false);
        setUsingCoupon(true);
        // 1626655663518
    };

    const showCoupon = () => {
        if (
            user &&
            user.isEligible &&
            Date.now() - user.lastCouponUsed >= MS_WEEK &&
            displayCoupon
        ) {
            return (
                <div>
                    <div className='alert alert-info' role='alert'>
                        <h4 className='alert-heading'>
                            <strong>Coupon Available!</strong>
                        </h4>
                        {/* <button
                            type='button'
                            className='close'
                            data-dismiss='alert'
                            aria-label='Close'
                        >
                            <span aria-hidden='true'>&times;</span>
                        </button> */}
                        <hr />
                        <h5 className='text-center'>Your coupon: {coupon}</h5>
                        <div
                            className='m-auto'
                            style={{ width: "fit-content" }}
                        >
                            <button
                                className='btn btn-success mx-2'
                                onClick={useCoupon}
                            >
                                Use it Now
                            </button>
                            <button
                                className='btn btn-danger mx-2'
                                onClick={discardCoupon}
                            >
                                Discard
                            </button>
                        </div>
                    </div>
                    <div className='form-group mb-3'>
                        <label className='text-muted'>Coupon:</label>
                        <input
                            className='form-control'
                            value={coupon}
                            onChange={() => null}
                            placeholder='Enter the coupon here...'
                        />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: "" })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className='form-group mb-0'>
                        <label className='text-muted'>Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className='form-control'
                            value={data.address}
                            placeholder='Type your delivery address here...'
                        />
                    </div>
                    <DropIn
                        options={{
                            authorization: data.clientToken,
                            /* paypal: {
                                flow: 'vault'
                            } */
                        }}
                        onInstance={instance => (data.instance = instance)}
                    />
                    <button onClick={buy} className='btn btn-success btn-block'>
                        Pay
                    </button>
                </div>
            ) : null}
        </div>
    );

    const showError = error => (
        <div
            className='alert alert-danger'
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showSuccess = success => (
        <div
            className='alert alert-info'
            style={{ display: success ? "" : "none" }}
        >
            Thanks! Your payment was successful!
            <br />
            <strong>You paid: ${data.youPaid}</strong>
        </div>
    );
    // <h2 className='text-danger'>Loading...</h2>
    const showLoading = loading =>
        loading && <div className='loader'>Loading...</div>;

    let totalAmount = getTotal();
    return (
        <div>
            {products.length > 0 ? (
                usingCoupon ? (
                    <h2>
                        Total:{" "}
                        <strike className='text-danger'>${totalAmount}</strike>{" "}
                        <span className='text-success'>
                            ${totalAmount * 0.75}
                        </span>
                    </h2>
                ) : (
                    <h2>Total: ${totalAmount}</h2>
                )
            ) : null}
            {showCoupon()}
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
};

export default Checkout;
