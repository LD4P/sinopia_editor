import React from 'react';
import { shallow, render } from 'enzyme';
import NewsItem from '../../src/components/NewsItem';

describe('<NewsItem />', () => {
  it ('renders the latest news', () => {
    const wrapper = shallow(<NewsItem />)
    expect(wrapper.find("div.news-item")).toBeDefined()
  });
});
