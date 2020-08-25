// Copyright 2018 Stanford University see LICENSE for license

import * as awsCognito from 'amazon-cognito-identity-js'
import {
  fireEvent, screen, waitForElementToBeRemoved,
} from '@testing-library/react'

import { createState } from 'stateUtils'
import { createStore, renderApp } from 'testUtils'

jest.mock('amazon-cognito-identity-js')

function MockCognitoUserAuthenticationSuccess(_userData) {
  this.username = 'Baz Le Quux'
  this.authenticateUser = (_authnDetails, callbacks) => {
    callbacks.onSuccess({ currentSession: { idToken: {} } })
  }
}

function MockCognitoUserAuthenticationFailure(_userData) {
  this.username = 'Baz Le Quux'
  this.authenticateUser = (_authnDetails, callbacks) => {
    callbacks.onFailure({
      code: 'NotAuthorizedException', name: 'NotAuthorizedException', message: 'Incorrect username or password.',
    })
  }
}


describe('user authentication', () => {
  it('allows a logged in user to log out and allows a new one to login', async () => {
    renderApp()
    screen.getByText(/Foo McBar/) // user Foo McBar should be logged in already when using default test redux store

    // logout, and confirm that the UI gets rid of the old user name
    // and removes elements that require authentication to view
    fireEvent.click(screen.getByRole('link', { name: 'Logout' }))

    // likely that things will have already re-rendered, but if not, wait for it
    if (screen.queryByText(/Foo McBar/)) {
      await waitForElementToBeRemoved(() => screen.getByText(/Foo McBar/))
    }
    // check for elements indicating we were sent back to the login page
    expect(screen.queryByRole('link', { name: 'Logout' })).not.toBeInTheDocument()
    screen.getByText(/Latest news/)
    screen.getByText(/Sinopia Version \d+.\d+.\d+ highlights/)
    screen.getByRole('link', { name: 'Sinopia help site' })

    awsCognito.CognitoUser.mockImplementation(MockCognitoUserAuthenticationSuccess)

    // login as a different user
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'baz.le.quux@example.edu' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Password2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    // make sure we get the expected username and page elements
    await screen.findByText(/Baz Le Quux/)
    await screen.findByRole('link', { name: 'Logout' })
  })

  it('presents a helpful error when the user enters the wrong password', async () => {
    const state = createState({ notAuthenticated: true })
    const store = createStore(state)
    renderApp(store)

    // confirm that it appears user is not logged in
    expect(screen.queryByRole('link', { name: 'Logout' })).not.toBeInTheDocument()
    screen.getByText(/Latest news/)
    screen.getByText(/Sinopia Version \d+.\d+.\d+ highlights/)
    screen.getByRole('link', { name: 'Sinopia help site' })

    awsCognito.CognitoUser.mockImplementation(MockCognitoUserAuthenticationFailure)

    // try to login
    fireEvent.change(screen.getByLabelText('User name'), { target: { value: 'baz.le.quux@example.edu' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    // an error message should be presented
    await screen.findByText(/Incorrect username or password./)
  })
})
