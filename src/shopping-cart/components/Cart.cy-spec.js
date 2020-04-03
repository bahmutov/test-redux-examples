/// <reference types="cypress" />
import React from 'react'
import Cart from './Cart'
import {mount} from 'cypress-react-unit-test'

const setup = (total, products = []) => {
  const actions = {
    onCheckoutClicked: cy.stub().as('checkout')
  }

  mount(<Cart products={products} total={total} {...actions} />)

  // mini page object?
  return {
    em: () => cy.get(Cart).find('em')
  }
}

describe('Cart component', () => {
  it('should display total', () => {
    setup('76')
    cy.contains(/^Total: \$76/)
  })

  it('should display add some products message', () => {
    setup()
    cy.contains(/^Please add some products to cart/)
  })

  it.skip('can return page object', () => {
    // TODO figure out access to the component's element
    const { em } = setup()
    em().should('match', /^Please add some products to cart/)
  })

  it('should disable button', () => {
    setup()
    // expect(button.prop('disabled')).toEqual('disabled')
    cy.get('button').should('be.disabled')
  })

  describe('when given product', () => {
    const product = [
      {
        id: 1,
        title: 'Product 1',
        price: 9.99,
        quantity: 1
      }
    ]

    it('should render products', () => {
      setup('9.99', product)
      cy.get('[data-cy="product"]').should('have.length', 1)
        .first().should('have.text', 'Product 1 - $9.99 x 1')
    })

    it('should not disable button', () => {
      setup('9.99', product)
      cy.get('button').should('not.be.disabled')
    })

    it('should call action on button click', () => {
      setup('9.99', product)
      cy.get('button').click()
      cy.get('@checkout').should('have.been.called')
    })
  })
})
