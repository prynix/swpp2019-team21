import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { connect } from 'react-redux';
import { adpostActions } from '../../../store/actions/adpost.action';
import intro_first from '../../../assets/intro_first.jpg';
import './ArticleEdit.css';

class ArticleEdit extends Component {
    state = {
        title: 'Sample title',
        subtitle: 'Sample subtitle',
        duedate: '2001/01/16',
        content: '',
        id: 1,
        thumbnail: intro_first,
        imageURL: intro_first,
        valid: false,
        postUrl: null,
        postTag: [{ id: 1, name: 'iluvswpp' }],
        mockSuggestion: [
            { id: 3, name: 'Bananas' },
            { id: 4, name: 'Mango' },
            { id: 5, name: 'Lemons' },
            { id: 6, name: 'Apricots' }
        ]
    }; // should be props, not state

    componentDidMount() {
        this.props.ongetArticle(this.props.match.params.id);
    }

    titleChangeHandler = t => {
        this.setState({
            ...this.state,
            title: t.target.value
        });
    };

    subtitleChangeHandler = s => {
        this.setState({
            ...this.state,
            subtitle: s.target.value
        });
    };

    detailedChangeHandler = d => {
        this.setState({
            ...this.state,
            content: d.target.value
        });
    };

    changePictureHandler = p => {
        if (p.target.files[0]) {
            this.setState({
                ...this.state,
                thumbnail: p.target.files[0],
                imageURL: URL.createObjectURL(p.target.files[0])
            });
        }
    };

    editConfirmHandler = () => {
        if (!this.state.title) {
            alert('Title should not be empty');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        if (!this.state.subtitle) {
            alert('Subtitle should not be empty');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        if (!this.state.content) {
            alert('Content should not be empty');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        if (!this.state.postUrl) {
            alert('Ad url should not be empty');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        if (
            this.state.postUrl.toString().length < 9 ||
            (this.state.postUrl.toString().substring(0, 7) !== 'http://' &&
                this.state.postUrl.toString().substring(0, 8) !== 'https://')
        ) {
            alert('Ad url should start with http:// or https://');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        if (!this.state.imagePreviewUrl) {
            alert('You should upload image');
            this.setState({ ...this.state, currentPage: 1 });
            return;
        }
        const adpost = {
            title: this.state.postTitle,
            subtitle: this.state.postSubtitle,
            content: this.state.postExplain,
            image: [this.state.imagePreviewUrl],
            ad_link: this.state.postUrl,
            tags: this.article.tags
        };
        this.props.onputArticle(this.props.match.id, adpost);
    };
    render() {
        let imagePreview = null;
        let imagePreviewUrl = this.state.imagePreviewUrl;

        if (imagePreviewUrl) {
            imagePreview = (
                <img id="post-thumbnail-preview" src={imagePreviewUrl} />
            );
        }

        return (
            <div>
                {this.props.loaded && (
                    <div className="ArticleEdit">
                        <div className="edit-article-box">
                            <h1>Edit Article</h1>
                        </div>
                        <div className="configuration">
                            <div className="form-group" align="center">
                                <h3 className="form-label">Title</h3>
                                <input
                                    className="form-control"
                                    placeholder=" input title"
                                    id="post-title-input"
                                    onChange={this.titleChangeHandler}
                                    defaultValue={this.props.article.title}
                                    value={this.state.postTitle}
                                />
                            </div>
                            <p />
                            <br />
                            <div className="form-group" align="center">
                                <h3 className="form-label">Subtitle</h3>
                                <input
                                    className="form-control"
                                    placeholder=" input subtitle"
                                    id="post-subtitle-input"
                                    onChange={this.subtitleChangeHandler}
                                    defaultValue={this.props.article.subtitle}
                                    value={this.state.postSubtitle}></input>
                            </div>
                            <p />
                            <br />
                            <div className="form-group" align="center">
                                <h3 className="form-label">Ad Description</h3>
                                <textarea
                                    className="form-control"
                                    placeholder=" explain your ad"
                                    id="post-explain-input"
                                    onChange={this.detailedChangeHandler}
                                    defaultValue={this.props.article.content}
                                    value={this.state.content}></textarea>
                            </div>
                            <p />
                            <br />
                            <div className="form-group" align="center">
                                <h3 className="form-label">Select Thumbnail</h3>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="post-thumbnail-input"
                                    multiple={false}
                                    onChange={this.imageOnChange}
                                />
                                <div>{imagePreview}</div>
                            </div>
                            <p />
                            <br />
                            <div className="form-group" align="center">
                                <h3 className="form-label">Ad Url</h3>
                                <input
                                    className="form-control"
                                    placeholder=" input url of ad"
                                    id="post-url-input"
                                    onChange={this.urlChangeHandler}
                                    defaultValue={this.props.article.ad_link}
                                    value={this.state.postUrl}></input>
                            </div>
                            <p />
                            <br />
                            <button
                                className="btn btn-primary"
                                id="next-button"
                                onClick={this.editConfirmHandler}>
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        ongetArticle: id => dispatch(adpostActions.getAdpost(id)),
        onputArticle: (id, adpost) =>
            dispatch(adpostActions.putAdpost(id, adpost))
    };
};

const mapStateToProps = state => {
    return {
        loaded: !state.adpost.adpost_detailed_item.is_loading,
        article: state.adpost.adpost_detailed_item
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleEdit);
