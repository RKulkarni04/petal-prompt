Feature: Ask a question to multiple LLMs

  Scenario: User visits the homepage
    Given I open the application
    Then I should see the app title

  Scenario: User submits an empty question
    Given I open the application
    When I click the submit button without entering a question
    Then I should see a validation message

  Scenario: User enters a question and submits it
    Given I open the application
    When I enter "What is artificial intelligence?"
    And I click the submit button
    Then I should be taken to the results page