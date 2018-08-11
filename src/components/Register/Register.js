import React, { Component } from "react";
import PropTypes from "prop-types";
//import reduxForm and Field
import { Field, reduxForm } from "redux-form";
//import connect mapStateToProps and mapDispatchToProps
import { connect } from "react-redux";
//import action for submit data (call api).
import { dataRegisterSubmit } from "../../actions/register";
//import route
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { Redirect } from "react-router-dom";
import "icheck/skins/all.css"; // or single skin css

import { Radio, RadioGroup } from "react-icheck";

// define object state
const registerState = {
    fname: "",
    email: "",
    password: "",
    rconfirmpassword: "",
    lastname: "",
    gender: "male",
    dob: "",
    isPasswordPopupDisplay: false,
    validation: {
        isSpaceValidation: false,
        isMaxLength: false,
        isUppercase: false,
        isLowercase: false,
        isNumber: false,
    },
};

// field render for code define
const renderField = ({ input, width, className, placeholder, label, type, meta: { touched, error, warning } }) => (
    <div>
        <input {...input} style={{ width }} className={className} placeholder={placeholder} type={type} />
        {touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
);

const renderDatePicker = ({
    input,
    width,
    className,
    placeholder,
    defaultValue,
    meta: { touched, error, warning },
}) => (
    <div style={{ width }}>
        <DatePicker
            {...input}
            style={{ width }}
            dateForm="MM/DD/YYYY"
            className={className}
            selected={input.value ? moment(input.value) : null}
        />
        {touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
);

//define validate function with value  as argument
const validate = values => {
    const errors = {};

    //password Required and format validation
    if (!values.password) {
        errors.password = "Password is required.";
    } else if (!/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z]).*$/.test(values.password)) {
        errors.password = "Critearea does not fill";
    }

    //email Required and format validation
    if (!values.email) {
        errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address.";
    }

    //confirmpassword Required and format validation
    if (!values.rconfirmpassword) {
        errors.rconfirmpassword = "Confirm password is required.";
    } else if (values.rconfirmpassword != values.password) {
        errors.rconfirmpassword = "Passwrod and Confirm Password doesn't match.";
    }

    //dob Required validation
    if (!values.dob) {
        errors.dob = "Date of birth is required.";
    }

    //fname Required validation
    if (!values.fname) {
        errors.fname = "First name is required.";
    }

    //lname Required validation
    if (!values.lastname) {
        errors.lastname = "Last name is required";
    }

    return errors;
};

//define class Register
class Register extends Component {
    //define constructor
    constructor(props) {
        super(props);
        //state is initialize with  registerState object
        this.state = registerState;
    }

    //define register method with event as argument, when change input then call
    register = event => {
        //get changed value input name
        let inputName = event.target.name;
        //get changed value input value
        let inputValue = event.target.value;
        //set update input value in state
        this.setState({ [inputName]: inputValue });

        if (inputName == "password") {
            let stateCopy = { ...this.state };
            if (/^[^\s]+(\s+[^\s]+)*$/.test(inputValue)) {
                stateCopy.validation["isSpaceValidation"] = true;
                this.setState(stateCopy);
            } else {
                stateCopy.validation["isSpaceValidation"] = false;
                this.setState(stateCopy);
            }

            if (inputValue.length > 7) {
                stateCopy.validation["isMaxLength"] = true;
                this.setState(stateCopy);
            } else {
                stateCopy.validation["isMaxLength"] = false;
                this.setState(stateCopy);
            }

            if (/[A-Z]/.test(inputValue)) {
                stateCopy.validation["isUppercase"] = true;
                this.setState(stateCopy);
            } else {
                stateCopy.validation["isUppercase"] = false;
                this.setState(stateCopy);
            }

            if (/[a-z]/.test(inputValue)) {
                stateCopy.validation["isLowercase"] = true;
                this.setState(stateCopy);
            } else {
                stateCopy.validation["isLowercase"] = false;
                this.setState(stateCopy);
            }

            if (inputValue.match(/\d+/g)) {
                stateCopy.validation["isNumber"] = true;
                this.setState(stateCopy);
            } else {
                stateCopy.validation["isNumber"] = false;
                this.setState(stateCopy);
            }
        }
    };

    dateChanged = d => {
        this.setState({ ["date"]: d });
        let loginCopy = { ...this.state };
        loginCopy["date"] = d;
        this.setState(loginCopy);
        // this.setState({ ["dob"]: d });
        console.log("state: ", this.state);
    };

    //submit form handling
    submitRegister = event => {
        event.preventDefault();
        //submitRegisterData(method called with state as argument) dispatch to mapDispatchToProps
        this.props.submitRegisterData(this.state);
    };

    passwordPopup = () => {
        setTimeout(() => {
            this.setState({ isPasswordPopupDisplay: !this.state.isPasswordPopupDisplay });
        }, 200);
    };

