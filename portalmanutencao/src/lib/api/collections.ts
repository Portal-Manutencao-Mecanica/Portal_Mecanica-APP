export function getCollectionItems<T>(data: unknown, resourceName: string): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data !== null
    && typeof data === 'object'
    && 'content' in data
    && Array.isArray(data.content)
  ) {
    return data.content as T[];
  }

  throw new Error(
    `A API retornou um formato inv\u00e1lido para a lista de ${resourceName}.`,
  );
}
