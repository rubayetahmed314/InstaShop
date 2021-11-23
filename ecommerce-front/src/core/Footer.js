import React from 'react';

const Footer = () => (
    <div>
        <div className="container-fluid about-bg" id="Contact">
            <div className="container py-2">
                {/* <div>
                    <blockquote className="blockquote text-center text-white">
                        <p className="text-center"><q><em>Work hard in silence, let your success be your noise </em></q></p>
                        <footer className="blockquote-footer text-light">Someone famous in <cite title="Source Title">Source
                            Title</cite></footer>
                    </blockquote>
                </div> */}
                <div className="text-white">
                    <p className="text-center mb-0">&copy; All rights of this website reserved to <span style={{fontFamily: 'Lobster', fontSize:'150%'}}>InstaShop</span></p>
                {/* </div>
                <div className="row align-items-center"> */}
                    <div className="col text-center" style={{ fontSize: '200%' }}>
                        <a href="your link here" target="_blank" className="text-dark"><i className="fa fa-facebook"></i></a>
                        <span width="25px"> </span>
                        <a href="https://github.com/Ahmad-Tusher" target="_blank" rel="noopener noreferrer" className="text-dark"><i className="fa fa-github"></i></a>
                        <span width="25px"> </span>
                        <a href="your link here" target="_blank" className="text-dark"><i className="fa fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Footer;