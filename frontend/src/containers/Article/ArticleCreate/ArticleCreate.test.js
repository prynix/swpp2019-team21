import React from 'react';
import { shallow } from 'enzyme';
import ArticleCreate from './ArticleCreate';
import { history } from '../../../store';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { render } from 'enzyme';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { getMockStore } from '../../../test/utils/mockStore';
import { userActions, adpostActions, tagActions } from '../../../store/actions';

const stubInitialState = {
    all_tags: [],
    user: {
        user_id: 1,
        first_name: 'Mocked_firstname',
        last_name: 'Mocked_lastname',
        nickname: 'Mocked_nickname',
        email: 'Mocked_email',
        point: 10000,
        tags: ['test', 'test2'],
        pic: '123'
    }
};
const mockStore = getMockStore(stubInitialState);

function MockFile() {}

MockFile.prototype.create = function(name, size, mimeType) {
    name = name || 'mock.txt';
    size = size || 1024;
    mimeType = mimeType || 'plain/txt';

    function range(count) {
        var output = '';
        for (var i = 0; i < count; i++) {
            output += 'a';
        }
        return output;
    }

    var blob = new Blob([range(size)], { type: mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = name;

    return blob;
};

describe('<ArticleCreate/>', () => {
    let articleCreate,
        spyOnGetUser,
        spyOnGetAllTag,
        spyOnPostAdPost,
        spyHistoryPush,
        spyOnAlert,
        spyOnConfirm,
        varConfirm;
    beforeEach(() => {
        articleCreate = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path="/" exact component={ArticleCreate} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
        varConfirm = false;
        spyOnGetUser = jest
            .spyOn(userActions, 'getUser')
            .mockImplementation(() => {
                return dispatch => {
                    return new Promise((resolve, reject) =>
                        resolve(stubInitialState)
                    );
                };
            });
        spyOnGetAllTag = jest
            .spyOn(tagActions, 'getAllTag')
            .mockImplementation(() => {
                return dispatch => {
                    return new Promise((resolve, reject) =>
                        resolve(stubInitialState)
                    );
                };
            });
        spyOnAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
        spyOnConfirm = jest
            .spyOn(window, 'confirm')
            .mockImplementation(input => {
                return varConfirm;
            });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should render without errors', async done => {
        const component = mount(articleCreate);
        setTimeout(() => {
            done();
        }, 1000);
        await component.update();
        expect(spyOnGetUser).toHaveBeenCalledTimes(1);
        const wrapper = component.find('.article-create');
        expect(wrapper.length).toBe(1);
    });
    it('should not be confirmed if something is empty', async done => {
        const component = mount(articleCreate);
        setTimeout(() => {
            done();
        }, 1000);
        await component.update();
        const wrapper = component.find('#confirm-button');
        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(1);

        const title_wrapper = component.find('#post-title-input');
        title_wrapper.simulate('change', {
            target: { value: 'Sample_title' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(2);

        const subtitle_wrapper = component.find('#post-subtitle-input');
        subtitle_wrapper.simulate('change', {
            target: { value: 'Sample_subtitle' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(3);

        const explain_wrapper = component.find('#post-explain-input');
        explain_wrapper.simulate('change', {
            target: { value: 'Sample_Description' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(4);

        const mock = new MockFile();
        const file = mock.create('mocked_image.jpg', 65535, 'image/jpeg');
        const thumbnail_wrapper = component.find('#post-thumbnail-input');
        thumbnail_wrapper.simulate('change', {
            target: { files: [file] }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(5);

        const url_wrapper = component.find('#post-url-input');
        url_wrapper.simulate('change', {
            target: { value: 'Sample_url' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(6);

        url_wrapper.simulate('change', {
            target: { value: 'https://www.naver.com' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(7);

        varConfirm = true;
        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(8);

        const detailinstance = component
            .find(ArticleCreate.WrappedComponent)
            .instance();

        const mocktags = ['SNU', 'Mock tags', 'HaHa'];
        detailinstance.handleAddition(mocktags);
        detailinstance.handleDelete(1);

        const goal_wrapper = component.find('#post-goal-input');
        goal_wrapper.simulate('change', {
            target: { value: 'a' }
        });
        goal_wrapper.simulate('change', {
            target: { value: '1' }
        });

        wrapper.simulate('click');
        expect(spyOnAlert).toHaveBeenCalledTimes(9);

        const calendar_wrapper = component.find('#post-calendar-input');
        calendar_wrapper.simulate('change', {
            getYear: () => {
                return 119;
            },
            getMonth: () => {
                return 1;
            },
            getDate: () => {
                return 1;
            }
        });
    });
});