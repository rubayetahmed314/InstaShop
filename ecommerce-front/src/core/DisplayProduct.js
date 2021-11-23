import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
    Card,
    CardImg,
    CardBody,
    CardHeader,
    CardFooter,
    Badge,
    Button,
} from "reactstrap";
import StarRatings from "react-star-ratings";
import { API } from "../config";
import moment from "moment";
import { addItem, updateItem, removeItem } from "./cartHelpers";

const DisplayProduct = ({
    product,
    showViewProductButton = true,
    showAddToCartButton = true,
    cartUpdate = false,
    showRemoveProductButton = false,
    showDescription = false,
    singleProduct = false,
    fromCart = false,
    setRun = f => f,
    run = undefined,
    token = null,
    // changeCartSize
}) => {
    // const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = showViewProductButton => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`}>
                    <button className='btn btn-primary mt-2 mb-2 mr-2'>
                        <b>View Product</b>
                    </button>
                </Link>
            )
        );
    };
    const addToCart = () => {
        // console.log('added');
        // addItem(product, setRedirect(false));
        addItem(product);
    };

    /* const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to='/cart' />;
        }
    }; */

    const showAddToCartBtn = (showAddToCartButton, quantity) => {
        return (
            showAddToCartButton && (
                <button
                    onClick={addToCart}
                    className={
                        singleProduct
                            ? "btn btn-success btn-block mt-0 mb-2"
                            : "btn btn-success mt-2 mb-2"
                    }
                    style={{ fontSize: singleProduct ? "125%" : "100%" }}
                    disabled={quantity <= 0}
                >
                    <b>Add to Cart</b>
                </button>
            )
        );
    };

    const showStock = quantity => {
        return quantity > 0 ? (
            <span className='badge badge-primary badge-pill'>In Stock </span>
        ) : (
            <span className='badge badge-danger badge-pill'>Out of Stock </span>
        );
    };

    const handleChange = productId => event => {
        setRun(!run); // run useEffect in parent Cart
        setCount(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    };

    const showCartUpdateOptions = cartUpdate => {
        return (
            cartUpdate && (
                <div>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <span className='input-group-text'>
                                <b>Adjust Quantity</b>
                            </span>
                        </div>
                        <input
                            type='number'
                            className='form-control'
                            value={count}
                            onChange={handleChange(product._id)}
                        />
                    </div>
                </div>
            )
        );
    };
    const showRemoveButton = showRemoveProductButton => {
        return (
            showRemoveProductButton && (
                <button
                    onClick={() => {
                        removeItem(product._id);
                        setRun(!run); // run useEffect in parent Cart
                    }}
                    className='btn btn-danger mt-2 mb-2'
                >
                    <b>Remove Product</b>
                </button>
            )
        );
    };
    return (
        <div>
            <Card className={singleProduct ? "ml-auto mr-0 review" : "mx-2"}>
                <CardHeader
                    className='card-title text-white py-2'
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    <div className='row align-items-center'>
                        <div
                            className={
                                singleProduct || fromCart
                                    ? "col-12 text-center px-0 stylish"
                                    : "col-12 text-center px-0"
                            }
                            style={{
                                fontSize:
                                    singleProduct || fromCart ? "175%" : "100%",
                            }}
                        >
                            <strong>{product.name}</strong>
                        </div>
                    </div>
                    <div className='row align-items-center'>
                        <div className='col-4 text-left pr-0 pl-1'>
                            {showStock(product.quantity)}
                        </div>
                        <div className='col-8 text-right pl-0 pr-1'>
                            <StarRatings
                                rating={product.avg_rating}
                                starRatedColor='orange'
                                //   changeRating={this.changeRating}
                                numberOfStars={5}
                                starDimension='15px'
                                starSpacing='3px'
                                name='rating'
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className='p-0'>
                    {singleProduct ? (
                        <div className='p-3'>
                            <h5>
                                <b>Description</b>
                            </h5>
                            <p className='card-p mt-2 mb-0'>
                                {product.description.substring(0, 100)}{" "}
                            </p>
                        </div>
                    ) : (
                        <CardImg
                            width='100%'
                            height='250vw'
                            alt='photo'
                            src={`${API}/product/photo/${product._id}`}
                            style={{ objectFit: "cover" }}
                        />
                    )}
                </CardBody>
                <CardFooter
                    className='bg-dark text-white py-2'
                    /* style={{
            textTransform: 'uppercase',
        }} */
                >
                    {showDescription ? (
                        <div>
                            <p className='card-p text-white'>
                                <strong>Price:</strong> $ {product.price}
                            </p>
                            <p className='text-white'>
                                <strong>Category:</strong>{" "}
                                {product.category && product.category.name}
                            </p>
                            <p className='text-white'>
                                Added on {moment(product.createdAt).fromNow()}
                            </p>
                        </div>
                    ) : null}
                    <div
                        className={!fromCart ? "m-auto" : ""}
                        style={{
                            width: singleProduct ? "100%" : "fit-content",
                        }}
                    >
                        {showViewButton(showViewProductButton)}

                        {showAddToCartBtn(
                            showAddToCartButton,
                            product.quantity
                        )}
                    </div>

                    {showRemoveButton(showRemoveProductButton)}

                    {showCartUpdateOptions(cartUpdate)}
                </CardFooter>
            </Card>
        </div>
    );
};

export default DisplayProduct;
