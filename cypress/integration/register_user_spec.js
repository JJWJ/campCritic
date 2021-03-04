/// <reference types="cypress" />

describe('The Register User Story', () => {
	beforeEach(() => {
		cy.exec('node seeds/index.js');
	});

	it('goes to Register', () => {
		cy.visit('/');
		cy.contains('View Campgrounds').click();
		cy.url().should('include', '/campground');
		cy.contains('Register').click();
		cy.url().should('include', '/register');
		cy
			.get('#username')
			.type('cypressTest')
			.should('have.value', 'cypressTest');
		cy.get('#password').type('password');
		cy.get('#email').type('cypressTest@Test.com');
		//Forced because cypress wont scroll in its viewport
		cy.get('button[name=registerBtn]').click({ force: true });
		cy.url().should('include', '/campground');
	});
});
