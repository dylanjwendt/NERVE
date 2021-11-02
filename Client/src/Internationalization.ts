type TranslationDict = {
  [key: string]: string
}

/**
 * Localizing tagged template literal, takes in translation key and optional substitions
 * and returns the translated string.
 * 
 * Example:
 * If your lang file is like this:
 * ```text
 * text.hello=Hello %1
 * ```
 * 
 * You can get the translation like this:
 * ```javascript
 * const param = "World";
 * tl`text.hello ${param}`;
 * // Return value: "Hello World"
 * ```
 */
export type TemplateLocalizerFunction = (strings: TemplateStringsArray, ...substitutions: string[]) => string

/**
 * Localizer function, takes in translation key and optional substitions and returns the translated string.
 * 
 * Example:
 * If your lang file is like this:
 * ```text
 * text.hello=Hello %1
 * ```
 * 
 * You can get the translation like this:
 * ```javascript
 * localize("text.hello", "World");
 * // Return value: "Hello World"
 * ```
 */
export type LocalizerFunction = (translationKey: string, ...substitutions: string[]) => string

function localize(translations: TranslationDict, key: string, substitutions: string[]): string {
  let template = translations[key];
  if (!template) {
    console.error(`Warning: ${key} is missing translation in current locale.`);
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

/**
 * Fetches the given locale's language file and returns a tagged template literal localizer.
 * You can use the returned function to translate strings using a localization key, and also substitute
 * parameters in the translation like this:
 * 
 * ```javascript
 * const tl = getTemplateLocalizer("en_US");
 * const translation = tl`your.translation.key ${param1} ${param2}`
 * ```
 * 
 * @param locale The lang file to fetch
 * @param path The path to retrieve the lang file from. Defaults to /res/lang
 * @returns Template localizer
 */
export async function getTemplateLocalizer(locale: string, path?: string): Promise<TemplateLocalizerFunction> {
  const translations = await fetchLangFile(locale, path);

  return function(strings: TemplateStringsArray, ...substitutions: string[]) {
    const key = strings[0].trim();
    return localize(translations, key, substitutions);
  };
}

/**
 * Fetches the given locale's language file and returns a translation function.
 * You can use the returned function to translate strings using a localization key, and also substitute
 * parameters in the translation like this:
 * 
 * ```javascript
 * const localize = getTemplateLocalizer("en_US");
 * const translation = localize("your.translation.key", param1, param2)
 * ```
 * 
 * @param locale The lang file to fetch
 * @param path The path to retrieve the lang file from. Defaults to /res/lang
 * @returns Template localizer
 */
export async function getLocalizer(locale: string, path?: string): Promise<LocalizerFunction> {
  const translations = await fetchLangFile(locale, path);

  return function(translationKey: string, ...substitutions: string[]) {
    return localize(translations, translationKey, substitutions);
  };
}
