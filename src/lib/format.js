// Response shaping so route handlers stay thin.

export function itemResponse(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    location: item.location,
    addedAt: item.addedAt
  };
}

export function listResponse(items) {
  return {
    count: items.length,
    items: items.map(itemResponse)
  };
}

export function paginatedListResponse(items, { total, page, offset }) {
  return {
    count: items.length,
    total,
    page,
    hasMore: offset + items.length < total,
    items: items.map(itemResponse)
  };
}

export function errorResponse(errors) {
  return { errors: Array.isArray(errors) ? errors : [errors] };
}
