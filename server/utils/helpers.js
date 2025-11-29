function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generateAvatarUrl = (seed) => `${process.env.AVATAR_URL}${seed}.svg`;

function generateUserData() {
  return {
    about: '',
    rate: randomInt(1, 5),
    bookmark: false,
    completedMeetings: randomInt(0, 100),
    image: generateAvatarUrl(
      `${(Math.random() + 1).toString(36).substring(7)}`
    ),
  };
}

module.exports = {
  generateUserData,
};
