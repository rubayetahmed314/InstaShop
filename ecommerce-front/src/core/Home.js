import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { isAuthenticated } from "../auth";
import ProductSlider from "./ProductSlider";
import { getProducts } from "./apiCore";
import Search from "./Search";
import DisplayProduct from "./DisplayProduct";

const Home = () => {
    const loggedIn = isAuthenticated();

    const { user } = loggedIn
        ? loggedIn
        : {
              user: null,
          };

    const token = loggedIn ? loggedIn.token : null;

    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = () => {
        getProducts("sold").then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProductsBySell(data);
            }
        });
    };

    const loadProductsByArrival = () => {
        getProducts("createdAt").then(data => {
            console.log(data);
            if (data.error) {
                setError(data.error);
            } else {
                setProductsByArrival(data);
            }
        });
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout
            title=''
            description=''
            className='container-fluid px-md-5'
            isHome='true'
        >
            <Search />
            <h1 className='mb-4 stylish'>New Arrivals</h1>

            <ProductSlider productArray={productsByArrival} token={token} />

            <h1 className='mb-4 stylish'>Best Sellers</h1>

            <ProductSlider productArray={productsBySell} token={token} />
        </Layout>
    );
};

export default Home;
