describe('smoke tests', () => {
  it('should allow you to register and login', () => {
    cy.visit('/');

    cy.findByRole('heading', { name: /blog posts/i });
  });
});
