import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-multi-carousel';
import Preview from '../Preview/Preview';
import { history } from '../../store';
import 'react-multi-carousel/lib/styles.css';
import './PreviewList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const responsive_compact = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

class PreviewList extends React.Component {
    clickPreviewHandler = id => {
        history.push(`/article/${id}`);
    };

    clickSearchMoreHandler = () => {
        history.push(
            `/adposts/search/${this.props.query_type}/${this.props.query}`
        );
    };

    render() {
        return (
            <div className="PreviewList">
                <h3 className="list-title">{this.props.query}</h3>
                <div className="title-under-line"></div>
                {this.props.articles
                    ? this.props.articles.map(item => (
                          <Preview
                              key={item}
                              preview={item}
                              clickPreview={() =>
                                  this.clickPreviewHandler(item.id)
                              }
                          />
                      ))
                    : null}
                <div id="card-more-btn" onClick={this.clickSearchMoreHandler}>
                    <div id="card-more-text">
                        <div id="plus-btn">+</div>
                        <div id="more-text">
                            {this.props.query} 관련 <br />
                            게시글 더 보기
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

PreviewList.propTypes = {
    articles: PropTypes.any,
    query: PropTypes.string,
    query_type: PropTypes.string
};

export default PreviewList;
