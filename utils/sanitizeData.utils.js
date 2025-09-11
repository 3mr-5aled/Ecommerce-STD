exports.sanitaizeUserData = (user) => {
  if (!user) return null;
  const sanitizedUser = { ...user._doc };
  delete sanitizedUser.password;
  delete sanitizedUser.__v;
  delete sanitizedUser.role;
  delete sanitizedUser.passwordChangedAt;
  delete sanitizedUser.passwordResetToken;
  delete sanitizedUser.passwordResetExpires;
  delete sanitizedUser.passwordResetVerified;
  return sanitizedUser;
};
