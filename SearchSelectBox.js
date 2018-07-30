import React, { PureComponent } from 'react';
import cx from 'classnames';
import _last from 'lodash/last';

import SearchInput from './components/SearchInput';
import SearchOptionsMenu from './components/SearchOptionsMenu';
import getSuggestions from './mockServerApi';
import {
  getLastWord,
  getNewSearchQuery
} from "./searchSelectBoxHelper";

const EMPTY_ARRAY = [],
  KEY_CODES = {
    ENTER: 13,
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    BACKSPACE: 8,
  },
  INIT_SEARCH_RESULTS = {
    focusedOptionIndex: 0,
    isOpen: false, // to check whether dropdown in open
    searchResults: EMPTY_ARRAY,
  },
  INITIAL_STATE = {
    ...INIT_SEARCH_RESULTS,
    errorMessage: undefined,
    hasSavedOption: false, // to check for any previous selected suggestions
    isSearchInputFocused: false,
    loading: false,
    searchQuery: '',
    selectedOptions: EMPTY_ARRAY, // storing any suggestions selected from the dropdown
  };

class SearchSelectBox extends PureComponent {
  state = INITIAL_STATE;

  /**
   * when user types in the search box
   */
  handleSearch = searchQuery => {
    this.setState({
      searchQuery,
      searchResults: EMPTY_ARRAY, // if any previous results exists
      isOpen: !!searchQuery, // when we clear the input should close the dropdown
      focusedOptionIndex: 0,
      loading: true,
    }, this.fetchSearchSuggestions);
  };

  /**
   * on input blur we need to reset any suggestions we fetched and also any selectedOptions from dropdown
   */

  handBlur = () => {
    this.setState({
      ...INIT_SEARCH_RESULTS,
      isSearchInputFocused: false,
      selectedOptions: EMPTY_ARRAY,
    });
  }

  /*
    Clearing text when clicked on cross button
   */
  handleClearText = () => {
    this.setState({
      ...INITIAL_STATE,
      isSearchInputFocused: true, // need to keep input box focused
    });
  }

  handleInputFocus = () => {
    this.setState({
      isSearchInputFocused: true,
    });
  }

  handleRequestError = () => {
    this.setState({
      loading: false,
      errorMessage: 'Sorry, error while fetching suggestions'
    });
  }

  /*
    currently typing search query
   */
  getCurrentSearchQuery = () => {
    const { state: { selectedOptions, searchQuery } } = this;
    return selectedOptions.length ? getLastWord(searchQuery) : searchQuery.trim();
  }

  /**
   * fetching suggestions from mockServerApi call
   */
  fetchSearchSuggestions = () => {
    const targetQuery = this.getCurrentSearchQuery();
    if (targetQuery) {
      getSuggestions(targetQuery).then(response => {
        this.setState({
          errorMessage: undefined,
          searchResults: response,
          loading: false,
        })
      }, this.handleRequestError);
    }
  }

  /*
    Updating focused option index
   */
  handleFocusSearchOption = newFocusedOptionIndex => {
    this.setState({
      focusedOptionIndex: +newFocusedOptionIndex,
    });
  };

  /*
    when we select any menu option, we set that suggestion in the input box and reset searchResults
   */
  handleSelectSearchOption = () => {
    const { searchResults, focusedOptionIndex, selectedOptions } = this.state;
    const newQuery = searchResults[focusedOptionIndex];

    this.setState({
      searchQuery: getNewSearchQuery(newQuery, selectedOptions), // if any previous selected options exists
      selectedOptions: selectedOptions.concat(newQuery),
      ...INIT_SEARCH_RESULTS,
    });
  }

  handleKeyDown = event => {
    const { focusedOptionIndex, searchResults, searchQuery, selectedOptions } = this.state,
      searchResultsLength = searchResults.length,
      lastSearchMenuOptionIndex = searchResultsLength - 1;

    if (!searchResultsLength) return;

    switch (event.keyCode) {
      case KEY_CODES.ENTER: {
        if (this.state.isOpen) {
          this.handleSelectSearchOption();
        }
        break;
      }
      case KEY_CODES.ARROW_UP: {
        event.preventDefault(); // to maintain cursor position in input box
        const updatedFocusedOptionIndex = focusedOptionIndex === 0 ? lastSearchMenuOptionIndex : focusedOptionIndex - 1; // to maintain cyclic navigation
        this.handleFocusSearchOption(updatedFocusedOptionIndex);
        break;
      }
      case KEY_CODES.ARROW_DOWN: {
        const updatedFocusedOptionIndex = focusedOptionIndex === lastSearchMenuOptionIndex ? 0 : focusedOptionIndex + 1; // to maintain cyclic navigation
        this.handleFocusSearchOption(updatedFocusedOptionIndex);
        break;
      }
      case KEY_CODES.BACKSPACE: {
        if (event.target.tagName === 'INPUT' && selectedOptions.length) { // when we start pressing back space we check with last previously selectedOptions
          const lastWord = getLastWord(searchQuery);
          const lastSelectedOption = _last(selectedOptions);

          this.setState({
            selectedOptions: lastSelectedOption === lastWord ? selectedOptions.slice(0, -1) : selectedOptions,
          });
        }
      }
    }
  }

  renderSearchResults() {
    const { state } = this;

    return state.isOpen && !state.loading && (
      <SearchOptionsMenu
        errorMessage={state.errorMessage}
        focusedOptionIndex={state.focusedOptionIndex}
        menuOptions={state.searchResults}
        onMouseDown={this.handleSelectSearchOption}
        onMouseOver={this.handleFocusSearchOption}
        searchQuery={this.getCurrentSearchQuery()}
      />
    );
  }

  renderSearchInput() {
    const { state } = this;
    return (
      <SearchInput
        clearText={this.handleClearText}
        isFocused={state.isSearchInputFocused}
        onBlur={this.handBlur}
        onChange={this.handleSearch}
        onFocus={this.handleInputFocus}
        value={state.searchQuery}
      />
    );
  }

  render() {
    return (
      <div
        className={cx('search-box', { 'search-box--expanded': this.state.isSearchInputFocused })}
        onKeyDown={this.handleKeyDown}
      >
        {this.renderSearchInput()}
        {this.renderSearchResults()}
      </div>
    );
  }
}

export default SearchSelectBox;