import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import dateFormat from "dateformat";
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

const DisplayRating = ({ rating }) => {
    return (
        <div>
            <Card className='mr-4 review'>
                <CardHeader className='card-title bg-dark text-white py-2'>
                    <div className='row align-items-center'>
                        <div
                            className='col-6'
                            // style={{ border: "1px solid red" }}
                        >
                            {rating.user.name}
                        </div>
                        <div
                            className='col-6 text-right'
                            // style={{ border: "1px solid red" }}
                        >
                            <StarRatings
                                rating={rating.rating}
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
                <CardBody
                    className='py-4 text-center'
                    style={{
                        fontSize: "150%",
                    }}
                >
                    {rating.review}
                </CardBody>
                <CardFooter
                    className='bg-dark text-white py-2'
                    /* style={{
            textTransform: 'uppercase',
        }} */
                >
                    <small>
                        <p className='mb-0 text-center'>
                            {"on "}
                            {dateFormat(
                                rating.date,
                                "dddd, mmmm dS, yyyy, h:MM TT"
                            )}
                        </p>
                    </small>
                </CardFooter>
            </Card>
        </div>
    );
};

export default DisplayRating;
