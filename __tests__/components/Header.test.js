import React from 'react';
import { shallow, render } from 'enzyme';
import Header from '../../src/components/Header';
import SinopiaLogo from '../../styles/sinopia-logo.png'

describe('<Header />', () => {
  it('renders the Sinopia image', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find("img").prop('src')).toEqual(SinopiaLogo);
  });

  it ('renders a ".navbar" w/ 4 dropdown menu options', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('.navbar').length).toBe(1);
    expect(wrapper.find('.divider').length).toBe(4);
  });

  it ('renders a dropdown menu option', () => {
    const wrapper = shallow(<Header />)
    expect(wrapper.find('a[href="#"]').at(0).text()).toEqual("Help and Resources")
    expect(wrapper.find('a[href="#"]').at(3).text()).toEqual("E-mail Sinopia group")
  });
});

