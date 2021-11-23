import React from "react";
import Menu from "./Menu";
import MyCarousel from "./MyCarousel";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollToTopButton from "./ScrollToTopButton";
import "../styles.css";

const Layout = ({
    title = "Title",
    description = "Description",
    isHome = false,
    className,
    children,
}) => {
    return (
        <div>
            <Menu />
            {!isHome ? (
                <div className='jumbotron'>
                    <h2 className='mt-md-n5 mt-sm-n5'>{title}</h2>
                    <p className='lead mb-0 mb-md-n5 mb-sm-n5'>{description}</p>
                </div>
            ) : (
                <MyCarousel />
            )}
            <div className={className}>{children}</div>
            <Contact />
            <Footer />
            <ScrollToTopButton />
        </div>
    );
};

export default Layout;
