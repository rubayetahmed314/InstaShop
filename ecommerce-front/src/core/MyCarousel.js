import React from "react";

const MyCarousel = () => (
    <div
        id='carouselExampleCaptions'
        className='carousel slide mb-4'
        data-ride='carousel'
    >
        <ol className='carousel-indicators'>
            <li
                data-target='#carouselExampleCaptions'
                data-slide-to='0'
                className='active'
            ></li>
            <li data-target='#carouselExampleCaptions' data-slide-to='1'></li>
            <li data-target='#carouselExampleCaptions' data-slide-to='2'></li>
        </ol>
        <div className='carousel-inner navbar-bg'>
            <div className='carousel-item active'>
                <img
                    src={process.env.PUBLIC_URL + "/offer1.jpg"}
                    className='img-fluid d-block mx-auto'
                    alt='...'
                />
                {/* <div className='carousel-caption d-none d-block'>
                    <h5>First slide label</h5>
                    <p>
                        Some representative placeholder content for the first
                        slide.
                    </p>
                </div> */}
            </div>
            <div className='carousel-item'>
                <img
                    src={process.env.PUBLIC_URL + "/offer2.jpg"}
                    className='img-fluid d-block mx-auto'
                    alt='...'
                />
                {/* <div className='carousel-caption d-none d-block'>
                    <h5>Second slide label</h5>
                    <p>
                        Some representative placeholder content for the second
                        slide.
                    </p>
                </div> */}
            </div>
            <div className='carousel-item'>
                <img
                    src={process.env.PUBLIC_URL + "/offer3.png"}
                    className='img-fluid d-block mx-auto'
                    alt='...'
                />
                {/* <div className='carousel-caption d-none d-block'>
                    <h5>Third slide label</h5>
                    <p>
                        Some representative placeholder content for the third
                        slide.
                    </p>
                </div> */}
            </div>
        </div>
        <a
            className='carousel-control-prev'
            href='#carouselExampleCaptions'
            role='button'
            data-slide='prev'
        >
            <span
                className='carousel-control-prev-icon'
                aria-hidden='true'
            ></span>
            <span className='sr-only'>Previous</span>
        </a>
        <a
            className='carousel-control-next'
            href='#carouselExampleCaptions'
            role='button'
            data-slide='next'
        >
            <span
                className='carousel-control-next-icon'
                aria-hidden='true'
            ></span>
            <span className='sr-only'>Next</span>
        </a>
    </div>
);

export default MyCarousel;
