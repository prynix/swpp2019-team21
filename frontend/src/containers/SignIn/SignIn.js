import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../store/actions';
import avatar from '../../assets/avatar.png';
import { ls } from '../../store';
import './SignIn.css';

class SignIn extends Component {
    async componentDidMount() {
        if (localStorage.getItem('logged_in') === 'true') {
            this.props.history.push('/home');
        }
        const user = await this.getRememberedUser();
        this.setState({
            email: user.useremail,
            password: user.userpw
        });
    }

    state = {
        email: '',
        password: '',
        remember: false
    };

    getRememberedUser = async () => {
        try {
            const useremail = await ls.get('useremail');
            const userpw = await ls.get('userpw');
            if (useremail !== '' && userpw !== '') {
                await this.setState({
                    ...this.state,
                    remember: true
                });
                return {
                    useremail: useremail,
                    userpw: userpw
                };
            } else {
                return {
                    useremail: '',
                    userpw: ''
                };
            }
        } catch (error) {
            return {
                useremail: '',
                userpw: ''
            };
        }
    };

    emailChangeHandler = e => {
        if (e.target.value.length <= 30) {
            this.setState({
                ...this.state,
                email: e.target.value
            });
        } else {
            alert('email too long!');
        }
    };

    passwordChangeHandler = e => {
        if (e.target.value.length <= 30) {
            this.setState({
                ...this.state,
                password: e.target.value
            });
        } else {
            alert('password too long!');
        }
    };

    signInHandler = () => {
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.onSignIn(user, this.state.remember);
    };

    signUpHandler = () => {
        this.props.history.push('/signup');
    };

    render() {
        return (
            <div className="sign-in">
                <div className="sign-in-form">
                    <div className="avatar">
                        <img src={avatar} className="sign-in-user-icon" />
                    </div>
                    <h2 className="text-center">Sign In!</h2>
                    <div className="form-group">
                        <input
                            className="form-control"
                            id="email-input"
                            placeholder="Email"
                            type="text"
                            value={this.state.email}
                            required="required"
                            onChange={this.emailChangeHandler}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            className="form-control"
                            id="pw-input"
                            type="password"
                            placeholder="Password"
                            value={this.state.password}
                            required="required"
                            onChange={this.passwordChangeHandler}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            id="signin-button"
                            onClick={() => this.signInHandler()}>
                            Sign in
                        </button>
                    </div>
                    <div className="clearfix">
                        <label className="remember">
                            <input
                                checked={this.state.remember}
                                type="checkbox"
                                id="remember-chkbox"
                                onChange={e => {
                                    this.setState({
                                        ...this.state,
                                        remember: e.target.checked
                                    });
                                }}
                            />
                            Remember me
                        </label>
                    </div>
                </div>
                <p className="text-center small">
                    Don't have an account?{' '}
                    <a href="#" id="signup-link" onClick={this.signUpHandler}>
                        Sign up here!
                    </a>
                </p>
            </div>
        );
    }
}

export const mapDispatchToProps = dispatch => {
    return {
        onSignIn: (user, remember) =>
            dispatch(userActions.signIn(user, remember))
    };
};

export default connect(null, mapDispatchToProps)(SignIn);
