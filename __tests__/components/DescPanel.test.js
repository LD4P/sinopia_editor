import React from 'react';
import { shallow, render } from 'enzyme';
import DescPanel from '../../src/components/DescPanel';

describe('<DescPanel />', () => {
  it ('renders the grant description above the footer', () => {
    const wrapper = shallow(<DescPanel />)
    expect(wrapper.find("div.desc-panel")).toBeDefined()
  });
});
