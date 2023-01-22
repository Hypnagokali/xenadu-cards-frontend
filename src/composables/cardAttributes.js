const getGenderClass = function (card) {
  if (!card.noun) return '';
  if (card.gender === 'm') return 'masculine';
  if (card.gender === 'f') return 'feminine';
  if (card.gender === 'n') return 'neuter';
};

const getGenderChar = function (card) {
  console.log('GET GENDER CHAR');
  console.log(card.gender);
  if (card.gender) {
    return `(${card.gender})`;
  }
};

export default {
  getGenderChar,
  getGenderClass,
};
