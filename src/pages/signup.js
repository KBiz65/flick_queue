// pages/signup.js or wherever you have your signup form

export default function Signup() {
  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submit action

    const formData = new FormData(event.target);
    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    // Send the form data to your API route
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, email, username, password }),
    });

    if (!response.ok) {
      // Handle response errors (e.g., username already exists, invalid input)
      console.error("Signup failed");
      // You could also update the UI to reflect the error
      return;
    }

    // Handle successful signup (e.g., redirect to login page, show success message)
    console.log("Signup successful");
    // Redirect to login page or another appropriate action
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="firstname">First Name:</label>
        <input type="text" id="firstname" name="firstname" required />
        <label htmlFor="lastname">First Name:</label>
        <input type="text" id="lastname" name="lastname" required />
      </div>
      <div>
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required minLength="6" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required minLength="8" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}
