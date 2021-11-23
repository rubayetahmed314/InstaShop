import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import ProductSlider from "./ProductSlider";
import Checkout from "./Checkout";
import ColoredHR from "../user/ColoredHR";

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    const loggedIn = isAuthenticated();

    const { user } = loggedIn
        ? loggedIn
        : {
              user: null,
          };

    const token = loggedIn ? loggedIn.token : null;

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <ColoredHR />
                {
                    <ProductSlider
                        productArray={items}
                        token={token}
                        centerMode={false}
                        fromCart={true}
                        run={run}
                        setRun={setRun}
                    />
                }
            </div>
        );
    };

    const noItemsMessage = () => (
        <h2>
            Your cart is empty. <br /> <Link to='/shop'>Continue shopping</Link>
        </h2>
    );

    return (
        <Layout
            title='Shopping Cart'
            description='Manage your cart items. Add, Remove, Checkout or continue shopping.'
            className='container'
        >
            <div className='row'>
                <div className='col-md-6 col-sm-12 px-md-5'>
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>

                <div className='col-md-6 col-sm-12 px-md-5'>
                    <h2>Payment Details</h2>
                    <ColoredHR />
                    <Checkout products={items} setRun={setRun} run={run} />
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
