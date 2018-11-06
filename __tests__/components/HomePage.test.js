import React from 'react';
import { shallow } from 'enzyme';
import HomePage from '../../src/components/HomePage';
import Header from '../../src/components/Header';
import NewsPanel from '../../src/components/NewsPanel';
import DescPanel from '../../src/components/DescPanel';


describe('<HomePage />', () =>{
  it('should be selectable by id "app"', () => {
    expect(shallow(<HomePage />).is('#home-page')).toBe(true);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <HomePage>
        <Header />
        <NewsPanel />
        <DescPanel />
      </HomePage>
    ));
    expect(wrapper.contains(<Header />)).toBe(true);
    expect(wrapper.contains(<NewsPanel />)).toBe(true);
  });


  it('renders three <HomePage /> components', () => {
    const wrapper = shallow(<HomePage />);
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(NewsPanel).length).toBe(1);
    expect(wrapper.find(DescPanel).length).toBe(1);

  });
});

