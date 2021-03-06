import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import profile from './../../assets/iu_profile.png';
import { history } from '../../store';
import { userActions } from '../../store/actions';
import TopMenuPopUp from './TopMenuPopUp';
import TagSelector from '../../containers/TagSelector/TagSelector';
import './TopMenu.css';

class TopMenu extends Component {
    state = {
        sign_in: true,
        user: {
            pic: profile,
            name: 'JIEUN',
            point: 65535
        },
        searchkey: null
    };

    componentDidMount() {
        if (localStorage.getItem('logged_in') === 'true') {
            this.props.reloadUser();
        }
    }

    componentDidUpdate() {
        if (!this.props.user) {
            this.props.reloadUser();
        }
    }

    signInHandler = () => {
        history.push('/signin');
    };

    clickHomeHandler = () => {
        history.push('/home');
    };

    clickSignOutHandler = () => {
        this.props.onsignOut();
    };

    clickMyPageHandler = () => {
        history.push('/mypage');
    };

    newArticleHandler = () => {
        history.push('/article/create');
    };

    render() {
        return (
            <div className="TopMenu">
                <Navbar id="UserInfo" fixed="top">
                    <h1
                        id="AditTitle"
                        align="left"
                        onClick={this.clickHomeHandler}>
                        Adit
                    </h1>
                    <TagSelector />
                    {this.props.logged_in && (
                        <a id="ad-add-btn" onClick={this.newArticleHandler}>
                            + New Post
                        </a>
                    )}
                    {this.props.logged_in && this.props.user && (
                        <TopMenuPopUp
                            id="pop-up-menu"
                            user={this.props.user}
                            mypageHandler={this.clickMyPageHandler}
                            signOutHandler={this.clickSignOutHandler}
                        />
                    )}
                    {!this.props.logged_in && (
                        <a id="sign-in-btn" onClick={this.signInHandler}>
                            Sign In
                        </a>
                    )}
                </Navbar>
            </div>
        );
    }
}

export const mapStateToProps = state => {
    return {
        logged_in: state.user.logged_in,
        user: state.user.user
    };
};

export const mapDispatchToProps = dispatch => {
    return {
        onsignOut: () => dispatch(userActions.signOut()),
        reloadUser: () => dispatch(userActions.getUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
