import React from "react";
import { submitRating } from "./apiCore";

function StarIcon(props) {
    const { fill = "none" } = props;
    return (
        <svg
            // className='w-6 h-6'
            style={{ width: "5rem", height: "4rem" }}
            fill={fill}
            stroke='black'
            viewBox='0 0 21 21'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                strokeLinecap='miter'
                strokeLinejoin='miter'
                strokeWidth='1'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
            ></path>
        </svg>
    );
}

function RatingIcon(props) {
    const {
        index,
        rating,
        hoverRating,
        onMouseEnter,
        onMouseLeave,
        onSaveRating,
    } = props;
    const fill = React.useMemo(() => {
        if (hoverRating >= index) {
            if (hoverRating < 2) return "red";
            else if (hoverRating < 3) return "orange";
            else if (hoverRating < 4) return "yellow";
            else if (hoverRating < 5) return "cyan";
            else return "green";
        } else if (!hoverRating && rating >= index) {
            if (rating < 2) return "red";
            else if (rating < 3) return "orange";
            else if (rating < 4) return "yellow";
            else if (rating < 5) return "cyan";
            else return "green";
        }
        return "none";
    }, [rating, hoverRating, index]);
    return (
        <div
            className='cursor-pointer'
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={() => onMouseLeave()}
            onClick={() => onSaveRating(index)}
        >
            <StarIcon fill={fill} />
        </div>
    );
}

const Rating = ({ product, user, token, toggleModal }) => {
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);

    let review = React.createRef();

    const handleSubmit = event => {
        event.preventDefault();

        console.log("Rating:", rating);
        console.log("Review:", review.current.value);

        // create Rating

        const ratingData = {
            rating: {
                user: user,
                rating: rating,
                review: review.current.value,
                date: new Date().toISOString(),
            },
            productId: product._id,
            avg_rating: product.avg_rating
                ? (rating + product.avg_rating * product.rating.length) /
                  (product.rating.length + 1)
                : rating,
        };

        submitRating(product._id, user._id, token, ratingData)
            .then(response => {
                console.log("Rating submitted sccessfully:", response);
                toggleModal();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onMouseEnter = index => {
        setHoverRating(index);
    };

    const onMouseLeave = () => {
        setHoverRating(0);
    };

    const onSaveRating = index => {
        setRating(index);
    };

    return (
        <div>
            <h4 className='stylish text-center'>
                Give a Rating {product.name}
            </h4>
            <div
                className='flex'
                style={{ width: "fit-content", margin: "auto" }}
            >
                {[1, 2, 3, 4, 5].map(index => {
                    return (
                        <RatingIcon
                            key={index}
                            index={index}
                            rating={rating}
                            hoverRating={hoverRating}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            onSaveRating={onSaveRating}
                        />
                    );
                })}
            </div>
            <br />
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <textarea
                        className='form-control'
                        name='review'
                        placeholder='Leave a Review'
                        ref={review}
                        rows='5'
                    />
                </div>
                <button type='submit' className='btn btn-primary'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Rating;
