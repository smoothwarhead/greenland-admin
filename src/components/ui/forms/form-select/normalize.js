function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function normalizeOptions(options, config = {}) {
  const {
    getLabel,          // (item) => string
    getValue,          // (item) => any
    labelKey = "label",
    valueKey = "value",
  } = config;

  if (!Array.isArray(options)) return [];

  return options.map((item, idx) => {
    // primitives: string/number/boolean
    if (!isObject(item)) {
      return {
        __raw: item,
        label: String(item),
        value: item,
        key: `${typeof item}:${String(item)}:${idx}`,
      };
    }

    // objects: prefer user-provided getters
    const label =
      typeof getLabel === "function"
        ? getLabel(item)
        : item[labelKey] ?? item.name ?? item.title ?? String(item[valueKey] ?? idx);

    const value =
      typeof getValue === "function"
        ? getValue(item)
        : item[valueKey] ?? item.id ?? item.key ?? label;


    
        // console.log(label, value);

    return {
      __raw: item,
      label: String(label),
      value,
      key: String(value),
    };
  });
}
