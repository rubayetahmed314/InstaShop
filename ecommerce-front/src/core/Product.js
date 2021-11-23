import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Rating from "./Rating";
import { isAuthenticated } from "../auth";
import { read, listRelated } from "./apiCore";
import { getPurchaseHistory } from "../user/apiUser";
import DisplayProduct from "./DisplayProduct";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { API } from "../config";
import ProductSlider from "./ProductSlider";
import StarRatings from "react-star-ratings";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

const Product = props => {
    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [ratingStats, setRatingStats] = useState([0, 0, 0, 0, 0]);
    const [error, setError] = useState(false);
    const [hasUsed, setHasUsed] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
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
                setHistory(data.reverse());
                // console.log(data);
            }
        });
    };

    const loadSingleProduct = productId => {
        read(productId).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProduct(data);

                // console.log("DATA:", data);

                let ratingStats = [0, 0, 0, 0, 0];
                for (let rating of data.rating) {
                    // console.log(rating);
                    if (rating.rating === 1) {
                        ratingStats[0] += 1;
                    } else if (rating.rating === 2) {
                        ratingStats[1] += 1;
                    } else if (rating.rating === 3) {
                        ratingStats[2] += 1;
                    } else if (rating.rating === 4) {
                        ratingStats[3] += 1;
                    } else if (rating.rating === 5) {
                        // console.log("HERE!!!", ratingStats[4]);
                        ratingStats[4] += 1;
                        // console.log("THERE!!!", ratingStats);
                    }
                }

                setRatingStats(ratingStats);

                // ratingStats = ratingStats.map(ratingFrequency => (ratingFrequency*100)/data.rating.length);

                if (token) {
                    for (let transaction of history) {
                        // console.log(transaction);
                        if (transaction.status === "Delivered") {
                            for (let product of transaction.products) {
                                if (product._id === productId) {
                                    console.log(product.name);
                                    setHasUsed(true);
                                    break;
                                }
                            }
                        }
                    }

                    for (let rating of data.rating) {
                        if (rating.user._id === user._id) {
                            // console.log("GOT HIM!");
                            setHasUsed(false);
                            break;
                        }
                    }
                }

                // fetch related products
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setRelatedProduct(data);
                    }
                });
            }
        });
    };

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    useEffect(() => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        if (token) init(user._id, token);
    }, [props]);

    useEffect(() => {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props, history]);

    useEffect(() => {
        if (!modalOpen) {
            const productId = props.match.params.productId;
            loadSingleProduct(productId);
        }
    }, [modalOpen]);

    useEffect(() => {
        console.log("PRODUCT:", product);
    }, [product]);

    useEffect(() => {
        console.log("RATING:", ratingStats);
    }, [ratingStats]);

    let progressBars = [0, 0, 0, 0, 0];
    if (product && product.rating) {
        progressBars = ratingStats.map(
            ratingFrequency => (ratingFrequency * 100) / product.rating.length
        );
    }

    return (
        <Layout
            title={product && product.name}
            description={
                product &&
                product.description &&
                product.description.substring(0, 100)
            }
            className='container'
        >
            <div
                className='row mb-4 align-items-center'
                // style={{ border: "2px solid red" }}
            >
                <div
                    className='col-md-3 col-sm-12 px-0 review'
                    style={{
                        paddingBottom: "30px",
                        position: "relative",
                        // border: "2px solid blue",
                    }}
                >
                    <Carousel
                        additionalTransfrom={0}
                        arrows
                        // autoPlay
                        autoPlaySpeed={3000}
                        centerMode={false}
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
                        renderDotsOutside={true}
                        responsive={{
                            superLargeDesktop: {
                                // the naming can be any, depends on you.
                                breakpoint: { max: 4000, min: 3000 },
                                items: 1,
                                slidesToSlide: 1,
                                partialVisibilityGutter: 50,
                            },
                            desktop: {
                                breakpoint: {
                                    max: 3000,
                                    min: 1024,
                                },
                                items: 1,
                                slidesToSlide: 1,
                                partialVisibilityGutter: 40,
                            },
                            tablet: {
                                breakpoint: {
                                    max: 1024,
                                    min: 720,
                                },
                                items: 1,
                                slidesToSlide: 1,
                                partialVisibilityGutter: 30,
                            },
                            mobile: {
                                breakpoint: {
                                    max: 720,
                                    min: 480,
                                },
                                items: 1,
                                slidesToSlide: 1,
                                partialVisibilityGutter: 20,
                            },
                            smallMobile: {
                                breakpoint: {
                                    max: 480,
                                    min: 0,
                                },
                                items: 1,
                                slidesToSlide: 1,
                                partialVisibilityGutter: 10,
                            },
                        }}
                        showDots={true}
                        sliderClass=''
                        // slidesToSlide={1}
                        swipeable
                    >
                        <img
                            className='img-fluid'
                            width='100%'
                            height='100%'
                            alt='photo'
                            src={
                                product._id != undefined
                                    ? `${API}/product/photo/${product._id}`
                                    : null
                            }
                            style={{ objectFit: "cover" }}
                        />
                        <img
                            className='img-fluid'
                            width='100%'
                            height='100%'
                            alt='photo'
                            src={
                                product._id != undefined
                                    ? `https://cdn01.sapnaonline.com/product_media/9789352134755/md_9789352134755.jpg`
                                    : null
                            }
                            style={{ objectFit: "cover" }}
                        />
                    </Carousel>
                </div>

                <div
                    className='col-md-2'
                    // style={{ border: "1px solid green" }}
                >
                    {" "}
                </div>

                <div
                    className='col-md-7 col-sm-12 px-0'
                    // style={{ border: "1px solid green" }}
                >
                    <div className='row mb-3'>
                        <div className='col-12'>
                            {product && product.description && (
                                <DisplayProduct
                                    product={product}
                                    showViewProductButton={false}
                                    showAddToCartButton={token ? true : false}
                                    showDescription={true}
                                    singleProduct={true}
                                />
                            )}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <Button
                                style={{ fontSize: "125%" }}
                                disabled={!hasUsed}
                                color='warning'
                                className='btn-block'
                                onClick={toggleModal}
                            >
                                <strong>Leave a Rating</strong>
                            </Button>
                        </div>

                        <Modal
                            isOpen={modalOpen}
                            style={{
                                position: "relative",
                                top: "25px",
                                alignContent: "center",
                            }}
                        >
                            <ModalBody>
                                <Rating
                                    product={product}
                                    user={user}
                                    token={token}
                                    toggleModal={toggleModal}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color='secondary' onClick={toggleModal}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
            </div>

            <div
                className='row mb-4 review'
                style={{
                    border: "1px solid grey",
                    borderRadius: "11px 11px 0px 0px",
                }}
            >
                <div className='col-12 px-0 mb-0'>
                    <h4
                        className='stylish pl-3 py-3 mb-3 bg-dark text-white'
                        style={{
                            // border: "1px solid blue",
                            borderRadius: "10px 10px 0px 0px",
                        }}
                    >
                        Related Products
                    </h4>
                    <ProductSlider
                        productArray={relatedProduct}
                        token={token}
                        centerMode={false}
                        relatedProducts={true}
                    />
                </div>
            </div>

            <div
                className='row review'
                style={{
                    border: "1px solid grey",
                    borderRadius: "11px 11px 0px 0px",
                }}
            >
                <div className='col-12'>
                    <div className='row'>
                        <div
                            className='col-12 px-0 mb-0 card-title'
                            style={{
                                // border: "1px solid blue",
                                borderRadius: "10px 10px 0px 0px",
                            }}
                        >
                            <h4 className='stylish pl-3 pt-3 pb-2' style={{}}>
                                {"Rating & Reviews"}
                            </h4>
                        </div>
                    </div>
                    <div
                        className='row py-3 mb-4 bg-dark'
                        /* style={{
                            border: "2px solid green",
                            borderRadius: "10px",
                        }} */
                    >
                        <div
                            className='col-6 text-center px-3 bg-dark text-white'
                            /* style={{
                                border: "1px solid blue",
                                borderRadius: "5px",
                            }} */
                        >
                            <h2>
                                {product && product.avg_rating
                                    ? Number(product.avg_rating).toFixed(3)
                                    : 0}
                            </h2>
                            <StarRatings
                                rating={
                                    product && product.avg_rating
                                        ? product.avg_rating
                                        : 0
                                }
                                starRatedColor='orange'
                                //   changeRating={this.changeRating}
                                numberOfStars={5}
                                starDimension='15px'
                                starSpacing='3px'
                                name='rating'
                            />
                            <h5>
                                Based on{" "}
                                {product.rating ? product.rating.length : 0}{" "}
                                reviews
                            </h5>
                        </div>
                        <div
                            className='col-6 text-center px-3 bg-dark text-white'
                            /* style={{
                                border: "1px solid red",
                                borderRadius: "5px",
                            }} */
                        >
                            <div className='row align-items-center'>
                                <div
                                    className='col-2 px-0 text-center'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    5 Star
                                </div>
                                <div
                                    className='col-10 pl-1'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    <div className='progress'>
                                        <div
                                            className='progress-bar bg-success'
                                            role='progressbar'
                                            style={{
                                                width: `${progressBars[4]}%`,
                                            }}
                                            aria-valuenow={progressBars[4]}
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            {Number(progressBars[4]).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row align-items-center'>
                                <div
                                    className='col-2 px-0 text-center'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    4 Star
                                </div>
                                <div
                                    className='col-10 pl-1'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    <div className='progress'>
                                        <div
                                            className='progress-bar bg-primary'
                                            role='progressbar'
                                            style={{
                                                width: `${progressBars[3]}%`,
                                            }}
                                            aria-valuenow={progressBars[3]}
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            {Number(progressBars[3]).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row align-items-center'>
                                <div
                                    className='col-2 px-0 text-center'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    3 Star
                                </div>
                                <div
                                    className='col-10 pl-1'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    <div className='progress'>
                                        <div
                                            className='progress-bar bg-info'
                                            role='progressbar'
                                            style={{
                                                width: `${progressBars[2]}%`,
                                            }}
                                            aria-valuenow={progressBars[2]}
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            {Number(progressBars[2]).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row align-items-center'>
                                <div
                                    className='col-2 px-0 text-center'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    2 Star
                                </div>
                                <div
                                    className='col-10 pl-1'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    <div className='progress'>
                                        <div
                                            className='progress-bar bg-warning'
                                            role='progressbar'
                                            style={{
                                                width: `${progressBars[1]}%`,
                                            }}
                                            aria-valuenow={progressBars[1]}
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            {Number(progressBars[1]).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='row align-items-center'>
                                <div
                                    className='col-2 px-0 text-center'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    1 Star
                                </div>
                                <div
                                    className='col-10 pl-1'
                                    // style={{ border: "1px solid blue" }}
                                >
                                    <div className='progress'>
                                        <div
                                            className='progress-bar bg-danger'
                                            role='progressbar'
                                            style={{
                                                width: `${progressBars[0]}%`,
                                            }}
                                            aria-valuenow={progressBars[0]}
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            {Number(progressBars[0]).toFixed(1)}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div
                            className='col-12 px-0'
                            /* style={{
                                border: "2px solid red",
                                borderRadius: "10px",
                            }} */
                        >
                            {product &&
                            product.rating &&
                            product.rating.length ? (
                                <ProductSlider
                                    showRating={true}
                                    ratingArray={product.rating}
                                    token={token}
                                    centerMode={true}
                                />
                            ) : (
                                <h2 className='text-center'>
                                    No reviews yet. Be the first one to review
                                    this product!
                                </h2>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Product;