    render() {
        //props initialize (pristine, reset, submitting and invalid is default )
        const { dataRegisterSubmit, isRegister, pristine, reset, submitting, invalid } = this.props;
        if (isRegister) {
            console.log("Register successfully......", this.state.fname);
            // return <Redirect to="/display" props={this.state} />;
            return (
                <Redirect
                    to={{
                        pathname: "/display",
                        state: { fname: this.state.fname },
                    }}
                />
            );
        }

        let self = this;
        let validationKey = Object.keys(this.state.validation);
        let validationFilter = validationKey.filter(function(key) {
            return self.state.validation[key];
        });

        let validationPercentage = validationFilter.length * 20;

        return (
            <div className="row d-flex justify-content-center no-gutters bg-secondary" id="login-page">
                <div className="col-xl-4 col-lg-5 col-md-6 col-10">
                    <div className="my-5">
                        <div className="pt-4 d-flex justify-content-center">
                            <form id="register-form" onSubmit={this.submitRegister} method="POST" name="register-form">
                                <h2 className="mb-0 font-weight-normal text-center">Sign Up</h2>
                                <div className="row no-gutters hb-register">
                                    <label htmlFor="name" className="col-md-12 col-form-label text-md-left">
                                        Full Name
                                    </label>
                                    <div className="col-md-6 col-sm-6 mobile-pr-0 pb-2 hb-padding-right-8">
                                        <Field
                                            id="fname"
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            name="fname"
                                            onChange={this.register}
                                            component={renderField}
                                        />
                                    </div>
                                    <div className="col-md-6 col-sm-6">
                                        <Field
                                            id="lastname"
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            name="lastname"
                                            onChange={this.register}
                                            component={renderField}
                                        />
                                    </div>
                                </div>

                                <div className="row hb-register">
                                    <label
                                        htmlFor="email"
                                        className="col-md-12 col-form-label text-md-left"
                                        style={{ marginLeft: "-13px" }}
                                    >
                                        Your Email Adress
                                    </label>

                                    <Field
                                        id="reg-email"
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        width="453px"
                                        onChange={this.register}
                                        component={renderField}
                                    />
                                </div>

                                <div className="row hb-register password_criteria">
                                    <label
                                        htmlFor="password"
                                        className="col-md-12 col-form-label text-md-left"
                                        style={{ marginLeft: "-13px" }}
                                    >
                                        Create Your Password
                                    </label>

                                    <Field
                                        id="reg-password"
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        width="453px"
                                        onFocus={this.passwordPopup}
                                        onBlur={this.passwordPopup}
                                        onChange={this.register}
                                        component={renderField}
                                    />
                                    {this.state.isPasswordPopupDisplay && (
                                        <div className="criteria">
                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow="0"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                    style={{ width: validationPercentage + "%" }}
                                                >
                                                    <span className="sr-only">70% Complete</span>
                                                </div>
                                            </div>
                                            <h3> Criteria: </h3>
                                            <ul>
                                                <li
                                                    className={this.state.validation.isSpaceValidation ? "success" : ""}
                                                >
                                                    Password cannot start or end with a space
                                                </li>
                                                <li className={this.state.validation.isLowercase ? "success" : ""}>
                                                    Include a lower case letter
                                                </li>
                                                <li className={this.state.validation.isUppercase ? "success" : ""}>
                                                    Include a upper case letter
                                                </li>
                                                <li className={this.state.validation.isNumber ? "success" : ""}>
                                                    Include number
                                                </li>
                                                <li className={this.state.validation.isMaxLength ? "success" : ""}>
                                                    must Be 8 or more
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="row hb-register">
                                    <label
                                        htmlFor="password"
                                        className="col-md-12 col-form-label text-md-left"
                                        style={{ marginLeft: "-13px" }}
                                    >
                                        Confirm Password
                                    </label>

                                    <Field
                                        id="reg-confirm-password"
                                        type="password"
                                        className="form-control"
                                        name="rconfirmpassword"
                                        width="453px"
                                        onChange={this.register}
                                        component={renderField}
                                    />
                                </div>
                                <div className="row hb-register">
                                    <label
                                        htmlFor="password"
                                        className="col-md-12 col-form-label text-md-left "
                                        style={{ marginLeft: "-13px" }}
                                    >
                                        DOB
                                    </label>
                                    <Field
                                        id="dob"
                                        className="form-control"
                                        name="dob"
                                        width="453px"
                                        selected={this.state.date}
                                        onChange={this.dateChanged}
                                        component={renderDatePicker}
                                    />
                                </div>

                                <div className="row hb-register gender" style={{ marginTop: "7px" }}>
                                    <label style={{ width: "66px" }}> Gender:</label>
                                    <RadioGroup name="gender" value="3">
                                        <Radio
                                            value="male"
                                            style={{ width: "150px" }}
                                            radioClass="iradio_square-blue"
                                            increaseArea="20%"
                                            label="<span class='label1' style='width:15px;'>Male</span>"
                                        />
                                        <Radio
                                            value="female"
                                            style={{ width: "150px" }}
                                            radioClass="iradio_square-blue"
                                            increaseArea="20%"
                                            label="<span class='label1'>Female</span>"
                                        />
                                    </RadioGroup>
                                </div>

                                <div className="text-center mb-3 text-lowercase">
                                    <small />
                                </div>

                                <div className="mb-2 mobile-mx-1">
                                    <div className="hb-social-icons-wrapper text-center">
                                        <button
                                            type="submit"
                                            id="btn-submit"
                                            className="btn p-0"
                                            disabled={submitting | invalid}
                                        >
                                            <div className="login-boycott-bg-btn social-bg bg-primary d-flex justify-content-between align-items-center hb-fix-btn m-0 hb-login-fix-height">
                                                <div className="float-left social-icon-bg login-boycott-bg hb-login-fix-height">
                                                    <i className="fa fa-check" aria-hidden="true" />
                                                </div>
                                                <div className="hb-btn-text login-boycott mx-auto" id="btnSignup">
                                                    Sign Up For
                                                    <i
                                                        id="loading-submit-reg"
                                                        className="fa fa-circle-o-notch fa-spin ml-3 p-0 d-none"
                                                    />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <label> Already Have An Account?</label> <Link to="/">Log in Here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // connect state initialize here
        isRegister: state.LoginReducer.isRegister,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // connect action(method) initialize here
        submitRegisterData: data => dispatch(dataRegisterSubmit(data)),
    };
};

// Connected Component
const VisibleRegister = connect(
    mapStateToProps,
    mapDispatchToProps
);

//export Register class with connect variable and validate form.
export default VisibleRegister(reduxForm({ form: "Register", validate })(Register));
