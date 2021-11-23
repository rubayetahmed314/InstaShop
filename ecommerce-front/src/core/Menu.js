import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom"; // withRouter gives URL History or Path
import { signout, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

/* Reference to hold the update function */
export let updateOutside = null;

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: "#ff9900", borderBottom: "2px solid #ff9900" };
    } else {
        return { color: "#ffffff" };
    }
};

const Menu = ({ history }) => {
    const [cartItemBadge, setCartItemBadge] = useState(itemTotal());

    useEffect(() => {
        /* Assign update to outside variable */
        updateOutside = setCartItemBadge;

        /* Unassign when component unmounts */
        return () => (updateOutside = null);
    });

    return (
        <nav className='navbar navbar-expand-lg navbar-dark bg-dark sticky-top'>
            <a className='navbar-brand' href='/'>
                <span
                    className='align-middle'
                    style={{ fontFamily: "Lobster", fontSize: "150%" }}
                >
                    <img
                        src={process.env.PUBLIC_URL + "/logo.png"}
                        style={{ width: "50px" }}
                        className='img-fluid border border-dark rounded-circle pt-n5'
                        alt='InstaShop Logo'
                    />{" "}
                    InstaShop
                </span>
            </a>

            <button
                className='navbar-toggler'
                type='button'
                data-toggle='collapse'
                data-target='#navbarSupportedContent'
                aria-controls='navbarSupportedContent'
                aria-expanded='false'
                aria-label='Toggle navigation'
            >
                <span className='navbar-toggler-icon'></span>
            </button>

            <div
                className='collapse navbar-collapse'
                id='navbarSupportedContent'
            >
                <ul className='navbar-nav ml-auto'>
                    <li className='nav-item'>
                        <a
                            className='nav-link'
                            style={isActive(history, "/")}
                            href='/'
                        >
                            Home
                        </a>
                    </li>

                    <li className='nav-item'>
                        <Link
                            className='nav-link'
                            style={isActive(history, "/shop")}
                            to='/shop'
                        >
                            Shop
                        </Link>
                    </li>
                    {isAuthenticated() && (
                        <li className='nav-item'>
                            <Link
                                className='nav-link pb-1'
                                style={isActive(history, "/cart")}
                                to='/cart'
                            >
                                <i className='fa fa-shopping-cart fa-2x mt-n1'></i>{" "}
                                <div
                                    className='badge badge-pill badge-danger px-1 mx-0'
                                    style={{
                                        display: "inline-block",
                                        position: "relative",
                                        top: "-20px",
                                    }}
                                >
                                    {cartItemBadge}
                                </div>
                            </Link>
                        </li>
                    )}
                    {/* <li className='nav-item'>
                        <Link
                            className='nav-link'
                            // style={isActive(history, '/cart')}
                            // to='/cart'
                        >
                            <i
                                className='fa fa-bell fa-1.5x text-white'
                                style={{ fontSize: '130%', marginTop: '2px' }}
                            ></i>{' '}
                            {cartItemBadge === 0 ? null : (
                                <div
                                    className='badge badge-pill badge-danger mx-0 px-1'
                                    style={{
                                        display: 'inline-block',
                                        position: 'relative',
                                        top: '-16px',
                                        left: '-7px',
                                    }}
                                >
                                    {cartItemBadge}
                                </div>
                            )}
                        </Link>
                    </li> */}

                    {isAuthenticated() && isAuthenticated().user.role === 0 && (
                        <li className='nav-item'>
                            <Link
                                className='nav-link'
                                style={isActive(history, "/user/dashboard")}
                                to='/user/dashboard'
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {isAuthenticated() && isAuthenticated().user.role === 1 && (
                        <li className='nav-item'>
                            <Link
                                className='nav-link'
                                style={isActive(history, "/admin/dashboard")}
                                to='/admin/dashboard'
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {!isAuthenticated() && (
                        <Fragment>
                            <li className='nav-item'>
                                <Link
                                    className='nav-link'
                                    style={isActive(history, "/signin")}
                                    to='/signin'
                                >
                                    Login
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link
                                    className='nav-link'
                                    style={isActive(history, "/signup")}
                                    to='/signup'
                                >
                                    Signup
                                </Link>
                            </li>
                        </Fragment>
                    )}

                    {isAuthenticated() && (
                        <li className='nav-item'>
                            <span
                                className='nav-link'
                                style={{ cursor: "pointer", color: "#ffffff" }}
                                onClick={() =>
                                    signout(() => {
                                        history.push("/");
                                    })
                                }
                            >
                                Signout
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default withRouter(Menu);
