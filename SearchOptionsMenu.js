import React from 'react';
import PropTypes from 'prop-types';
import MenuOption from './MenuOption';

import _escapeRegExp from "lodash/escapeRegExp";

const EMPTY_MESSAGE = 'No suggestions found';

/**
 * @param string: search result option Shape(String)
 * @param subString: query entered Shape(String)
 * @param className: String
 * @returns {*}
 */
function getHighlightedSearchResult (string, subString, className) {
  const regExp = new RegExp(_escapeRegExp(subString), 'ig'), // to escape special characters
    result = regExp.exec(string);

  if (result) {
    const startingIndex = result.index, // starting index of result in the string
      subStringLength = subString.length,
      endIndex = startingIndex + subStringLength; // end index of the result in the string
    return (
      <span>
        {startingIndex > 0 && string.substring(0, startingIndex)}
        <span className={className}>{string.substring(startingIndex, endIndex)}</span>
        {endIndex < string.length && string.substring(endIndex)}
      </span>
    );
  }
  return string;
}

class SearchOptionsMenu extends React.Component {
  renderOption = (option, index) => {
    return (
      <MenuOption
        {...this.props}
        optionIndex={index}
        key={index}
      >
        {getHighlightedSearchResult(option, this.props.searchQuery, 'highlightText')}
      </MenuOption>
    )

  };

  render() {
    const { menuOptions, errorMessage } = this.props;

    if (errorMessage || !menuOptions.length) {
      const text = errorMessage || EMPTY_MESSAGE;
      return (
        <div className="searchMenu">
          <div className="emptyMenu">{text}</div>
        </div>
      );
    }

    return (
      <div className="searchMenu">
        {menuOptions.map(this.renderOption)}
      </div>
    );
  }
}

SearchOptionsMenu.propTypes = {
  errorMessage: PropTypes.string,
  focusedOptionIndex: PropTypes.number,
  searchQuery: PropTypes.string,
  menuOptions: PropTypes.array.isRequired,
};

export default SearchOptionsMenu;