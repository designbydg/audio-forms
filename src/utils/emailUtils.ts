// Simple email obfuscation to help prevent spam
export const deobfuscateEmail = () => {
  const parts = ['hello', 'getaudioforms', 'com'];
  return `${parts[0]}@${parts[1]}.${parts[2]}`;
};

export const getEmailLink = () => {
  const email = deobfuscateEmail();
  const subject = encodeURIComponent("We'd Love to Hear from You");
  return `mailto:${email}?subject=${subject}`;
};