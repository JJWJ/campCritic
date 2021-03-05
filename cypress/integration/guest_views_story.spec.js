/// <reference types="cypress" />

describe('Views from non auth', () => {
	it('Home page should load', () => {
		cy.visit('/');
		cy
			.get('[data-test-id="welcome-message"]')
			.should('contain.text', 'Welcome to CampCritic!');
	});

	it('campground should load', () => {
		cy.visit('http://localhost:3000/campground');
		cy.get('[data-test-id="button"]').should('exist');
	});

	it('show page should load', () => {
		cy.visit('http://localhost:3000/campground');
		cy.get('[data-test-id="button"]').first().click({ force: true });
		cy.get('li').contains('Submitted by').should('exist');
	});

	it('login page should load from campground', () => {
		cy.visit('http://localhost:3000/campground');
		cy.get('[data-test-id="nav-login"]').click();
		cy.get('[data-test-id="login-p"]').should('exist');
	});

	it('register page should load from campground', () => {
		cy.visit('http://localhost:3000/campground');
		cy.get('[data-test-id="nav-register"]').click();
		cy.get('[data-test-id="register-p"]').should('exist');
	});

	it('login page should load from Home', () => {
		cy.visit('http://localhost:3000/Home');
		cy.get('[data-test-id="home-nav-login"]').click();
		cy.get('[data-test-id="login-p"]').should('exist');
	});

	it('register page should load from Home', () => {
		cy.visit('http://localhost:3000/Home');
		cy.get('[data-test-id="home-nav-register"]').click();
		cy.get('[data-test-id="register-p"]').should('exist');
	});
});
