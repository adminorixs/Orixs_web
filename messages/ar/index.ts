// Feature dictionaries for this locale, merged into one message tree.
import meta from './meta.json';
import common from './common.json';
import home from './home.json';
import about from './about.json';
import pricing from './pricing.json';
import legal from './legal.json';
import content from './content.json';
import payment from './payment.json';
import copilot from './copilot.json';

const messages = {
  Meta: meta,
  Common: common,
  Home: home,
  About: about,
  Pricing: pricing,
  Legal: legal,
  Content: content,
  Payment: payment,
  Copilot: copilot,
};

export default messages;
