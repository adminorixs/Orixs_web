export const formatPlatformName = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'rini-insurance': return 'Insurance';
    case 'rini-dev': return 'Orixs';
    case 'rini-intern-africa': return 'Construction';
    case 'rini-construction': return 'Scene One';
    case 'rini-talent': return 'Intern Africa';
    default: return name;
  }
};
