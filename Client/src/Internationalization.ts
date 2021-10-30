type TranslationDict = {
  [key: string]: string
}

export type TemplateLocalizerFunction = (strings: TemplateStringsArray, ...substitutions: string[]) => string
export type LocalizerFunction = (translationKey: string, ...substitutions: string[]) => string

function localize(translations: TranslationDict, key: string, substitutions: string[]): string {
  let template = translations[key];
  if (!template) {
    return key;
  }

  // replace substitutions left to right
  for (const sub of substitutions) {
    // (?<!\\) ensures the percent is not "escaped" by \
    template = template.replace(/(?<!\\)%\d/, sub);
  }

  return template;
}

async function fetchLangFile(locale: string, path?: string): Promise<TranslationDict> {
  if(!path) {
    path = "/res/lang";
  }

  const response = await fetch(`${path}/${locale}.txt`);

  const lines = (await response.text()).split("\n");
  const translations: TranslationDict = {};
  for (const line of lines) {
    if(!line) { continue; }
    const [key, template] = line.split("=");
    translations[key] = template;
  }

  return translations;
}

export async function getTemplateLocalizer(locale: string, path?: string): Promise<TemplateLocalizerFunction> {
  const translations = await fetchLangFile(locale, path);

  return function(strings: TemplateStringsArray, ...substitutions: string[]) {
    const key = strings[0].trim();
    return localize(translations, key, substitutions);
  };
}

export async function getLocalizer(locale: string, path?: string): Promise<LocalizerFunction> {
  const translations = await fetchLangFile(locale, path);

  return function(translationKey: string, ...substitutions: string[]) {
    return localize(translations, translationKey, substitutions);
  };
}
