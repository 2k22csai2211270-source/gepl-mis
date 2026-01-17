export function paginate(data, page, size) {
  const start = (page - 1) * size;
  return data.slice(start, start + size);
}

export function filterBySearch(data, search, keys) {
  return data.filter(item =>
    keys.some(k =>
      String(item[k]).toLowerCase().includes(search.toLowerCase())
    )
  );
}
