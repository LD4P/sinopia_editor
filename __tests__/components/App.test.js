import React from 'react';
import { shallow } from 'enzyme';
import App from '../../src/components/App';
import Header from '../../src/components/Header';
import NewsPanel from '../../src/components/NewsPanel';


describe('<App />', () =>{
  it('should be selectable by id "app"', () => {
    expect(shallow(<App />).is('#app')).toBe(true);
  });

  it('renders children when passed in', () => {
    const wrapper = shallow((
      <App>
        <Header />
        <NewsPanel />
      </App>
    ));
    expect(wrapper.contains(<Header />)).toBe(true);
    expect(wrapper.contains(<NewsPanel />)).toBe(true);
  });

  it('renders an "#app"', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('#app').length).toBe(1);
  });

  it('renders two <App /> components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(NewsPanel).length).toBe(1);
  });


});