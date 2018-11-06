import 'jsdom-global/register'; //at the top of file , even  , before importing react

import React from 'react';
import { Route, Switch } from "react-router-dom";
import { mount, shallow } from "enzyme";

import { MemoryRouter } from "react-router";
import App from '../../src/components/App';
import HomePage from '../../src/components/HomePage';
import BFF from '../../src/components/BFF';


describe('<App />', () =>{
  it('selectable by id "#app"', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('#app').length).toBe(1);
  });
});

const renderRoutes = path =>
  mount(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe("#routes", () => {
  it("renders home page on initial route", () => {
    const component = renderRoutes("/");
    expect(component.contains(HomePage)).toEqual(true);
  });

  it("renders the editor page", () => {
    const component = renderRoutes("/editor");
    expect(component.contains(BFF)).toEqual(true);
  });

  it("renders a 404", () => {
    const component = renderRoutes("/blah");
    expect(component.contains(<h1>404</h1>)).toEqual(true);
  });
});