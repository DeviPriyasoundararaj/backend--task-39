const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Simulated database
const users = [
  { email: 'example@example.com', password: 'hashedpassword' }
];
const resetTokens = [];

// Forgot Password route
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = generateToken();
  resetTokens.push({ email, token });
  // Send email with token link here
  res.json({ message: 'Password reset email sent' });
});

// Reset Password route
app.post('/api/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetToken = resetTokens.find(item => item.token === token);
  if (!resetToken) {
    return res.status(404).json({ message: 'Invalid or expired token' });
  }

  // Update user's password in the database
  const userIndex = users.findIndex(user => user.email === resetToken.email);
  users[userIndex].password = password;

  // Remove token from resetTokens array
  resetTokens.splice(resetTokens.indexOf(resetToken), 1);

  res.json({ message: 'Password reset successfully' });
});

// Generate a random token
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
