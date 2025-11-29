const { check } = require('express-validator');

function buildValidators(config, fields) {
  const chains = [];

  for (const field of fields) {
    const rules = config[field];
    if (!rules) continue;

    let chain = check(field);

    for (const method in rules) {
      const rule = rules[method];
      const msg = rule.message;

      switch (method) {
        case 'isRequired':
          chain = chain.notEmpty().withMessage(msg);
          break;
        case 'isEmail':
          chain = chain.isEmail().withMessage(msg);
          break;
        case 'noCyrillic':
          chain = chain.matches(/^[^\u0400-\u04FF]*$/).withMessage(msg);
          break;
        case 'isCapitalSymbol':
          chain = chain.matches(/[A-Z]/).withMessage(msg);
          break;
        case 'isContainDigit':
          chain = chain.matches(/\d/).withMessage(msg);
          break;
        case 'min':
          chain = chain.isLength({ min: rule.value }).withMessage(msg);
          break;
        case 'max':
          chain = chain.isLength({ max: rule.value }).withMessage(msg);
          break;
        case 'minIfNotEmpty':
          chain = chain.custom((value) => {
            const s = (value || '').trim();
            if (s.length > 0 && s.length < rule.value) throw new Error(msg);
            return true;
          });
          break;
        case 'noHTML':
          chain = chain.custom((value) => {
            if (/<\/?[a-z][\s\S]*>/i.test(String(value || ''))) {
              throw new Error(msg);
            }
            return true;
          });
          break;
        case 'isImageUrl':
          chain = chain
            .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i)
            .withMessage(msg);
          break;
        default:
          break;
      }
    }

    chains.push(chain);
  }

  return chains;
}

module.exports = { buildValidators };
