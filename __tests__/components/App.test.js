import React from 'react';
import { shallow } from 'enzyme';
import App from '../../src/components/App';

describe('<App />', () =>{
  it("contains a div with an id", () => {
    const wrapper = shallow(<App />)
    expect(wrapper.contains(<div id="app" />)).to.equal(true);
  })
})