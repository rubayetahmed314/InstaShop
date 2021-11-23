import React, { Component } from 'react';

class ScrollToTopButton extends Component {
    constructor(props) {
        super(props);

        this.mybutton = (
            <button
                onClick={this.topFunction}
                className='btn btn-danger'
                id='myBtn'
                style={{
                    display: 'none' /* Hidden by default */,
                    position: 'fixed' /* Fixed/sticky position */,
                    bottom: '20px' /* Place the button at the bottom of the page */,
                    right: '30px' /* Place the button 30px from the right */,
                    zIndex: 2 /* Make sure it does not overlap */,
                    fontSize: '18px' /* Increase font size */,
                }}
            >
                Scroll to Top
            </button>
        );
    }

    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    componentDidMount() {
        // When the user scrolls down 200px from the top of the document, show the button
        window.onscroll = () => {
            const mybutton = document.getElementById('myBtn');
            if (
                document.body.scrollTop > 200 ||
                document.documentElement.scrollTop > 200
            ) {
                mybutton.style.display = 'block';
            } else {
                mybutton.style.display = 'none';
            }
        };
    }

    render() {
        return this.mybutton;
    }
}

export default ScrollToTopButton;
