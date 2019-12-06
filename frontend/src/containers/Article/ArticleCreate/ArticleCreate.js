import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';
import { adpostActions, userActions, tagActions } from '../../../store/actions';
import ArticlePreview from '../ArticlePreview/ArticlePreview';
import './ArticleCreate.css';

var multiplier = 10;
class ArticleCreate extends Component {
    state = {
        donePage: 1,
        currentPage: 1,
        postTag: [],
        postTitle: '',
        postSubtitle: '',
        postExplain: '',
        postFile: '',
        postUrl: '',
        postGoal: '',
        postDeadline: {
            year: '',
            month: '',
            date: ''
        },
        needUrl: false,
        open_for_all: false,
        mockSuggestion: [
            { id: 3, name: 'Bananas' },
            { id: 4, name: 'Mango' },
            { id: 5, name: 'Lemons' },
            { id: 6, name: 'Apricots' }
        ],
        imagePreviewUrl: '',
        nowpoint: 0
    };

    componentDidMount() {
        this.props.reloadUser().then(res => {
            this.setState({
                nowpoint: res.user.point
            });
        });
        this.props.onTagReload();
    }

    handleDelete = i => {
        const tags = this.state.postTag.slice(0);
        tags.splice(i, 1);
        this.setState({ postTag: tags });
    };

    handleAddition = tag => {
        const tags = [].concat(this.state.postTag, tag);
        this.setState({ postTag: tags });
    };

