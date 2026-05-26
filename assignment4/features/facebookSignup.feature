Feature: Facebook account registration

  Scenario: Submit the signup form with valid user details
    Given I open the Facebook signup page
    When I enter a first name and surname
    And I select my date of birth
    And I select my gender
    And I enter a valid email address
    And I enter a valid password
    And I click Submit
    Then I should see the email confirmation code form