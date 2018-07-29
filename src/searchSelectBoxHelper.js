/**
 * @param searchQuery: Shape(string)
 * get last word from the sentece,
 */
export const getLastWord = searchQuery => {
  const wordsArray = searchQuery.split(' ');
  return wordsArray[wordsArray.length -1];
};

/*
 * @param newQuery: Shape(String)
 * @param selectOptions: any previously selected suggestions from the dropdown menu Shape(Array)
 * @return Concat newly selected option with any existing selected queries
 */
export const getNewSearchQuery = (newQuery, selectedOptions) => {
  const selectedSuggestions = selectedOptions.join(' ');
  return selectedSuggestions ? `${selectedSuggestions} ${newQuery} ` : `${newQuery} `;
};
