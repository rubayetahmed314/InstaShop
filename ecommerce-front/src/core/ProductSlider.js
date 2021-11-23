import React, { useState, useEffect } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import DisplayProduct from "./DisplayProduct";
import DisplayRating from "./DisplayRating";

/* const ButtonGroup = ({ next, previous, ...rest }) => {
    const {
        carouselState: { currentSlide, totalItems, slidesToShow },
    } = rest;

    return (
        <div className='carousel-button-group'>
            <button
                aria-label='Go to previous slide'
                className={
                    currentSlide === 0
                        ? "disable"
                        : "react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
                }
                onClick={() => previous()}
            ></button>
            <button
                aria-label='Go to next slide'
                className={
                    currentSlide === totalItems - slidesToShow
                        ? "disable"
                        : "react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
                }
                onClick={() => next()}
            ></button>
        </div>
    );
}; */

// className='col-lg-3 col-md-4 col-sm-6 mb-3'
const ProductSlider = ({
    productArray = [],
    ratingArray = [],
    token,
    centerMode = false,
    showRating = false,
    fromCart = false,
    relatedProducts = false,
    setRun = f => f,
    run = undefined,
}) => {
    // console.log("Here:", productArray, token);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [displayRatings, setDisplayRatings] = useState([]);

    useEffect(() => {
        if (!showRating && productArray) {
            let products = productArray.map(product => (
                <DisplayProduct
                    key={product._id}
                    product={product}
                    showAddToCartButton={token && !fromCart ? true : false}
                    showDescription={fromCart}
                    cartUpdate={fromCart}
                    showRemoveProductButton={fromCart}
                    fromCart={fromCart}
                    setRun={setRun}
                    run={run}
                />
            ));

            // console.log("Final:", products);
            setDisplayProducts(products);
        }
    }, [productArray, token]);

    useEffect(() => {
        if (showRating && ratingArray) {
            ratingArray = ratingArray.slice(
                ratingArray.length >= 10 ? ratingArray.length - 10 : 0,
                ratingArray.length
            );
            let ratings = ratingArray.map(rating => (
                <DisplayRating key={rating.date} rating={rating} />
            ));
            // console.log("Final:", products);
            setDisplayRatings(ratings);
        }
    }, [ratingArray, token]);

    /*
        <RelatedProduct
                name='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            */
    return (
        <div
            style={{
                paddingBottom: "30px",
                position: "relative",
                // border: "2px solid blue",
            }}
        >
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlay={showRating}
                autoPlaySpeed={3000}
                centerMode={centerMode}
                className=''
                containerClass='container-with-dots'
                // customLeftArrow={<CustomLeftArrow />}
                // customRightArrow={<CustomRightArrow />}
                dotListClass=''
                draggable
                focusOnSelect={false}
                infinite={true}
                itemClass=''
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={showRating || fromCart || relatedProducts}
                responsive={{
                    superLargeDesktop: {
                        // the naming can be any, depends on you.
                        breakpoint: { max: 4000, min: 3000 },
                        items: showRating || fromCart ? 1 : 5,
                        slidesToSlide: showRating || fromCart ? 1 : 5,
                        partialVisibilityGutter: 50,
                    },
                    desktop: {
                        breakpoint: {
                            max: 3000,
                            min: 1024,
                        },
                        items: showRating || fromCart ? 1 : 4,
                        slidesToSlide: showRating || fromCart ? 1 : 4,
                        partialVisibilityGutter: 40,
                    },
                    tablet: {
                        breakpoint: {
                            max: 1024,
                            min: 720,
                        },
                        items: showRating || fromCart ? 1 : 3,
                        slidesToSlide: showRating || fromCart ? 1 : 3,
                        partialVisibilityGutter: 30,
                    },
                    mobile: {
                        breakpoint: {
                            max: 720,
                            min: 480,
                        },
                        items: showRating || fromCart ? 1 : 2,
                        slidesToSlide: showRating || fromCart ? 1 : 2,
                        partialVisibilityGutter: 20,
                    },
                    smallMobile: {
                        breakpoint: {
                            max: 480,
                            min: 0,
                        },
                        items: showRating || fromCart ? 1 : 1,
                        slidesToSlide: showRating || fromCart ? 1 : 1,
                        partialVisibilityGutter: 10,
                    },
                }}
                showDots={showRating || fromCart || relatedProducts}
                sliderClass=''
                // slidesToSlide={1}
                swipeable
            >
                {showRating ? displayRatings : displayProducts}
            </Carousel>
        </div>
    );
};

export default ProductSlider;