    handleValidate = tag => {
        return (
            tag.name.length < 100 &&
            tag.name.match(/^[a-zA-Z가-힣]+$/) &&
            !this.state.postTag.map(item => item.name).includes(tag.name) &&
            this.state.postTag.length <= 15
        );
    };
    render() {
        let imagePreview = null;
        let imagePreviewUrl = this.state.imagePreviewUrl;
        if (imagePreviewUrl) {
            imagePreview = (
                <img id="post-thumbnail-preview" src={imagePreviewUrl} />
            );
        } else {
            imagePreview = (
                <div className="previewText">
                    <strong></strong>
                </div>
            );
        }

        const tabOnClick = n => {
            if (n <= this.state.donePage) {
                return () => {
                    this.setState({
                        ...this.state,
                        currentPage: n
                    });
                };
            } else {
                return () => {};
            }
        };
        const color = n => {
            if (n > this.state.donePage) {
                return 'Grey';
            } else {
                return '#fa4252';
            }
        };
        const tabtext = n => {
            let tempTabs = ['정보 입력', '태그 선택', '목표 설정', '제출'];
            if (this.state.currentPage == n) {
                return (
                    <text
                        id={'tab-text' + n}
                        style={{ color: color(n) }}
                        onClick={tabOnClick(n)}>
                        <strong>{tempTabs[n - 1]}</strong>
                    </text>
                );
            } else {
                return (
                    <text
                        id={'tab-text' + n}
                        style={{ color: color(n) }}
                        onClick={tabOnClick(n)}>
                        {' '}
                        {tempTabs[n - 1]}
                    </text>
                );
            }
        };
        const tabs = () => {
            return (
                <div id="createTabs">
                    {tabtext(1)}
                    <text> > </text>
                    {tabtext(2)}
                    <text> > </text>
                    {tabtext(3)}
                    <text> > </text>
                    {tabtext(4)}
                </div>
            );
        };
        const titleChangeHandler = i => {
            if (i.target.value.length <= 30) {
                this.setState({
                    ...this.state,
                    postTitle: i.target.value
                });
            } else {
                alert('제목은 30자를 넘을 수 없습니다');
            }
        };
        const subtitleChangeHandler = i => {
            if (i.target.value.length <= 30) {
                this.setState({
                    ...this.state,
                    postSubtitle: i.target.value
                });
            } else {
                alert('부제목은 30자를 넘을 수 없습니다');
            }
        };
        const explainChangeHandler = i => {
            if (i.target.value.length <= 10000) {
                this.setState({
                    ...this.state,
                    postExplain: i.target.value
                });
            } else {
                alert('설명은 10000자를 넘을 수 없습니다');
            }
        };
        const urlChangeHandler = i => {
            if (i.target.value.length <= 100) {
                this.setState({
                    ...this.state,
                    postUrl: i.target.value
                });
            } else {
                alert('Url은 100자를 넘을 수 없습니다');
            }
        };
        const imageOnChange = e => {
            e.preventDefault();

            let reader = new FileReader();
            let file = e.target.files[0];

            if (!file) {
                this.setState({
                    postFile: null,
                    imagePreviewUrl: null
                });
                return;
            }

            reader.onloadend = () => {
                this.setState({
                    postFile: file,
                    imagePreviewUrl: reader.result
                });
            };
            reader.readAsDataURL(file);
        };

        const goalChangeHandler = e => {
            const re = /^[0-9]*$/;

            if (
                (e.target.value == '' || re.test(e.target.value)) &&
                this.state.nowpoint - Number(e.target.value) * multiplier >= 0
            ) {
                this.setState({
                    ...this.state,
                    postGoal: e.target.value
                });
            } else if (!re.test(e.target.value)) {
                window.alert('숫자만 입력하세요');
            } else {
                window.alert('포인트가 부족합니다');
            }
        };
        const nextOnClick = () => {
            window.scrollTo(0, 0);
            if (this.state.donePage === this.state.currentPage) {
                this.setState({
                    ...this.state,
                    donePage: this.state.donePage + 1,
                    currentPage: this.state.currentPage + 1
                });
            } else {
                this.setState({
                    ...this.state,
                    currentPage: this.state.currentPage + 1
                });
            }
        };
        const confirmOnClick = () => {
            if (!this.state.postTitle) {
                alert('제목을 입력하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (!this.state.postSubtitle) {
                alert('부제목을 입력하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (!this.state.postExplain) {
                alert('내용을 입력하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (!this.state.postUrl && this.state.needUrl) {
                alert('URL을 입력하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (
                this.state.needUrl &&
                (this.state.postUrl.toString().length < 9 ||
                    (this.state.postUrl.toString().substring(0, 7) !==
                        'http://' &&
                        this.state.postUrl.toString().substring(0, 8) !==
                            'https://'))
            ) {
                alert('유효한 URL을 입력하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (!this.state.postTag) {
                if (!window.confirm('태그가 없습니다. 계속할까요?')) {
                    this.setState({ ...this.state, currentPage: 2 });
                    return;
                }
            }
            if (!this.state.postGoal) {
                alert('목표를 입력하세요');
                this.setState({ ...this.state, currentPage: 3 });
                return;
            }
            if (this.state.postGoal < 100) {
                alert('목표는 100뷰 이상이어야 합니다');
                this.setState({ ...this.state, currentPage: 3 });
                return;
            }
            if (!this.state.imagePreviewUrl) {
                alert('이미지를 업로드하세요');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }
            if (this.state.postFile.size > 1000000) {
                alert('사진 용량은 1MB 이하여야 합니다');
                return;
            }
            if (!this.state.postFile.name.match(/.(jpg|jpeg|png|bmp)$/i)) {
                alert('jpg, jpeg, png, bmp 형식 파일이 가능합니다');
                this.setState({ ...this.state, currentPage: 1 });
                return;
            }

            const request = {
                points: {
                    point: Number(
                        this.state.nowpoint - this.state.postGoal * multiplier
                    )
                },
                adpost: {
                    title: this.state.postTitle,
                    subtitle: this.state.postSubtitle,
                    content: this.state.postExplain,
                    image: [this.state.imagePreviewUrl],
                    ad_link: this.state.needUrl ? this.state.postUrl : '',
                    target_views: this.state.postGoal,
                    open_for_all: this.state.open_for_all,
                    expiry_date:
                        this.state.postDeadline.year +
                        '-' +
                        this.state.postDeadline.month +
                        '-' +
                        this.state.postDeadline.date,
                    tags: this.state.postTag.map(tag => {
                        return tag.name;
                    })
                }
            };
            this.props.onPostArticle(request);
            //this.props.history.push('/article/1');
        };
        const onCalendarChange = e => {
            this.setState({
                ...this.state,
                postDeadline: {
                    year: e.getYear() + 1900,
                    month: e.getMonth() + 1,
                    date: e.getDate()
                }
            });
        };
        const views = n => {
            let tenDay = new Date();
            tenDay.setTime(tenDay.getTime() + 10 * 24 * 3600 * 1000);
            return (
                <div className="article-create">
                    <div
                        className="configuration"
                        style={{
                            display:
                                this.state.currentPage == 1 ? 'block' : 'none'
                        }}>
                        <div className="form-group" align="center">
                            <h3 className="form-label">무슨 광고인가요?</h3>
                            <input
                                className="form-control"
                                id="post-title-input"
                                onChange={titleChangeHandler}
                                value={this.state.postTitle}
                            />
                        </div>
                        <div className="form-group" align="center">
                            <h3 className="form-label">한줄 설명</h3>
                            <input
                                className="form-control"
                                id="post-subtitle-input"
                                onChange={subtitleChangeHandler}
                                value={this.state.postSubtitle}></input>
                        </div>
                        <div className="form-group" align="center">
                            <h3 className="form-label">광고에 대해 자세히 알려주세요</h3>
                            <textarea
                                className="form-control"
                                id="post-explain-input"
                                onChange={explainChangeHandler}
                                value={this.state.postExplain}></textarea>
                        </div>
                        <div className="form-group" align="center">
                            <h3 className="form-label">
                                이미지를 업로드하세요
                            </h3>
                            <input
                                className="form-control"
                                type="file"
                                id="post-thumbnail-input"
                                multiple={false}
                                onChange={imageOnChange}
                            />
                            <div>{imagePreview}</div>
                        </div>
                        <div className="url-toggle-group toggle-group">
                            <text className="form-label">
                                외부 URL로 연결할까요?
                            </text>
                            <p />
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="toggle-input"
                                    onChange={() => {
                                        this.setState({
                                            ...this.state,
                                            needUrl: !this.state.needUrl
                                        });
                                    }}
                                />
                                <span class="slider round"></span>
                            </label>
                            <p className="urlToggle-helper-content helper">
                                {(this.state.needUrl && '입력한 Url') ||
                                    (!this.state.needUrl && '게시글')}
                                로 연결합니다
                            </p>
                        </div>
                        {this.state.needUrl && (
                            <div className="form-group" align="center">
                                <input
                                    className="form-control"
                                    id="post-url-input"
                                    onChange={urlChangeHandler}
                                    value={this.state.postUrl}></input>
                            </div>
                        )}
                        <p />
                        <br />
                        <button
                            className="btn btn-primary next-tab-btn"
                            id="next-button"
                            disabled={
                                !this.state.postTitle ||
                                (this.state.needUrl && !this.state.postUrl) ||
                                !this.state.postSubtitle ||
                                !this.state.postFile
                            }
                            onClick={nextOnClick}>
                            Next
                        </button>
                    </div>
                    <div
                        className="tagSelect"
                        style={{
                            display:
                                this.state.currentPage == 2 ? 'block' : 'none'
                        }}>
                        <ReactTags
                            tags={this.state.postTag}
                            placeholder="태그를 입력하세요"
                            suggestions={this.props.allTags}
                            handleDelete={this.handleDelete.bind(this)}
                            handleAddition={this.handleAddition.bind(this)}
                            allowNew={true}
                            handleValidate={this.handleValidate.bind(this)}
                            minQueryLength={1}
                        />
                        <div className="open-toggle-group toggle-group">
                            <div className="form-group" align="center">
                                <h3 className="form-label">전체공개</h3>
                            </div>
                            <p />
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="toggle-input"
                                    onChange={() => {
                                        this.setState({
                                            ...this.state,
                                            open_for_all: !this.state
                                                .open_for_all
                                        });
                                    }}
                                />
                                <span className="slider round"></span>
                            </label>
                            <p className="openToggle-helper-content helper">
                                게시글이{' '}
                                {(this.state.open_for_all && '모든 사용자') ||
                                    (!this.state.open_for_all &&
                                        '태그와 관련된 사용자')}
                                에게 공개됩니다
                            </p>
                        </div>
                        <button
                            className="btn btn-primary next-tab-btn"
                            id="next-tag-button"
                            disabled={!this.state.postTag.length}
                            onClick={nextOnClick}>
                            Next
                        </button>
                    </div>
                    <div
                        className="adGoal"
                        style={{
                            display:
                                this.state.currentPage == 3 ? 'block' : 'none'
                        }}>
                        <div className="form-group" align="center">
                            <h3 className="form-label">목표 뷰를 설정하세요</h3>
                            <input
                                className="form-control"
                                id="post-goal-input"
                                onChange={goalChangeHandler}
                                value={this.state.postGoal}
                            />
                        </div>
                        <div className="form-group" align="center">
                            <p
                                className="form-control"
                                id="post-point-deduction">
                                {this.state.postGoal
                                    ? this.state.postGoal * multiplier
                                    : 0}{' '}
                                포인트가 차감됩니다
                            </p>
                            <p
                                className="form-control"
                                id="post-point-deduction">
                                {this.state.postGoal
                                    ? this.state.nowpoint -
                                      this.state.postGoal * multiplier
                                    : this.state.nowpoint}{' '}
                                포인트가 남게 됩니다
                            </p>
                        </div>
                        <p />
                        <br />
                        <h3 className="form-label">만료일을 선택하세요</h3>
                        <div id="calender-wrapper">
                            <Calendar
                                id="select-calender"
                                minDate={tenDay}
                                onChange={onCalendarChange}
                            />
                        </div>
                        <p />
                        <br />
                        <button
                            className="btn btn-primary next-tab-btn"
                            id="next-button"
                            disabled={
                                !this.state.postGoal ||
                                !this.state.postDeadline.year
                            }
                            onClick={nextOnClick}>
                            Next
                        </button>
                    </div>
                    <div
                        className="payment"
                        style={{
                            display:
                                this.state.currentPage == 4 ? 'block' : 'none'
                        }}>
                        <ArticlePreview
                            article={{
                                title: this.state.postTitle,
                                subtitle: this.state.postSubtitle,
                                content: this.state.postExplain,
                                thumbnail: [this.state.imagePreviewUrl],
                                ad_link: this.state.needUrl
                                    ? this.state.postUrl
                                    : 'The link will be given after submission',
                                target_views: this.state.postGoal,
                                expiry_date:
                                    this.state.postDeadline.year +
                                    '-' +
                                    this.state.postDeadline.month +
                                    '-' +
                                    this.state.postDeadline.date,
                                tags: this.state.postTag.map(tag => {
                                    return tag.name;
                                })
                            }}
                        />
                        <div id="submit">
                            <button
                                className="btn btn-primary next-tab-btn"
                                id="confirm-button"
                                onClick={confirmOnClick}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className="ArticleCreate" align="center">
                <div className="CreateHead">
                    <section className="CreateHeadTitle section-wrapper">
                        <h1 className="CreateHeadTitle">소문내기</h1>
                        <p className="CreateHeadContent">
                            어떤 광고를 하시나요?
                        </p>
                    </section>
                    <section className="CreateHeadTabs section-wrapper">
                        {tabs()}
                    </section>
                </div>
                <div className="CreateBody section-wrapper">
                    {views(this.state.currentPage)}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onPostArticle: adpost => dispatch(adpostActions.postAdpost(adpost)),
        reloadUser: () => dispatch(userActions.getUser()),
        onTagReload: () => dispatch(tagActions.getAllTag())
    };
};

const mapStateToProps = state => {
    return {
        allTags: state.tag.all_tags
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCreate);
