import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { isAuthenticated, subscribe } from "../auth";
import { read, setSubscriber } from "../user/apiUser";

/*
    import{ init } from 'emailjs-com';
    init("user_AbEPcnTbClwNQerD5ITTx");
*/

// User ID: user_AbEPcnTbClwNQerD5ITTx
// Access Token: f9753c17604fdac47303800d31c3a818

const Contact = () => {
    const [fullUser, setFullUser] = useState(null);
    // const [showContact, setShowContact] = useState(true);

    const loggedIn = isAuthenticated();

    const { user } = loggedIn
        ? loggedIn
        : {
              user: null,
          };

    const token = loggedIn ? loggedIn.token : null;

    const init = (userId, token) => {
        read(userId, token)
            .then(data => {
                // console.log("DATA:", data);
                setFullUser(data);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        if (token) init(user._id, token);
    }, []);

    /* useEffect(() => {
        if (token) init(user._id, token);
    }, [showContact]); */

    let email = React.createRef();

    const subscribeNow = event => {
        // console.log(event.target);
        event.preventDefault();

        if (!token) {
            console.log(email.current.value);
            subscribe(email.current.value, false)
                .then(data => console.log(data))
                .catch(error => console.log(error));
            event.target.reset();
        } else {
            // setShowContact(false);
            subscribe(user.email, true)
                .then(data => console.log(data))
                .catch(error => console.log(error));

            setSubscriber(user._id, token)
                .then(data => console.log(data))
                .catch(error => console.log(error));
        }

        emailjs
            .send(
                "service_nd5qufa",
                "template_9rnztsd",
                {
                    from_name: "InstaShop",
                    to_name: "Tusher",
                    message: "You have been subscribed!",
                },
                "user_AbEPcnTbClwNQerD5ITTx"
            )
            .then(
                result => {
                    console.log(result.text);
                },
                error => {
                    console.log(error.text);
                }
            );
    };

    return fullUser && fullUser.isSubscribed ? null : (
        <div>
            <div className='my-5' style={{ height: "50px" }}></div>
            <div className='container-fluid contact-bg mt-0' id='Contact'>
                <div className='container-fluid px-md-5 py-3'>
                    <div className='text-center mb-5'>
                        <h1 className='text-white'>Get in Touch!</h1>
                        <h5 className='text-light'>
                            We'll send you an Email update of any Offer or New
                            Products
                        </h5>
                    </div>

                    {token ? null : (
                        <div className='my-3'>
                            <h3 className='text-white'>
                                Subscribe to our Newsletter
                            </h3>
                        </div>
                    )}

                    <div>
                        <form onSubmit={subscribeNow}>
                            {token ? null : (
                                <div className='row mb-3'>
                                    <div className='col'>
                                        <input
                                            type='text'
                                            className='form-control inner-form-bg'
                                            placeholder='Your E-mail'
                                            ref={email}
                                        />
                                    </div>
                                </div>
                            )}
                            <button
                                type='submit'
                                className={
                                    token
                                        ? "btn btn-lg btn-block btn-success p-2"
                                        : "btn btn-success p-2"
                                }
                            >
                                {token
                                    ? "Subscribe to our Newsletter"
                                    : "Subscribe"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Contact;
